import assert from 'node:assert/strict';
import test from 'node:test';
import { createEventFormData } from './event-form-data.ts';

test('puts a Blob-compatible file in the FormData body', () => {
  class ReactNativeFormData {
    _parts = [];

    append(name, value) {
      this._parts.push([name, value]);
    }
  }

  const previousFormData = globalThis.FormData;
  globalThis.FormData = ReactNativeFormData;

  try {
    const formData = createEventFormData({
      name: 'Lugar de teste',
      description: 'Descrição de teste',
      suggestedVisitTime: '08:00',
      location: 'Magé',
      responsibleParty: 'Comunidade',
      image: {
        uri: 'file:///tmp/lugar.jpg',
        name: 'lugar.jpg',
        mimeType: 'image/jpeg',
      },
    }, new Blob(['image'], { type: 'image/jpeg' }));

    const filePart = formData._parts.find(([name]) => name === 'file')?.[1];
    assert.ok(filePart instanceof Blob);
  } finally {
    globalThis.FormData = previousFormData;
  }
});
