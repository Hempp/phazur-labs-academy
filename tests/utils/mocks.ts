// Test mock utilities
import { vi } from 'vitest'

// Mock user data
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
}

export const mockTeam = {
  id: 'team-123',
  name: 'Test Team',
  slug: 'test-team',
  description: 'A test team',
  logo_url: null,
  is_active: true,
  max_members: 50,
  owner_id: 'owner-123',
  created_at: new Date().toISOString(),
}

export const mockInvitation = {
  id: 'inv-123',
  team_id: 'team-123',
  email: 'test@example.com',
  role: 'member' as const,
  status: 'pending' as const,
  token: 'test-token-123',
  invited_by: 'owner-123',
  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
}

export const mockMember = {
  id: 'member-123',
  team_id: 'team-123',
  user_id: 'user-123',
  role: 'member' as const,
  joined_at: new Date().toISOString(),
  invited_by: 'owner-123',
}

// Create a mock Supabase client
export function createMockSupabaseClient(overrides: Record<string, unknown> = {}) {
  const mockSelect = vi.fn().mockReturnThis()
  const mockInsert = vi.fn().mockReturnThis()
  const mockUpdate = vi.fn().mockReturnThis()
  const mockDelete = vi.fn().mockReturnThis()
  const mockEq = vi.fn().mockReturnThis()
  const mockSingle = vi.fn()
  const mockOrder = vi.fn().mockReturnThis()

  const chainMethods = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
    ...overrides,
  }

  // Make all methods chainable
  Object.values(chainMethods).forEach(method => {
    if (typeof method === 'function' && method !== mockSingle) {
      (method as ReturnType<typeof vi.fn>).mockReturnValue(chainMethods)
    }
  })

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      ...overrides.auth,
    },
    from: vi.fn().mockReturnValue(chainMethods),
    ...overrides,
  }
}

// Helper to create a mock NextRequest
export function createMockRequest(
  url: string,
  options: {
    method?: string
    body?: Record<string, unknown>
    headers?: Record<string, string>
  } = {}
) {
  const { method = 'GET', body, headers = {} } = options
  const urlObj = new URL(url, 'http://localhost:3000')

  return {
    url: urlObj.toString(),
    method,
    headers: new Headers(headers),
    json: async () => body || {},
    nextUrl: urlObj,
  } as unknown
}

// Helper to extract JSON from mock response
export async function getResponseJson(response: { json: () => Promise<unknown> }) {
  return response.json()
}
