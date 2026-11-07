import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoUpdate {
  title: string;
  description?: string;
  url: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = 'https://frontlinecourier.com';
const DEFAULT_DESCRIPTION =
  'Frontline Courier provides domestic and international courier, cargo and freight forwarding with real-time shipment tracking, pickup requests and instant quotes.';

const SEGMENT_LABELS: Record<string, string> = {
  home: 'Home',
  service: 'Services',
  domestic: 'Domestic Courier',
  international: 'International Courier',
  air: 'Air Freight',
  cargo: 'Cargo',
  surface: 'Surface Freight',
  priority: 'Priority Delivery',
  price: 'Domestic Rates',
  'volumetric-weight': 'Volumetric Weight',
  'volumetric-weight-calculation': 'Volumetric Weight',
  'pickup-request': 'Pickup Request',
  'get-quote': 'Get a Quote',
  track: 'Track Shipment',
  contact: 'Contact Us',
  about: 'About Us',
  reach: 'Reach Us',
  pricing: 'Pricing & Rates',
  faq: 'FAQ & Help',
  coverage: 'Coverage & Locations',
  insurance: 'Insurance & Claims',
  'terms-and-privacy': 'Terms & Privacy',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private readonly titleService: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  update({ title, description, url, jsonLd }: SeoUpdate): void {
    const path = (url.split('?')[0] || '/').replace(/\/+$/, '') || '/';
    const isHome = path === '/' || path === '/home';
    const fullTitle = isHome
      ? 'Frontline Courier — Domestic & International Courier, Cargo and Freight'
      : `${title} | Frontline Courier`;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonical = path === '/' || path === '/home' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    this.titleService.setTitle(fullTitle);
    this.updateMeta('name', 'description', desc);
    this.updateMeta('name', 'robots', 'index,follow');
    this.updateMeta('property', 'og:title', fullTitle);
    this.updateMeta('property', 'og:description', desc);
    this.updateMeta('property', 'og:type', 'website');
    this.updateMeta('property', 'og:url', canonical);
    this.updateMeta('property', 'og:site_name', 'Frontline Courier');
    this.updateMeta('property', 'og:image', `${SITE_URL}/assets/logo.png`);
    this.updateMeta('name', 'twitter:card', 'summary_large_image');
    this.updateMeta('name', 'twitter:title', fullTitle);
    this.updateMeta('name', 'twitter:description', desc);
    this.updateMeta('name', 'twitter:image', `${SITE_URL}/assets/logo.png`);
    this.setCanonical(canonical);

    const breadcrumb = this.buildBreadcrumb(path, title);
    const graph: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: fullTitle,
        description: desc,
        url: canonical,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Frontline Courier',
          url: SITE_URL,
        },
      },
      breadcrumb,
    ];

    if (jsonLd) {
      graph.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]));
    }

    this.setJsonLd('fl-page-schema', graph);
  }

  private buildBreadcrumb(path: string, pageTitle: string): Record<string, unknown> {
    const items: Record<string, unknown>[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
    ];

    if (path !== '/' && path !== '/home') {
      const segments = path.split('/').filter(Boolean);
      segments.forEach((segment, index) => {
        const isLast = index === segments.length - 1;
        const label = isLast
          ? pageTitle || SEGMENT_LABELS[segment] || this.humanize(segment)
          : SEGMENT_LABELS[segment] || this.humanize(segment);
        items.push({
          '@type': 'ListItem',
          position: index + 2,
          name: label,
          item: `${SITE_URL}/${segments.slice(0, index + 1).join('/')}`,
        });
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  }

  private humanize(value: string): string {
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private updateMeta(attribute: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attribute]: key, content });
  }

  private setCanonical(href: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private setJsonLd(id: string, data: unknown): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
