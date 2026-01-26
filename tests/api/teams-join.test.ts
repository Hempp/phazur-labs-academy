// Tests for /api/teams/join API
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockUser, mockTeam, mockInvitation } from '../utils/mocks'

// Mock the Supabase server client
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}))

// Import after mocking
import { GET, POST } from '@/app/api/teams/join/route'

describe('/api/teams/join', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET - Validate invitation token', () => {
    it('returns error when token is missing', async () => {
      const request = {
        url: 'http://localhost:3000/api/teams/join',
        nextUrl: new URL('http://localhost:3000/api/teams/join'),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Token is required')
      expect(data.valid).toBe(false)
    })

    it('returns error when invitation not found', async () => {
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      })
      mockSupabaseClient.from = mockFrom

      const request = {
        url: 'http://localhost:3000/api/teams/join?token=invalid-token',
        nextUrl: new URL('http://localhost:3000/api/teams/join?token=invalid-token'),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Invalid invitation token')
      expect(data.valid).toBe(false)
    })

    it('returns error when invitation is already accepted', async () => {
      const acceptedInvitation = {
        ...mockInvitation,
        status: 'accepted',
        team: mockTeam,
        inviter: { full_name: 'John Doe' },
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: acceptedInvitation, error: null }),
      })
      mockSupabaseClient.from = mockFrom

      const request = {
        url: 'http://localhost:3000/api/teams/join?token=test-token',
        nextUrl: new URL('http://localhost:3000/api/teams/join?token=test-token'),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('This invitation has already been used')
      expect(data.valid).toBe(false)
    })

    it('returns error when invitation is expired', async () => {
      const expiredInvitation = {
        ...mockInvitation,
        expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        team: mockTeam,
        inviter: { full_name: 'John Doe' },
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: expiredInvitation, error: null }),
      })
      mockSupabaseClient.from = mockFrom

      const request = {
        url: 'http://localhost:3000/api/teams/join?token=test-token',
        nextUrl: new URL('http://localhost:3000/api/teams/join?token=test-token'),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('This invitation has expired')
      expect(data.expired).toBe(true)
    })

    it('returns valid invitation details for unauthenticated user', async () => {
      const validInvitation = {
        ...mockInvitation,
        team: mockTeam,
        inviter: { full_name: 'John Doe' },
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: validInvitation, error: null }),
      })
      mockSupabaseClient.from = mockFrom
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null })

      const request = {
        url: 'http://localhost:3000/api/teams/join?token=test-token',
        nextUrl: new URL('http://localhost:3000/api/teams/join?token=test-token'),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.isLoggedIn).toBe(false)
      expect(data.invitation.team.name).toBe('Test Team')
    })

    it('returns valid invitation with email match status for authenticated user', async () => {
      const validInvitation = {
        ...mockInvitation,
        team: mockTeam,
        inviter: { full_name: 'John Doe' },
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: validInvitation, error: null }),
      })
      mockSupabaseClient.from = mockFrom
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null })

      const request = {
        url: 'http://localhost:3000/api/teams/join?token=test-token',
        nextUrl: new URL('http://localhost:3000/api/teams/join?token=test-token'),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.isLoggedIn).toBe(true)
      expect(data.emailMatch).toBe(true)
      expect(data.userEmail).toBe('test@example.com')
    })
  })

  describe('POST - Accept invitation', () => {
    it('returns error when token is missing', async () => {
      const request = {
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Token is required')
    })

    it('returns error when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'Not authenticated' } })

      const request = {
        json: vi.fn().mockResolvedValue({ token: 'test-token' }),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('You must be logged in to accept this invitation')
    })

    it('returns error when email does not match', async () => {
      const differentEmailUser = { ...mockUser, email: 'different@example.com' }
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({ data: { user: differentEmailUser }, error: null })

      const validInvitation = {
        ...mockInvitation,
        team: mockTeam,
      }

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: validInvitation, error: null }),
      })
      mockSupabaseClient.from = mockFrom

      const request = {
        json: vi.fn().mockResolvedValue({ token: 'test-token' }),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('test@example.com')
    })

    it('handles user already being a member', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null })

      const validInvitation = {
        ...mockInvitation,
        team: mockTeam,
      }

      let callCount = 0
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'team_invitations') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: validInvitation, error: null }),
            update: vi.fn().mockReturnThis(),
          }
        }
        if (table === 'team_members') {
          callCount++
          if (callCount === 1) {
            // First call - check if already member (return existing member)
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: { id: 'existing-member' }, error: null }),
            }
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          update: vi.fn().mockReturnThis(),
        }
      })
      mockSupabaseClient.from = mockFrom

      const request = {
        json: vi.fn().mockResolvedValue({ token: 'test-token' }),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.alreadyMember).toBe(true)
    })
  })
})
