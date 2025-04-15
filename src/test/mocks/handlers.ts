import { http, HttpResponse } from 'msw';

// Define handlers for API endpoints
export const handlers = [
  // Example of a GET handler for questions
  http.get('/api/questions', () =>
    HttpResponse.json([
      {
        id: '1',
        question: 'What is the recruitment process?',
        category: 'PROCESS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        question: 'What technical skills are required?',
        category: 'TECHNICAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  ),

  // Example of a GET handler for a specific question
  http.get('/api/questions/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      question: 'What is the recruitment process?',
      category: 'PROCESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  // Example of a POST handler for creating a question
  http.post('/api/questions', async ({ request }) => {
    const data = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: '3',
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Example of authentication endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: { id: '1', email, name: 'Test User' },
        token: 'fake-jwt-token',
      });
    }

    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // Example of an error response
  http.get('/api/error-example', () =>
    HttpResponse.json({ message: 'Something went wrong' }, { status: 500 })
  ),

  // Example of a chat API
  http.post('/api/chat', async ({ request }) => {
    const { message } = (await request.json()) as { message: string };

    return HttpResponse.json({
      id: Date.now().toString(),
      message: `Echo: ${message}`,
      timestamp: new Date().toISOString(),
    });
  }),
];
