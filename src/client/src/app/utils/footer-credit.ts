export const EXAFUL_LINK_DOMAIN = 'exaful.com';
export const EXAFUL_LINK_TARGET = '_blank';
export const EXAFUL_LINK_REL = 'noopener noreferrer';

export interface OutboundClickParams {
  link_url: string;
  link_domain: string;
  link_text: string;
  outbound: true;
}

export function buildExafulCreditUrl(siteDomain: string): string {
  const source = encodeURIComponent(siteDomain);

  return `https://exaful.com/?utm_source=${source}&utm_medium=referral&utm_campaign=footer_credit`;
}

export function trackOutboundClick(params: OutboundClickParams): void {
  if (typeof window === 'undefined' || typeof gtag !== 'function') {
    return;
  }

  gtag('event', 'outbound_click', params);
}
