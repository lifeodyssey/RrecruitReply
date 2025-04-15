# Recruit-Reply Architecture Documentation

This document outlines the architecture of the Recruit-Reply application, focusing on clean code principles, design patterns, and best practices.

## Architecture Overview

Recruit-Reply follows a clean architecture approach, separating concerns into distinct layers:

```
┌───────────────────────────────────┐
│            Presentation           │
│ (React Components, Pages, Layouts)│
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│            Application            │
│    (Use Cases, Service Layer)     │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│              Domain               │
│  (Entities, Business Logic, DTOs) │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│          Infrastructure           │
│ (Repositories, External Services) │
└───────────────────────────────────┘
```

### Layer Responsibilities

1. **Presentation Layer**
   - UI components built with React and Next.js
   - Pages and layouts
   - Client-side routing
   - User interactions and state management

2. **Application Layer**
   - Orchestrates the flow between UI and business logic
   - Contains use cases and application services
   - Handles application-specific business rules
   - Manages authentication and authorization

3. **Domain Layer**
   - Business objects and entities
   - Business rules and domain logic
   - Domain events and interfaces
   - Value objects and DTOs (Data Transfer Objects)

4. **Infrastructure Layer**
   - External service integrations
   - Database access and repositories
   - API clients
   - File storage, caching, and third-party services

## Design Principles

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each class/component has only one reason to change
   - Keep functions focused on a single task

2. **Open/Closed Principle (OCP)**
   - Software entities should be open for extension but closed for modification
   - Use interfaces and abstract classes to allow extending functionality

3. **Liskov Substitution Principle (LSP)**
   - Subtypes must be substitutable for their base types
   - Maintain consistent behavior in class hierarchies

4. **Interface Segregation Principle (ISP)**
   - Clients should not depend on interfaces they don't use
   - Prefer small, focused interfaces over large, monolithic ones

5. **Dependency Inversion Principle (DIP)**
   - High-level modules should not depend on low-level modules
   - Both should depend on abstractions
   - All layers depend inward toward the domain

### Additional Principles

1. **DRY (Don't Repeat Yourself)**
   - Extract common functionality into reusable components/functions
   - Use shared utilities and helpers

2. **KISS (Keep It Simple, Stupid)**
   - Prefer simple solutions over complex ones
   - Avoid over-engineering

3. **YAGNI (You Aren't Gonna Need It)**
   - Only implement what is currently needed
   - Avoid speculative generality

## Code Organization

### Project Structure

```
recruit-reply/
├── src/
│   ├── app/                    # Next.js app router pages and layouts
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   └── [feature]/          # Feature-specific components
│   ├── domain/                 # Domain models and business logic
│   │   ├── entities/           # Domain entities
│   │   ├── value-objects/      # Value objects
│   │   ├── events/             # Domain events
│   │   └── interfaces/         # Domain interfaces
│   ├── application/            # Application services and use cases
│   │   ├── services/           # Application services
│   │   ├── use-cases/          # Use cases
│   │   └── interfaces/         # Application interfaces
│   ├── infrastructure/         # External services and implementations
│   │   ├── repositories/       # Data access implementations
│   │   ├── api/                # API clients
│   │   └── services/           # External service integrations
│   ├── lib/                    # Utility functions and helpers
│   ├── hooks/                  # Custom React hooks
│   ├── features/               # Feature-specific code
│   ├── types/                  # TypeScript type definitions
│   └── __tests__/              # Test files
├── workers/                    # Cloudflare Workers
│   └── autorag/                # Auto RAG implementation
├── prisma/                     # Database schema and migrations
└── public/                     # Static assets
```

## Feature Implementation

When implementing a new feature:

1. **Start with the Domain**
   - Identify and model domain entities and business rules
   - Define interfaces that represent domain operations

2. **Implement Infrastructure**
   - Create repository implementations
   - Set up external service integrations

3. **Build Application Services**
   - Implement use cases that orchestrate domain logic
   - Create application services that coordinate between infrastructure and domain

4. **Create UI Components**
   - Build React components that consume application services
   - Implement pages and layouts

## Testing Strategy

Following the test pyramid approach:

1. **Unit Tests**
   - Test individual functions and components in isolation
   - Focus on business logic in the domain layer
   - Mock dependencies for application services

2. **Integration Tests**
   - Test interactions between multiple components
   - Verify infrastructure implementations with test databases
   - Test API integrations with mock servers

3. **UI/Component Tests**
   - Test UI components with React Testing Library
   - Verify component rendering and user interactions

4. **E2E Tests**
   - Test complete user flows and scenarios
   - Verify that the entire system works as expected

## Deployment Architecture

The application is deployed using Cloudflare Pages, with optional integration with Cloudflare R2 and Auto RAG to provide recruitment chatbot capabilities:

```
┌───────────────────────┐
│      Cloudflare       │
│         Pages         │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Cloudflare Edge    │
│       Functions       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    Cloudflare Auto    │
│          RAG          │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     Cloudflare R2     │
│     (Document DB)     │
└───────────────────────┘
```

## Development Guidelines

1. **Code Style**
   - Follow established code style and linting rules
   - Use meaningful variable and function names
   - Write self-documenting code with minimal comments

2. **Error Handling**
   - Use proper error handling techniques
   - Propagate errors to the appropriate layer
   - Provide meaningful error messages

3. **Documentation**
   - Document public APIs and interfaces
   - Add JSDoc comments to functions when necessary
   - Keep architecture documentation up to date

4. **Performance**
   - Optimize expensive operations
   - Use proper caching strategies
   - Minimize bundle size and dependencies 