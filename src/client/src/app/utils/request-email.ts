import { formatDate } from './date-utils';

export type RequestEmail = {
  to: string | string[];
  cc?: string;
  bcc?: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

type RequestForm = Record<string, unknown>;

export const REQUEST_EMAIL_RECIPIENTS = [
  'Aravind from FrontlineCourier <aravin.it@gmail.com>',
  'Varun from FrontlineCourier <varunn.cliquee@gmail.com>',
];

const FROM_ADDRESS = 'Varun from FrontlineCourier <noreply@epix.io>';

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function asText(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}

function renderHtmlRows(fields: Array<[string, unknown]>) {
  return fields
    .map(
      ([label, value]) =>
        `<li><strong>${escapeHtml(label)}</strong>: ${escapeHtml(asText(value))}</li>`
    )
    .join('');
}

function requestDate() {
  return formatDate(new Date(), 'DD MMM YYYY h:mm A (ddd)');
}

function buildRequesterEmail(
  subject: string,
  heading: string,
  fields: Array<[string, unknown]>,
  email: unknown
): RequestEmail | null {
  const requesterEmail = typeof email === 'string' ? email.trim() : '';

  if (!requesterEmail) {
    return null;
  }

  return {
    to: requesterEmail,
    from: FROM_ADDRESS,
    replyTo: 'Varun from FrontlineCourier <varunn.cliquee@gmail.com>',
    subject,
    text: `${heading}\n\n${fields.map(([label, value]) => `${label}: ${asText(value)}`).join('\n')}`,
    html: `<p>Hi,</p><p>${escapeHtml(heading)}</p><ul>${renderHtmlRows(fields)}</ul>`,
  };
}

export function buildQuoteEmails(form: RequestForm) {
  const contactName = asText(form.contactName);
  const subject = `Quote Request - Frontlinecourier.com - ${contactName} - ${requestDate()}`;
  const fields: Array<[string, unknown]> = [
    ['Contact Person', form.contactName],
    ['Company', form.companyName],
    ['Email', form.email],
    ['Mobile', form.mobile],
    ['Pickup Location', form.fromLocation],
    ['Delivery Location', form.toLocation],
    ['No. of Shipments', form.shipmentCount],
    ['Total Weight', form.totalWeight],
    [
      'Volume Weight (L x B x H)',
      [form.volumeL, form.volumeB, form.volumeH].filter(Boolean).join(' x '),
    ],
    ['Content of Goods', form.contentType],
    ['Worth of Goods', form.contentWorth],
    ['Classification', form.contentMode],
    ['Remarks', form.remarks ?? form.remaks],
  ];

  const team: RequestEmail = {
    to: REQUEST_EMAIL_RECIPIENTS,
    from: FROM_ADDRESS,
    replyTo: typeof form.email === 'string' ? form.email : undefined,
    subject,
    text: `Quote request received.\n\n${fields.map(([label, value]) => `${label}: ${asText(value)}`).join('\n')}`,
    html: `<p>Hi Team,</p><p>A quote request was received:</p><ul>${renderHtmlRows(fields)}</ul>`,
  };

  return {
    team,
    customer: buildRequesterEmail(
      'Thanks for contacting FrontlineCourier.com',
      'We received your quote request and our team will contact you shortly.',
      fields,
      form.email
    ),
  };
}

export function buildPickupEmails(form: RequestForm) {
  const name = asText(form.name);
  const subject = `Pickup Request - Frontlinecourier.com - ${name} - ${requestDate()}`;
  const fields: Array<[string, unknown]> = [
    ['Name', form.name],
    ['Email', form.email],
    ['Phone', form.phone],
    ['Pickup Location', form.address],
    ['Shipment Type', form.shipmentType],
    ['No. of Shipments', form.shipmentQty],
    ['Total Weight', form.shipmentWeight],
    ['Delivery Location', form.deliveryAddress],
  ];

  const team: RequestEmail = {
    to: REQUEST_EMAIL_RECIPIENTS,
    from: FROM_ADDRESS,
    replyTo: typeof form.email === 'string' ? form.email : undefined,
    subject,
    text: `Pickup request received.\n\n${fields.map(([label, value]) => `${label}: ${asText(value)}`).join('\n')}`,
    html: `<p>Hi Team,</p><p>A pickup request was received:</p><ul>${renderHtmlRows(fields)}</ul>`,
  };

  return {
    team,
    customer: buildRequesterEmail(
      'Thanks for contacting FrontlineCourier.com',
      'We received your pickup request and our team will contact you shortly.',
      fields,
      form.email
    ),
  };
}
