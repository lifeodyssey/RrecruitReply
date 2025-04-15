# Feature Implementation Template

This template provides a structured approach to implementing new features in the Recruit-Reply application following clean code principles.

## Feature Overview

**Feature Name**: [Feature Name]

**Description**: [Brief description of the feature]

**Business Value**: [Explain the business value this feature provides]

## Implementation Checklist

### 1. Domain Layer

- [ ] Define domain entities and value objects
- [ ] Implement domain interfaces
- [ ] Create domain services for business logic
- [ ] Write unit tests for domain logic

Sample implementation:

```typescript
// Domain Entity
export interface IRecruitmentQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  createdAt: Date;
  updatedAt: Date;
}

// Value Object
export enum QuestionCategory {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  PROCESS = 'PROCESS',
}

// Domain Service Interface
export interface IQuestionRepository {
  findById(id: string): Promise<IRecruitmentQuestion | null>;
  findByCategory(category: QuestionCategory): Promise<IRecruitmentQuestion[]>;
  create(question: Omit<IRecruitmentQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRecruitmentQuestion>;
  update(id: string, question: Partial<IRecruitmentQuestion>): Promise<IRecruitmentQuestion>;
  delete(id: string): Promise<boolean>;
}
```

### 2. Infrastructure Layer

- [ ] Implement repositories for data access
- [ ] Create external service integrations
- [ ] Develop API clients
- [ ] Write integration tests

Sample implementation:

```typescript
// Repository Implementation
export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<IRecruitmentQuestion | null> {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async findByCategory(category: QuestionCategory): Promise<IRecruitmentQuestion[]> {
    return this.prisma.question.findMany({
      where: { category },
    });
  }

  async create(question: Omit<IRecruitmentQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<IRecruitmentQuestion> {
    return this.prisma.question.create({
      data: question,
    });
  }

  async update(id: string, questionData: Partial<IRecruitmentQuestion>): Promise<IRecruitmentQuestion> {
    return this.prisma.question.update({
      where: { id },
      data: questionData,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.question.delete({
      where: { id },
    });
    return true;
  }
}
```

### 3. Application Layer

- [ ] Create use cases
- [ ] Implement application services
- [ ] Develop DTOs if needed
- [ ] Write unit tests for application services

Sample implementation:

```typescript
// Use Case
export class GetQuestionsByCategoryUseCase {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async execute(category: QuestionCategory): Promise<IRecruitmentQuestion[]> {
    return this.questionRepository.findByCategory(category);
  }
}

// Application Service
export class QuestionService {
  constructor(
    private readonly getQuestionsByCategoryUseCase: GetQuestionsByCategoryUseCase,
    private readonly createQuestionUseCase: CreateQuestionUseCase
  ) {}

  async getQuestionsByCategory(category: QuestionCategory): Promise<IRecruitmentQuestion[]> {
    return this.getQuestionsByCategoryUseCase.execute(category);
  }

  async createQuestion(question: CreateQuestionDTO): Promise<IRecruitmentQuestion> {
    return this.createQuestionUseCase.execute(question);
  }
}

// DTO
export interface CreateQuestionDTO {
  question: string;
  category: QuestionCategory;
}
```

### 4. Presentation Layer

- [ ] Build UI components
- [ ] Implement pages and layouts
- [ ] Create hooks for data fetching
- [ ] Write component tests

Sample implementation:

```typescript
// React Hook
export function useQuestions(category: QuestionCategory) {
  const [questions, setQuestions] = useState<IRecruitmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/questions?category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, [category]);

  return { questions, isLoading, error };
}

// React Component
const QuestionList: React.FC<{ category: QuestionCategory }> = ({ category }) => {
  const { questions, isLoading, error } = useQuestions(category);

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{category} Questions</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>{question.question}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 5. API Routes (if needed)

- [ ] Implement API endpoints
- [ ] Create request validation
- [ ] Add error handling
- [ ] Write API tests

Sample implementation:

```typescript
// Next.js API Route
import { NextRequest, NextResponse } from 'next/server';
import { QuestionCategory } from '@/domain/entities/question';
import { getQuestionService } from '@/application/services';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') as QuestionCategory | null;

  if (!category || !Object.values(QuestionCategory).includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const questionService = getQuestionService();
    const questions = await questionService.getQuestionsByCategory(category);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
```

## Testing Strategy

- [ ] Unit tests for domain and application logic
- [ ] Integration tests for repositories and external services
- [ ] Component tests for UI components
- [ ] API tests for endpoints
- [ ] E2E tests for user flows

## Documentation

- [ ] Update API documentation
- [ ] Add component documentation
- [ ] Update architecture documentation if needed
- [ ] Document any configuration changes

## Deployment Considerations

- [ ] Database migrations
- [ ] Environment variables
- [ ] Infrastructure changes
- [ ] Performance monitoring

## Definition of Done

- [ ] All tests pass
- [ ] Code passes linting and type checking
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Feature deployed to staging environment
- [ ] Feature manually tested in staging environment 