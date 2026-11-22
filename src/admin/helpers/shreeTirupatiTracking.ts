export const SHREE_TIRUPATI_COURIER_ID = 62;
export const SHREE_TIRUPATI_ORIGIN = 'https://www.shreetirupaticourier.net';
export const SHREE_TIRUPATI_TRACKING_FORM_PATH = '/TopHeader.aspx';
export const SHREE_TIRUPATI_DOC_LIST_PATH = '/Frm_DocList.aspx';

/**
 * Relative template used by the public tracking UI. The admin resolver expands
 * it into a redirect to the courier's generated document-list URL.
 */
export const SHREE_TIRUPATI_RESOLVER_PATH = '/api/tracking/shree-tirupati?awb=<AWB>';

const TRACKING_CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_AWB_LENGTH = 20;
const USER_AGENT = 'Mozilla/5.0 (compatible; FrontlineCourierTracking/1.0; +https://www.frontlinecourier.com)';

export class ShreeTirupatiTrackingError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = 'ShreeTirupatiTrackingError';
    this.statusCode = statusCode;
  }
}

export type ShreeTirupatiFormFields = {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
};

export type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

export type ResolveShreeTirupatiOptions = {
  fetchImpl?: FetchLike;
  origin?: string;
  timeoutMs?: number;
  now?: () => number;
};

type CacheEntry = {
  url: string;
  expiresAt: number;
};

const trackingCache = new Map<string, CacheEntry>();

export function clearShreeTirupatiTrackingCache() {
  trackingCache.clear();
}

function isCourierHostname(hostname: string) {
  const normalized = hostname.toLowerCase();
  return normalized === 'shreetirupaticourier.net' || normalized.endsWith('.shreetirupaticourier.net');
}

/**
 * Detects the Shree Tirupati courier even when the stored database row still
 * contains the old (broken) `Frm_DocTrack.aspx?docno=<AWB>` link.
 */
export function isShreeTirupatiCourier(courier: Record<string, any> | null | undefined): boolean {
  if (!courier) {
    return false;
  }

  if (Number(courier.CourierId) === SHREE_TIRUPATI_COURIER_ID) {
    return true;
  }

  const name = typeof courier.Courier === 'string' ? courier.Courier : '';
  if (/shree\s*tirupat(h)?i/i.test(name)) {
    return true;
  }

  const track = typeof courier.Track === 'string' ? courier.Track.trim() : '';
  if (!track) {
    return false;
  }

  try {
    const url = new URL(track.startsWith('http://') || track.startsWith('https://') ? track : `https://${track}`);
    return isCourierHostname(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeShreeTirupatiAwb(value: unknown): string {
  const awb = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : '';

  if (!awb) {
    throw new ShreeTirupatiTrackingError('AWB number is required.', 400);
  }

  if (!/^\d+$/.test(awb)) {
    throw new ShreeTirupatiTrackingError('AWB number must contain only digits.', 400);
  }

  if (awb.length > MAX_AWB_LENGTH) {
    throw new ShreeTirupatiTrackingError(`AWB number must be at most ${MAX_AWB_LENGTH} digits.`, 400);
  }

  return awb;
}

function readAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? match[2] ?? match[3] ?? match[4] ?? '' : '';
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
}

/**
 * ASP.NET requires the hidden state fields from the tracking form to be posted
 * back verbatim. Missing them causes the server to reject the request.
 */
export function parseShreeTirupatiFormFields(html: string): ShreeTirupatiFormFields {
  const inputs = new Map<string, string>();

  for (const tag of html.match(/<input\b[^>]*>/gi) ?? []) {
    const name = readAttribute(tag, 'name').toLowerCase();
    if (!name) {
      continue;
    }

    inputs.set(name, decodeHtmlEntities(readAttribute(tag, 'value')));
  }

  const viewState = inputs.get('__viewstate') ?? '';

  if (!viewState) {
    throw new ShreeTirupatiTrackingError('Could not read the tracking form from the courier website.', 502);
  }

  return {
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: inputs.get('__viewstategenerator') ?? '',
    __EVENTVALIDATION: inputs.get('__eventvalidation') ?? '',
  };
}

export function extractShreeTirupatiDocListUrl(
  location: string | null | undefined,
  origin = SHREE_TIRUPATI_ORIGIN,
): string | null {
  if (!location) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(location, origin);
  } catch {
    return null;
  }

  if (!isCourierHostname(url.hostname)) {
    return null;
  }

  if (url.pathname.toLowerCase() !== SHREE_TIRUPATI_DOC_LIST_PATH.toLowerCase()) {
    return null;
  }

  // Do not use searchParams.get() for the returned URL: the encrypted token can
  // contain "+" characters which URLSearchParams decodes as spaces.
  if (!url.search.includes('docnos=')) {
    return null;
  }

  return url.toString();
}

function extractDocListUrlFromHtml(html: string, origin: string) {
  const match = html.match(/Frm_DocList\.aspx\?docnos=([^"'&\s]+)/i);

  if (!match) {
    return null;
  }

  return extractShreeTirupatiDocListUrl(`${SHREE_TIRUPATI_DOC_LIST_PATH}?docnos=${match[1]}`, origin);
}

/**
 * Replays the courier's ASP.NET tracking form and returns the redirected
 * `Frm_DocList.aspx?docnos=<encrypted-token>` URL.
 *
 * The token is generated server-side from the AWB. Replaying the form is the
 * supported way to obtain it without knowing the ASP.NET machine key.
 */
export async function resolveShreeTirupatiTrackingUrl(
  awbValue: unknown,
  options: ResolveShreeTirupatiOptions = {},
): Promise<string> {
  const awb = normalizeShreeTirupatiAwb(awbValue);
  const now = options.now ?? Date.now;
  const cached = trackingCache.get(awb);

  if (cached && cached.expiresAt > now()) {
    return cached.url;
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const origin = (options.origin ?? SHREE_TIRUPATI_ORIGIN).replace(/\/+$/, '');
  const formUrl = `${origin}${SHREE_TIRUPATI_TRACKING_FORM_PATH}`;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const formResponse = await fetchImpl(formUrl, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': USER_AGENT,
      },
      signal: controller.signal,
    });

    if (!formResponse.ok) {
      throw new ShreeTirupatiTrackingError('Could not load the courier tracking form.', 502);
    }

    const formFields = parseShreeTirupatiFormFields(await formResponse.text());
    const body = new URLSearchParams();

    for (const [name, value] of Object.entries(formFields)) {
      body.set(name, value);
    }

    body.set('trackingno', awb);
    body.set('btnTrack', 'Go');

    const postResponse = await fetchImpl(formUrl, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'content-type': 'application/x-www-form-urlencoded',
        referer: formUrl,
        'user-agent': USER_AGENT,
      },
      body: body.toString(),
      signal: controller.signal,
    });

    let url = extractShreeTirupatiDocListUrl(postResponse.headers.get('location'), origin);

    if (!url && postResponse.ok) {
      url = extractDocListUrlFromHtml(await postResponse.text(), origin);
    }

    if (!url) {
      throw new ShreeTirupatiTrackingError(
        'The courier website did not return a tracking page for this AWB.',
        502,
      );
    }

    trackingCache.set(awb, { url, expiresAt: now() + TRACKING_CACHE_TTL_MS });
    return url;
  } catch (error) {
    if (error instanceof ShreeTirupatiTrackingError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ShreeTirupatiTrackingError('The courier website timed out.', 504);
    }

    throw new ShreeTirupatiTrackingError('Could not reach the courier website.', 502);
  } finally {
    clearTimeout(timer);
  }
}
