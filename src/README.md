# RecruitReply Source Code Structure

This project follows Clean Architecture principles with a feature-based organization. The code is organized into the following layers:

## Clean Architecture Layers

### 1. Domain Layer
Located in `src/domain/`

Contains:
- Business entities and models (`models/`)
- Repository interfaces (`repositories/`)
- Domain services and business logic

This layer has no dependencies on any other layer.

### 2. Application Layer
Located in `src/application/`

Contains:
- Application services that orchestrate use cases
- DTOs (Data Transfer Objects)
- Application-specific interfaces
- Validation logic

Depends on the Domain layer only.

### 3. Infrastructure Layer
Located in `src/infrastructure/`

Contains:
- Repository implementations
- External service integrations (Cloudflare, etc.)
- Database connections
- Factory implementations

Depends on the Domain and Application layers.

### 4. Presentation Layer
Located in `src/app/` (Next.js App Router)

Contains:
- UI components
- Routes and pages
- API endpoints
- User interaction logic

## Feature-Based Organization

Within each layer, code is organized by feature or module:
- Documents management
- Chat functionality
- Authentication
- etc.

## Testing Structure

Tests are co-located with the code they test:
- `src/domain/**/__tests__/` - Tests for domain layer
- `src/application/**/__tests__/` - Tests for application layer
- `src/infrastructure/**/__tests__/` - Tests for infrastructure layer
- `src/app/**/__tests__/` - Tests for presentation layer

Additional tests:
- Unit tests: Focus on individual components/functions
- Integration tests: Test interactions between components
- E2E tests: Test complete user flows

## Best Practices

This project follows:
- SOLID principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Test-Driven Development (TDD)

## Utilities and Shared Code

- `src/lib/` - Shared utilities and functions
- `src/components/` - Shared UI components
- `src/hooks/` - Custom React hooks 