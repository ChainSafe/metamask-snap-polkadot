import { resolve } from 'path';
import type { SnapConfig } from '@metamask/snaps-cli';

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8081
  },
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  polyfills: {
    buffer: true
  }
};

export default config;
