import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';

// Polyfill for crypto.getRandomValues in Node.js
import { webcrypto as crypto } from 'node:crypto';
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto;
}

export default defineConfig({
  plugins: [
    react(),
    stdLibBrowser()
  ],
  server: {
    port: 3000,
    open: true,
  },
}); 