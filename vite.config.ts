import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],

  // Configure server
  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  // Path aliases for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@features': path.resolve(__dirname, './src/features'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Improve chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          utils: ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },

  // CSS Processing
  css: {
    // PostCSS configuration inline
    postcss: './postcss.config.mjs',
  },

  // Vitest configuration
  test: {
    // Enable globals for testing libraries
    globals: true,
    // Use jsdom for browser environment simulation
    environment: 'jsdom',
    // Setup files run before each test file
    setupFiles: ['./vitest.setup.ts'],
    // Include CSS processing in tests
    css: true,
    // Configuring coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/test/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/mocks/**'
      ],
    },
    // Test matching patterns with expanded patterns from vitest.config.ts
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}'
    ],
    // Test exclusions
    exclude: ['node_modules', 'dist', '.next', 'coverage'],
    // Mocking behavior
    mockReset: true,
    // Added from vitest.config.ts
    deps: {
      inline: ['msw']
    },
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000'
      }
    }
  },

  // Environment variables
  envDir: '.',
  envPrefix: 'VITE_',
});