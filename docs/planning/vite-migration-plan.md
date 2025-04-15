# Migration Plan: Next.js to Vite + Vitest

This document outlines the plan to migrate the recruit-reply project from Next.js to Vite and from Jest to Vitest to reduce configuration complexity.

## Overview

The migration will:
1. Replace Next.js with Vite for building and bundling
2. Replace Jest with Vitest for testing
3. Preserve the app's functionality and architecture
4. Simplify configuration management

## Important Considerations

### Next.js Features to Handle
- Server-side rendering
- API routes
- Server components (if used)
- App router features (if used)
- Middleware

### Configuration to Consolidate
- Jest → Vitest
- ESLint configuration
- TypeScript configuration
- PostCSS/Tailwind
- Babel (no longer needed with Vite)

## Migration Steps

### 1. Set Up Vite

```bash
# Install Vite and React plugin
npm install -D vite @vitejs/plugin-react
```

Create a minimal `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2. Set Up Vitest

```bash
# Install Vitest and testing libraries
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

Add test configuration to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';

// Add any global test setup here
```

### 3. Handle Next.js-Specific Features

#### SSR and API Routes
For server-side rendering and API routes, use:
- Vite SSR plugins
- Express/Fastify for API routes

```bash
# Install Vite SSR support
npm install -D vite-plugin-ssr
```

#### App Router / Routing
- Replace with React Router or TanStack Router

```bash
# Install React Router
npm install react-router-dom
```

### 4. Update Project Structure

```
recruit-reply/
├── index.html                      # Vite entry point
├── vite.config.ts                  # Single config file for Vite & Vitest
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── app.tsx                     # Main app component
│   ├── components/                 # UI components
│   ├── domain/                     # Domain models
│   ├── application/                # Application services
│   ├── infrastructure/             # External services
│   ├── routes/                     # React Router routes
│   ├── server/                     # Server code (if needed)
│   │   └── index.ts                # Express/Fastify server
│   ├── test/                       # Test utilities
│   │   └── setup.ts                # Vitest setup
│   └── types/                      # TypeScript types
├── public/                         # Static assets
└── package.json                    # Updated scripts
```

### 5. Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "lint": "eslint --ext .js,.jsx,.ts,.tsx src",
    "lint:fix": "eslint --ext .js,.jsx,.ts,.tsx src --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### 6. Update CI/CD Pipeline

Update GitHub workflow:

```yaml
# .github/workflows/vite.yml
name: 'Vite CI/CD'

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '22.x'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint
      run: npm run lint
      
    - name: Type check
      run: npm run type-check
      
    - name: Test
      run: npm test
      
    - name: Build
      run: npm run build
      
    # ... deployment steps
```

### 7. Create Server for API Routes

For any API routes, create a server:

```typescript
// src/server/index.ts
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

async function createServer() {
  const app = express();
  
  // API Routes
  app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from API' });
  });
  
  // For development
  if (process.env.NODE_ENV === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    
    app.use(vite.middlewares);
  } else {
    // For production
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    app.use(express.static(path.resolve(__dirname, '../../dist')));
  }
  
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();
```

## Test Migration

A gradual approach to migration:

1. Set up Vite and Vitest alongside existing Next.js setup
2. Convert a small component and its tests
3. Verify functionality
4. Gradually migrate more components and features
5. Once all features are migrated, switch fully to Vite

## Cloudflare Pages Deployment

For Cloudflare Pages deployment, update the build command:

```
vite build
```

Set the output directory to:

```
dist
```

## Fallback Plan

If migration proves too complex, consider:

1. Keep Next.js but use a modern approach with app router
2. Replace Jest with Vitest even in Next.js setup
3. Use Next.js' built-in configuration features 