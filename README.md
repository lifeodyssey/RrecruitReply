# Recruit-Reply

A RAG (Retrieval-Augmented Generation) system for recruitment agents to reduce time spent answering repetitive questions.

## Overview

Recruit-Reply uses the Cloudflare Auto RAG system to provide instant answers to common recruitment questions, saving time and improving consistency for recruitment agents.

## Features

- **Automated Question Answering**: Leverages RAG to answer common recruitment questions
- **Document Management**: Upload and manage recruitment-related documents
- **Chat Interface**: Interactive chat interface for recruitment agents
- **Admin Dashboard**: Manage content, monitor usage, and train the system

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Testing**: Vitest, Testing Library
- **RAG System**: Cloudflare Auto RAG
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages
- **Infrastructure**: Terraform, Terragrunt

## Modern Development Stack

This project uses a modern, zero-config development stack:

- **Next.js**: React framework for production-grade applications
- **Vitest**: Test runner with Jest-compatible API
- **TailwindCSS**: Utility-first CSS framework
- **Prisma**: Type-safe ORM for database access
- **NextAuth.js**: Authentication for Next.js
- **MSW**: API mocking for tests and development

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm 10.x or later
- A Cloudflare account with Auto RAG enabled

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/recruit-reply.git
cd recruit-reply
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Set up your Cloudflare credentials and other environment variables in the `.env` file.

5. Start the development server:

```bash
npm run dev
```

### Development Workflow

1. Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

2. Follow the [Feature Implementation Template](./docs/feature-template.md)

3. Ensure your code passes all checks:

```bash
# Run lint
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Run tests
npm test
```

4. Submit a pull request for review

## Testing with Vitest

The project uses Vitest for testing, providing fast test execution with a Jest-compatible API:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Building and Deployment

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run start
```

The application is automatically deployed to Cloudflare Pages when changes are pushed to the main branch.

## Project Structure

```
recruit-reply/
├── src/                  # Source code
│   ├── app/              # Next.js App Router
│   ├── components/       # Reusable UI components 
│   ├── lib/              # Utility functions and helpers
│   ├── domain/           # Domain models and business logic
│   ├── application/      # Application services
│   ├── infrastructure/   # External services, API clients, etc.
│   ├── hooks/            # Custom React hooks
│   ├── features/         # Feature-specific code
│   ├── types/            # TypeScript type definitions
│   └── test/             # Test utilities and configs
├── public/               # Static assets
├── prisma/               # Prisma schema and migrations
├── docs/                 # Documentation
├── next.config.ts        # Next.js configuration
├── vite.config.ts        # Vitest configuration
└── eslint.config.mjs     # ESLint configuration
```

## Configuration

The project uses Next.js configuration system while maintaining Vitest for testing:

- **next.config.ts**: Configuration for Next.js
- **vite.config.ts**: Configuration for Vitest
- **tsconfig.json**: TypeScript configuration
- **eslint.config.mjs**: ESLint rules (new flat config format)
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS configuration

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [MIT License](./LICENSE).

## Documentation

For more detailed documentation, see the `docs` directory:

- [Architecture Documentation](./docs/architecture/ARCHITECTURE.md)
- [Developer Guide](./docs/development/DEVELOPER.md)
- [Feature Implementation Template](./docs/feature-template.md)
- [Authentication](./docs/authentication.md)
- [Cloudflare AutoRAG](./docs/cloudflare-autorag.md)