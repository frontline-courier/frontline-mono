import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../pages/api/tracking/shree-tirupati';
import aliasHandler from '../pages/api/couriers/shree-tirupati/track';
import {
  clearShreeTirupatiTrackingCache,
  extractShreeTirupatiDocListUrl,
  isShreeTirupatiCourier,
  normalizeShreeTirupatiAwb,
  parseShreeTirupatiFormFields,
  resolveShreeTirupatiTrackingUrl,
  ShreeTirupatiTrackingError,
} from '../helpers/shreeTirupatiTracking';

const TRACKING_FORM_HTML = `
<form method="post" action="TopHeader.aspx">
  <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUKMjEzNTE4MTQ5MmRk" />
  <input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="AA404F49" />
  <input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="/wEWBQL60+WVCQKY2J7eAw==" />
  <input name="trackingno" type="text" id="trackingno" />
  <input type="submit" name="btnTrack" value="Go" id="btnTrack" />
</form>
`;

function createFetchMock(
  postResponse: (url: string, init?: RequestInit) => Response,
  calls: Array<{ url: string; init?: RequestInit }> = [],
) {
  return async (url: string | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init });

    if (init?.method === 'POST') {
      return postResponse(String(url), init);
    }

    return new Response(TRACKING_FORM_HTML, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  };
}

test('detects the courier by id, name, or tracking host', () => {
  assert.equal(isShreeTirupatiCourier({ CourierId: 62 }), true);
  assert.equal(isShreeTirupatiCourier({ Courier: 'SHREE TIRUPATHI Normal' }), true);
  assert.equal(
    isShreeTirupatiCourier({ Track: 'http://www.shreetirupaticourier.net/Frm_DocTrack.aspx?docno=<AWB>' }),
    true,
  );
  assert.equal(isShreeTirupatiCourier({ CourierId: 1, Courier: 'DTDC Normal' }), false);
  assert.equal(isShreeTirupatiCourier(null), false);
});

test('normalizes digit-only AWB numbers and rejects bad input', () => {
  assert.equal(normalizeShreeTirupatiAwb(' 123456 '), '123456');
  assert.equal(normalizeShreeTirupatiAwb(123456), '123456');

  assert.throws(
    () => normalizeShreeTirupatiAwb(''),
    (error: unknown) => error instanceof ShreeTirupatiTrackingError && error.statusCode === 400,
  );
  assert.throws(
    () => normalizeShreeTirupatiAwb('12AB56'),
    (error: unknown) => error instanceof ShreeTirupatiTrackingError && /digits/.test(error.message),
  );
  assert.throws(
    () => normalizeShreeTirupatiAwb('1'.repeat(21)),
    (error: unknown) => error instanceof ShreeTirupatiTrackingError && /at most/.test(error.message),
  );
});

test('parses the ASP.NET hidden state fields', () => {
  const fields = parseShreeTirupatiFormFields(TRACKING_FORM_HTML);

  assert.equal(fields.__VIEWSTATE, '/wEPDwUKMjEzNTE4MTQ5MmRk');
  assert.equal(fields.__VIEWSTATEGENERATOR, 'AA404F49');
  assert.equal(fields.__EVENTVALIDATION, '/wEWBQL60+WVCQKY2J7eAw==');
});

test('rejects a tracking form without __VIEWSTATE', () => {
  assert.throws(
    () => parseShreeTirupatiFormFields('<form><input name="trackingno" /></form>'),
    (error: unknown) =>
      error instanceof ShreeTirupatiTrackingError &&
      error.message === 'Could not read the tracking form from the courier website.',
  );
});

test('only accepts doc-list redirects from the courier host', () => {
  assert.equal(
    extractShreeTirupatiDocListUrl('/Frm_DocList.aspx?docnos=abc+def=='),
    'https://www.shreetirupaticourier.net/Frm_DocList.aspx?docnos=abc+def==',
  );
  assert.equal(
    extractShreeTirupatiDocListUrl('https://shreetirupaticourier.net/Frm_DocList.aspx?docnos=abc'),
    'https://shreetirupaticourier.net/Frm_DocList.aspx?docnos=abc',
  );
  assert.equal(extractShreeTirupatiDocListUrl('https://evil.example/Frm_DocList.aspx?docnos=abc'), null);
  assert.equal(extractShreeTirupatiDocListUrl('/Frm_DocTrack.aspx?docno=123456'), null);
  assert.equal(extractShreeTirupatiDocListUrl('/Frm_DocList.aspx'), null);
  assert.equal(extractShreeTirupatiDocListUrl(null), null);
});

test('replays the form POST and returns the generated doc-list URL', async () => {
  clearShreeTirupatiTrackingCache();
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchMock = createFetchMock(
    () =>
      new Response(null, {
        status: 302,
        headers: { location: '/Frm_DocList.aspx?docnos=vRC+1hObI+bjZC+OYZN0LQ==' },
      }),
    calls,
  );

  const url = await resolveShreeTirupatiTrackingUrl('123456', {
    fetchImpl: fetchMock,
    now: () => 1_000,
  });

  assert.equal(url, 'https://www.shreetirupaticourier.net/Frm_DocList.aspx?docnos=vRC+1hObI+bjZC+OYZN0LQ==');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].init?.method, 'GET');
  assert.equal(calls[1].init?.method, 'POST');
  assert.equal(calls[1].init?.redirect, 'manual');

  const body = new URLSearchParams(String(calls[1].init?.body));
  assert.equal(body.get('trackingno'), '123456');
  assert.equal(body.get('btnTrack'), 'Go');
  assert.equal(body.get('__VIEWSTATE'), '/wEPDwUKMjEzNTE4MTQ5MmRk');
  assert.equal(body.get('__EVENTVALIDATION'), '/wEWBQL60+WVCQKY2J7eAw==');
});

test('falls back to an embedded doc-list URL when the POST does not redirect', async () => {
  clearShreeTirupatiTrackingCache();
  const fetchMock = createFetchMock(
    () =>
      new Response(
        '<form action="Frm_DocList.aspx?docnos=embedded+token=="><iframe src="Frm_DocTrackWeb.aspx?docno=embedded+token=="></iframe></form>',
        { status: 200, headers: { 'content-type': 'text/html' } },
      ),
  );

  const url = await resolveShreeTirupatiTrackingUrl('123456', { fetchImpl: fetchMock, now: () => 1_000 });

  assert.equal(
    url,
    'https://www.shreetirupaticourier.net/Frm_DocList.aspx?docnos=embedded+token==',
  );
});

test('rejects a redirect to a non-courier host', async () => {
  clearShreeTirupatiTrackingCache();
  const fetchMock = createFetchMock(
    () =>
      new Response(null, {
        status: 302,
        headers: { location: 'https://evil.example/Frm_DocList.aspx?docnos=abc' },
      }),
  );

  await assert.rejects(
    resolveShreeTirupatiTrackingUrl('123456', { fetchImpl: fetchMock, now: () => 1_000 }),
    (error: unknown) =>
      error instanceof ShreeTirupatiTrackingError &&
      error.message === 'The courier website did not return a tracking page for this AWB.',
  );
});

test('wraps network failures in a 502 tracking error', async () => {
  clearShreeTirupatiTrackingCache();

  await assert.rejects(
    resolveShreeTirupatiTrackingUrl('123456', {
      fetchImpl: async () => {
        throw new Error('socket hang up');
      },
      now: () => 1_000,
    }),
    (error: unknown) =>
      error instanceof ShreeTirupatiTrackingError &&
      error.statusCode === 502 &&
      error.message === 'Could not reach the courier website.',
  );
});

test('caches resolved URLs for the same AWB', async () => {
  clearShreeTirupatiTrackingCache();
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchMock = createFetchMock(
    () =>
      new Response(null, {
        status: 302,
        headers: { location: '/Frm_DocList.aspx?docnos=cached+token==' },
      }),
    calls,
  );

  await resolveShreeTirupatiTrackingUrl('123456', { fetchImpl: fetchMock, now: () => 1_000 });
  await resolveShreeTirupatiTrackingUrl('123456', { fetchImpl: fetchMock, now: () => 2_000 });

  assert.equal(calls.length, 2, 'second call should be served from the cache');

  await resolveShreeTirupatiTrackingUrl('123456', {
    fetchImpl: fetchMock,
    now: () => 1_000 + 10 * 60 * 1000 + 1,
  });

  assert.equal(calls.length, 4, 'expired cache entries should be resolved again');
});


function createMockResponse() {
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string | number | string[]>,
    body: undefined,
    redirectUrl: undefined,
    setHeader(name: string, value: string | number | string[]) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    redirect(status: number, url: string) {
      this.statusCode = status;
      this.redirectUrl = url;
      return this;
    },
  };

  return res;
}

test('API route rejects non-GET methods', async () => {
  const res = createMockResponse();

  await handler({ method: 'POST', query: {} } as any, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'GET');
  assert.deepEqual(res.body, { error: 'Method not allowed.' });
});

test('API route rejects invalid AWBs without calling the courier', async () => {
  const res = createMockResponse();
  const originalFetch = globalThis.fetch;
  let fetched = false;

  globalThis.fetch = (async () => {
    fetched = true;
    throw new Error('fetch should not be called');
  }) as any;

  try {
    await handler({ method: 'GET', query: { awb: '12AB56' } } as any, res);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(fetched, false);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /digits/);
});

test('API route redirects to the resolved doc-list URL', async () => {
  clearShreeTirupatiTrackingCache();
  const res = createMockResponse();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = createFetchMock(
    () =>
      new Response(null, {
        status: 302,
        headers: { location: '/Frm_DocList.aspx?docnos=route+token==' },
      }),
  ) as any;

  try {
    await handler({ method: 'GET', query: { awb: '123456' } } as any, res);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(res.statusCode, 302);
  assert.equal(
    res.redirectUrl,
    'https://www.shreetirupaticourier.net/Frm_DocList.aspx?docnos=route+token==',
  );
  assert.equal(res.headers['cache-control'], 'private, max-age=300');
});


test('API route can return JSON for API clients', async () => {
  clearShreeTirupatiTrackingCache();
  const res = createMockResponse();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = createFetchMock(
    () =>
      new Response(null, {
        status: 302,
        headers: { location: '/Frm_DocList.aspx?docnos=json+token==' },
      }),
  ) as any;

  try {
    await handler({ method: 'GET', query: { awb: '123456', format: 'json' } } as any, res);
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    awb: '123456',
    trackingUrl: 'https://www.shreetirupaticourier.net/Frm_DocList.aspx?docnos=json+token==',
  });
  assert.equal(res.redirectUrl, undefined);
});

test('the review-recommended courier path serves the same handler', () => {
  assert.equal(aliasHandler, handler);
});
