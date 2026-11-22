import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCourierTrackUrl } from './track-url';

test('link mode uses the reference number', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'link',
    courierTrack: 'https://courier.example/track/<AWB>',
    awbNumber: 'AWB1',
    referenceNumber: 'REF1',
  });

  assert.equal(url, 'https://courier.example/track/REF1');
});

test('link mode does not fall back to the AWB when the reference is missing', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'link',
    courierTrack: 'https://courier.example/track/<AWB>',
    awbNumber: 'AWB1',
    referenceNumber: '',
  });

  assert.equal(url, '');
});

test('internal mode uses the AWB number', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'internal',
    courierTrack: 'https://courier.example/track/<AWB>',
    awbNumber: 'AWB1',
    referenceNumber: 'REF1',
  });

  assert.equal(url, 'https://courier.example/track/AWB1');
});

test('api mode never produces a client-side link', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'api',
    courierTrack: 'https://courier.example/track/<AWB>',
    awbNumber: 'AWB1',
  });

  assert.equal(url, '');
});

test('static courier URLs are returned unchanged', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'internal',
    courierTrack: ' https://courier.example/track ',
    awbNumber: 'AWB1',
  });

  assert.equal(url, 'https://courier.example/track');
});

test('the tracking number is URL-encoded', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'link',
    courierTrack: 'https://courier.example/track/<AWB>',
    referenceNumber: 'REF&1',
  });

  assert.equal(url, 'https://courier.example/track/REF%261');
});

test('missing data returns an empty string', () => {
  assert.equal(buildCourierTrackUrl(null), '');
  assert.equal(buildCourierTrackUrl(undefined), '');
  assert.equal(buildCourierTrackUrl({}), '');
  assert.equal(buildCourierTrackUrl({ courierTrack: 'https://courier.example/track/<AWB>' }), '');
});

test('resolver mode uses the AWB and the admin API origin', () => {
  const url = buildCourierTrackUrl(
    {
      courierMode: 'resolver',
      courierTrack: '/api/tracking/shree-tirupati?awb=<AWB>',
      awbNumber: '123456',
      referenceNumber: 'REF1',
    },
    { adminApiUrl: 'https://next.frontlinecourier.com/' },
  );

  assert.equal(url, 'https://next.frontlinecourier.com/api/tracking/shree-tirupati?awb=123456');
});

test('resolver mode requires the admin API origin for relative templates', () => {
  const booking = {
    courierMode: 'resolver',
    courierTrack: '/api/tracking/shree-tirupati?awb=<AWB>',
    awbNumber: '123456',
  };

  assert.equal(buildCourierTrackUrl(booking), '');
  assert.equal(buildCourierTrackUrl(booking, { adminApiUrl: '' }), '');
  assert.equal(buildCourierTrackUrl(booking, { adminApiUrl: '   ' }), '');
});

test('resolver mode does not fall back to the reference number', () => {
  const url = buildCourierTrackUrl(
    {
      courierMode: 'resolver',
      courierTrack: '/api/tracking/shree-tirupati?awb=<AWB>',
      referenceNumber: 'REF1',
    },
    { adminApiUrl: 'https://next.frontlinecourier.com' },
  );

  assert.equal(url, '');
});

test('resolver mode leaves absolute templates untouched', () => {
  const url = buildCourierTrackUrl({
    courierMode: 'resolver',
    courierTrack: 'https://resolver.example/track/123456',
    awbNumber: '123456',
  });

  assert.equal(url, 'https://resolver.example/track/123456');
});
