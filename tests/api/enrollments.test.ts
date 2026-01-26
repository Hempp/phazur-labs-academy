// Tests for /api/enrollments API - Free Course Enrollment
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase clients
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

const mockSupabaseAdmin = {
  from: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
  createServerSupabaseAdmin: vi.fn(() => Promise.resolve(mockSupabaseAdmin)),
}))

// Import after mocking
import { GET, POST } from '@/app/api/enrollments/route'

describe('/api/enrollments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment
    process.env.NODE_ENV = 'development'
    process.env.DEV_AUTH_BYPASS = 'true'
  })

  describe('GET - Check enrollment status', () => {
    it('returns error when courseId/courseSlug is missing', async () => {
      const request = {
        url: 'http://localhost:3000/api/enrollments',
        headers: new Headers(),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('courseSlug or courseId is required')
    })

    it('returns not enrolled for unauthenticated user when Supabase not configured', async () => {
      // Force mock mode by not configuring Supabase properly
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'placeholder'

      const request = {
        url: 'http://localhost:3000/api/enrollments?courseId=test-id',
        headers: new Headers(),
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.isEnrolled).toBe(false)
    })

    it('returns enrolled when x-mock-enrolled header is true', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'placeholder'

      const headers = new Headers()
      headers.set('x-mock-enrolled', 'true')

      const request = {
        url: 'http://localhost:3000/api/enrollments?courseId=test-id',
        headers,
      } as unknown as Request

      const response = await GET(request as never)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.isEnrolled).toBe(true)
      expect(data.enrollment).toBeDefined()
    })
  })

  describe('POST - Free course enrollment', () => {
    it('returns error when courseId is missing', async () => {
      const request = {
        url: 'http://localhost:3000/api/enrollments',
        headers: new Headers(),
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('courseId is required')
    })

    it('returns error when course is not free', async () => {
      const mockCourse = {
        id: 'course-1',
        title: 'Paid Course',
        price: 99.99,
        is_free: false,
        status: 'published',
      }

      // Mock finding a user
      mockSupabaseAdmin.from = vi.fn().mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'user-1' }, error: null }),
          }
        }
        if (table === 'courses') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCourse, error: null }),
          }
        }
        return { select: vi.fn().mockReturnThis() }
      })

      const request = {
        url: 'http://localhost:3000/api/enrollments',
        headers: new Headers(),
        json: vi.fn().mockResolvedValue({ courseId: 'course-1' }),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('requires payment')
    })

    it('successfully enrolls in free course', async () => {
      const mockCourse = {
        id: 'free-course-1',
        title: 'Free Course',
        price: 0,
        is_free: true,
        status: 'published',
      }

      const mockEnrollment = {
        id: 'enrollment-1',
        course_id: 'free-course-1',
        enrolled_at: new Date().toISOString(),
        progress_percentage: 0,
      }

      mockSupabaseAdmin.from = vi.fn().mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'user-1' }, error: null }),
          }
        }
        if (table === 'courses') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCourse, error: null }),
          }
        }
        if (table === 'enrollments') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
            insert: vi.fn().mockReturnThis(),
          }
        }
        return { select: vi.fn().mockReturnThis() }
      })

      // Override the insert chain for enrollment
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockEnrollment, error: null }),
        }),
      })

      mockSupabaseAdmin.from = vi.fn().mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'user-1' }, error: null }),
          }
        }
        if (table === 'courses') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCourse, error: null }),
          }
        }
        if (table === 'enrollments') {
          const enrollmentMock = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
            insert: mockInsert,
          }
          return enrollmentMock
        }
        return { select: vi.fn().mockReturnThis() }
      })

      const request = {
        url: 'http://localhost:3000/api/enrollments',
        headers: new Headers(),
        json: vi.fn().mockResolvedValue({ courseId: 'free-course-1' }),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.enrollment).toBeDefined()
    })

    it('returns conflict when already enrolled', async () => {
      const mockCourse = {
        id: 'free-course-1',
        title: 'Free Course',
        price: 0,
        is_free: true,
        status: 'published',
      }

      const existingEnrollment = {
        id: 'existing-enrollment',
      }

      mockSupabaseAdmin.from = vi.fn().mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'user-1' }, error: null }),
          }
        }
        if (table === 'courses') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCourse, error: null }),
          }
        }
        if (table === 'enrollments') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: existingEnrollment, error: null }),
          }
        }
        return { select: vi.fn().mockReturnThis() }
      })

      const request = {
        url: 'http://localhost:3000/api/enrollments',
        headers: new Headers(),
        json: vi.fn().mockResolvedValue({ courseId: 'free-course-1' }),
      } as unknown as Request

      const response = await POST(request as never)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toContain('already enrolled')
    })
  })
})
