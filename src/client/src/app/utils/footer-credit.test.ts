import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  EXAFUL_LINK_REL,
  EXAFUL_LINK_TARGET,
  buildExafulCreditUrl,
  trackOutboundClick,
} from './footer-credit';

const SITE_DOMAIN = 'frontlinecourier.com';
const FOOTER_TEMPLATE = new URL('../shared/footer/footer.component.html', import.meta.url);

test('credit link points to Exaful with the referral UTMs', () => {
  assert.equal(
    buildExafulCreditUrl(SITE_DOMAIN),
    'https://exaful.com/?utm_source=frontlinecourier.com&utm_medium=referral&utm_campaign=footer_credit'
  );
});

test('credit link opens in a new tab without access to the opener', () => {
  const template = readFileSync(FOOTER_TEMPLATE, 'utf8');

  assert.match(template, new RegExp(`target="${EXAFUL_LINK_TARGET}"`));
  assert.match(template, new RegExp(`rel="${EXAFUL_LINK_REL}"`));
});

test('credit click sends the GA4 outbound click event', () => {
  const globals = globalThis as unknown as {
    window?: unknown;
    gtag?: (...args: unknown[]) => void;
  };
  const originalWindow = globals.window;
  const originalGtag = globals.gtag;
  const calls: unknown[][] = [];

  globals.window = {};
  globals.gtag = (...args: unknown[]) => {
    calls.push(args);
  };

  try {
    const linkUrl = buildExafulCreditUrl(SITE_DOMAIN);
    const linkText = 'Built by Exaful';

    trackOutboundClick({
      link_url: linkUrl,
      link_domain: 'exaful.com',
      link_text: linkText,
      outbound: true,
    });

    assert.deepEqual(calls, [
      [
        'event',
        'outbound_click',
        {
          link_url: linkUrl,
          link_domain: 'exaful.com',
          link_text: linkText,
          outbound: true,
        },
      ],
    ]);
  } finally {
    globals.window = originalWindow;
    globals.gtag = originalGtag;
  }
});
