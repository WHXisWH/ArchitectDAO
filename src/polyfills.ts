import { Buffer } from 'buffer';

// Make Buffer available globally
(globalThis as any).Buffer = Buffer;

// Add process polyfill
(globalThis as any).process = {
  env: {},
  nextTick: (callback: Function) => setTimeout(callback, 0),
  browser: true,
  version: '',
  versions: { node: '' },
  platform: 'browser',
  arch: 'browser'
};