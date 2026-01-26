// Test setup file
import { vi } from 'vitest'

// Mock Next.js request/response
vi.mock('next/server', () => ({
  NextRequest: vi.fn().mockImplementation((url: string, init?: RequestInit) => {
    const urlObj = new URL(url, 'http://localhost:3000')
    return {
      url,
      method: init?.method || 'GET',
      headers: new Headers(init?.headers),
      json: async () => init?.body ? JSON.parse(init.body as string) : {},
      nextUrl: urlObj,
    }
  }),
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => ({
      status: init?.status || 200,
      json: async () => data,
      headers: new Headers(init?.headers),
    }),
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
