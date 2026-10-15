import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import { server } from './msw/server';

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
});

afterAll(() => {
  server.close();
});

// O jsdom não implementa showModal/close do <dialog>.
const dialogPrototype: Partial<Pick<HTMLDialogElement, 'showModal' | 'close'>> =
  HTMLDialogElement.prototype;
dialogPrototype.showModal ??= function showModal(this: HTMLDialogElement) {
  this.open = true;
};
dialogPrototype.close ??= function close(this: HTMLDialogElement) {
  this.open = false;
};
