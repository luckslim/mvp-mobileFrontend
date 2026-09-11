import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveApiUrl } from './api-url.ts';

test('uses the computer host when localhost is configured for a physical device', () => {
  assert.equal(
    resolveApiUrl({
      configuredApiUrl: 'http://localhost:3333',
      expoHostUri: '192.168.0.10:8081',
      platform: 'ios',
    }),
    'http://192.168.0.10:3333',
  );
});

test('keeps an explicit non-local API URL', () => {
  assert.equal(
    resolveApiUrl({
      configuredApiUrl: 'https://api.example.com',
      expoHostUri: '192.168.0.10:8081',
      platform: 'ios',
    }),
    'https://api.example.com',
  );
});
