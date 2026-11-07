import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DomesticComponent } from './pages/service/domestic/domestic.component';
import { InternationalComponent } from './pages/service/international/international.component';
import { AirComponent } from './pages/service/air/air.component';
import { CargoComponent } from './pages/service/cargo/cargo.component';
import { SurfaceComponent } from './pages/service/surface/surface.component';
import { PriorityComponent } from './pages/service/priority/priority.component';
import { PriceComponent } from './pages/service/price/price.component';
import { VolumeComponent } from './pages/service/volume/volume.component';
import { PickupComponent } from './pages/request/pickup/pickup.component';
import { QuoteComponent } from './pages/request/quote/quote.component';
import { AboutComponent } from './pages/company/about/about.component';
import { ContactComponent } from './pages/company/contact/contact.component';
import { ReachComponent } from './pages/company/reach/reach.component';
import { TrackComponent } from './pages/track/track.component';
import { TermsComponent } from './pages/company/terms/terms.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { FaqComponent } from './pages/support/faq/faq.component';
import { CoverageComponent } from './pages/company/coverage/coverage.component';
import { InsuranceComponent } from './pages/company/insurance/insurance.component';

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I book a shipment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the pickup request form or call our booking desk. Share the pickup address, delivery address, shipment type, weight and preferred service. We confirm pickup and provide the AWB number.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I track my shipment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit the tracking page and enter your POD/AWB number or reference number. You can also use the search box in the site header.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is shipping cost calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cost depends on chargeable weight (actual or volumetric, whichever is higher), distance, service level and optional insurance. Use the volumetric calculator or request a quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my shipment insured?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transit insurance is optional and must be added at booking. Without it, no claim can be raised for loss or damage during transit.',
      },
    },
  ],
};

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home',
      description:
        'Frontline Courier offers domestic and international courier, cargo and freight forwarding with real-time tracking, pickup requests and instant quotes.',
    },
  },
  {
    path: 'service/domestic',
    component: DomesticComponent,
    data: {
      title: 'Domestic Courier',
      description:
        'Reliable domestic courier and parcel delivery across India with doorstep pickup, surface and air options and real-time tracking.',
    },
  },
  {
    path: 'service/international',
    component: InternationalComponent,
    data: {
      title: 'International Courier',
      description:
        'International courier and parcel delivery to 220+ countries through DHL, FedEx, UPS, Aramex and other leading partners.',
    },
  },
  {
    path: 'service/air',
    component: AirComponent,
    data: {
      title: 'Air Freight',
      description:
        'Fast air courier and air freight services for time-sensitive documents, parcels and cargo worldwide.',
    },
  },
  {
    path: 'service/cargo',
    component: CargoComponent,
    data: {
      title: 'Cargo Service',
      description:
        'Domestic cargo and bulk shipment services by road with customised handling, tracking and insurance options.',
    },
  },
  {
    path: 'service/surface',
    component: SurfaceComponent,
    data: {
      title: 'Surface Freight',
      description:
        'Cost-effective domestic and international surface freight for large shipments with reliable transit times.',
    },
  },
  {
    path: 'service/priority',
    component: PriorityComponent,
    data: {
      title: 'Priority Delivery',
      description:
        'Time-definite priority delivery with 10:30 AM, 12:00 PM, next-day and Sunday options on select pin codes.',
    },
  },
  {
    path: 'service/price',
    component: PriceComponent,
    data: {
      title: 'Domestic Rates',
      description:
        'Frontline Courier domestic rate card for surface, air, cargo and priority shipments across India.',
    },
  },
  {
    path: 'service/volumetric-weight',
    component: VolumeComponent,
    data: {
      title: 'Volumetric Weight',
      description:
        'Calculate volumetric (dimensional) weight for DHL, FedEx, UPS, Bluedart, DTDC and other courier partners.',
    },
  },
  {
    path: 'service/volumetric-weight-calculation',
    component: VolumeComponent,
    data: {
      title: 'Volumetric Weight Calculator',
      description:
        'Free volumetric weight calculator for domestic and international courier shipments across major courier partners.',
    },
  },
  {
    path: 'service/pickup-request',
    component: PickupComponent,
    data: {
      title: 'Pickup Request',
      description:
        'Schedule a doorstep courier pickup online with Frontline Courier and get your shipment collected.',
    },
  },
  {
    path: 'service/get-quote',
    component: QuoteComponent,
    data: {
      title: 'Get a Quote',
      description:
        'Request a personalised courier or cargo quote for domestic and international shipments.',
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'Contact Us',
      description:
        'Contact Frontline Courier in Chennai for bookings, customer care and international shipping support.',
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About Us',
      description:
        'Learn about Frontline Courier, our mission, values and commitment to reliable courier and cargo delivery.',
    },
  },
  {
    path: 'reach',
    component: ReachComponent,
    data: {
      title: 'Reach Us',
      description:
        'Find Frontline Courier branch locations in Chennai and get directions and contact details.',
    },
  },
  {
    path: 'track',
    component: TrackComponent,
    data: {
      title: 'Track Shipment',
      description:
        'Track your Frontline Courier shipment in real time using your POD, AWB or reference number.',
    },
  },
  {
    path: 'pricing',
    component: PricingComponent,
    data: {
      title: 'Pricing & Rates',
      description:
        'Transparent domestic, priority and international courier pricing from Frontline Courier.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Frontline Courier shipping services',
        provider: { '@type': 'Organization', name: 'Frontline Courier' },
        areaServed: ['IN', 'Worldwide'],
        serviceType: ['Domestic courier', 'International courier', 'Air freight', 'Cargo'],
        offers: {
          '@type': 'OfferCatalog',
          name: 'Courier pricing',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Domestic surface courier',
              priceCurrency: 'INR',
              price: '22',
              description: 'Indicative domestic surface rate starting from INR 22.',
            },
            {
              '@type': 'Offer',
              name: 'Priority and air courier',
              priceCurrency: 'INR',
              price: '77',
              description: 'Indicative priority and air rate starting from INR 77.',
            },
            {
              '@type': 'Offer',
              name: 'International courier',
              description: 'Custom international courier quote based on destination and weight.',
            },
          ],
        },
      },
    },
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      title: 'FAQ & Help',
      description:
        'Answers to common questions about courier booking, shipment tracking, pricing, insurance and claims.',
      jsonLd: FAQ_SCHEMA,
    },
  },
  {
    path: 'coverage',
    component: CoverageComponent,
    data: {
      title: 'Coverage & Locations',
      description:
        'Explore Frontline Courier domestic and international coverage, transit times and Chennai branch locations.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Frontline Courier coverage',
        provider: { '@type': 'Organization', name: 'Frontline Courier' },
        areaServed: ['IN', 'Europe', 'North America', 'Middle East', 'Asia Pacific', 'Africa'],
        serviceType: 'Courier and cargo delivery',
      },
    },
  },
  {
    path: 'insurance',
    component: InsuranceComponent,
    data: {
      title: 'Insurance & Claims',
      description:
        'Transit insurance coverage, exclusions and the claims process for Frontline Courier shipments.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Transit insurance for courier shipments',
        provider: { '@type': 'Organization', name: 'Frontline Courier' },
        serviceType: 'Shipment transit insurance',
      },
    },
  },
  {
    path: 'terms-and-privacy',
    component: TermsComponent,
    data: {
      title: 'Terms & Privacy',
      description: 'Frontline Courier terms of use, privacy policy and data handling practices.',
    },
  },
  {
    path: '**',
    component: HomeComponent,
    data: {
      title: 'Home',
      description:
        'Frontline Courier offers domestic and international courier, cargo and freight forwarding with real-time tracking.',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
