# RecruitReply

A RAG (Retrieval-Augmented Generation) system for recruitment agents to reduce time spent answering repetitive questions.

## Project Overview

RecruitReply is an AI-powered recruitment assistant that helps recruitment agents quickly answer common questions by leveraging a RAG system built on Cloudflare's infrastructure. The system allows for document management, where administrators can upload recruitment-related documents that the AI uses to generate accurate responses.

## Technology Stack

- **Frontend & Backend**: Next.js 15 with App Router
- **UI Components**: shadcn/ui (based on Tailwind CSS)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages
- **RAG System**: Cloudflare AutoRAG
- **Storage**: Cloudflare R2

## Requirements

- Node.js 18.18.0 or later
- npm 8.x or later

## Project Structure

```
recruit-reply/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── chat/               # Chat interface
│   │   ├── documents/          # Document management
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── layout/             # Layout components
│   │   │   ├── footer.tsx      # Footer component
│   │   │   ├── header.tsx      # Header component
│   │   │   ├── main-layout.tsx # Main layout wrapper
│   │   │   └── mode-toggle.tsx # Dark/light mode toggle
│   │   └── ui/                 # UI components from shadcn/ui
│   ├── features/               # Feature-specific code
│   │   ├── auth/               # Authentication
│   │   ├── chat/               # Chat functionality
│   │   └── documents/          # Document management
│   ├── infrastructure/         # Infrastructure code
│   │   └── cloudflare/         # Cloudflare-specific code
│   └── lib/                    # Utility functions and shared code
│       └── utils/              # Utility functions
├── public/                     # Static assets
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Features

- **Chat Interface**: A user-friendly chat interface for recruiters to ask questions and receive AI-generated responses.
- **Document Management**: An interface for administrators to upload, view, and manage recruitment documents.
- **Authentication**: Role-based access control to distinguish between recruiters and administrators.
- **Dark Mode Support**: Toggle between light and dark themes.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Note

This project requires Node.js version 18.18.0 or later to run Next.js 15 and React 19.

## Testing

The project follows test-driven development principles with comprehensive test coverage.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run end-to-end tests only
npm run test:e2e

# Generate test coverage report
npm run test:coverage
```

### Test Structure

```
src/__tests__/
├── unit/             # Unit tests for components and functions
├── integration/      # Integration tests for API routes
├── e2e/              # End-to-end tests for user flows
└── mocks/            # Test mocks and fixtures
```

## Next Steps

- Implement authentication system
- Enhance test coverage
- Add performance optimizations
- Implement advanced RAG features
