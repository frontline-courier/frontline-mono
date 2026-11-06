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
