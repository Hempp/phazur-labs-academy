// Discussions API
// List and create course/lesson discussions

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(
    url && key &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('your-') &&
    key !== 'your-anon-key'
  )
}

// Mock discussions for development
const mockDiscussions = [
  {
    id: 'd1',
    title: 'How do compound components handle state sharing?',
    content: 'I\'m trying to understand the pattern better. When we use the Context API inside compound components, how does the parent manage state for all children?',
    is_pinned: true,
    is_resolved: true,
    view_count: 156,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'u1',
      full_name: 'Alex Chen',
      avatar_url: null,
    },
    replies: [{ count: 12 }],
  },
  {
    id: 'd2',
    title: 'Best practices for TypeScript with compound components?',
    content: 'What\'s the recommended way to type compound components? Should I use generics or just infer types from the context?',
    is_pinned: false,
    is_resolved: false,
    view_count: 89,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'u2',
      full_name: 'Sarah Miller',
      avatar_url: null,
    },
    replies: [{ count: 5 }],
  },
  {
    id: 'd3',
    title: 'Error boundary integration question',
    content: 'Can compound components work well with error boundaries? I\'m getting some issues when a child component throws.',
    is_pinned: false,
    is_resolved: false,
    view_count: 34,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'u3',
      full_name: 'Mike Johnson',
      avatar_url: null,
    },
    replies: [{ count: 2 }],
  },
]

// GET: List discussions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const lessonId = searchParams.get('lessonId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Return mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        discussions: mockDiscussions,
        pagination: {
          page: 1,
          limit: 20,
          total: mockDiscussions.length,
          totalPages: 1,
        },
      })
    }

    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Use admin client in dev bypass mode to bypass RLS
    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    // Build query - note: view_count may not exist in all schemas
    let query = supabase
      .from('discussions')
      .select('id, title, content, is_pinned, is_resolved, created_at, updated_at, user:users!discussions_user_id_fkey(id, full_name, avatar_url)', { count: 'exact' })
      .eq('course_id', courseId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // Filter by lesson if specified
    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    const { data: discussions, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get reply counts for each discussion
    const discussionIds = (discussions || []).map(d => d.id)
    const replyCounts: Record<string, number> = {}

    if (discussionIds.length > 0) {
      const { data: replies } = await supabase
        .from('discussion_replies')
        .select('discussion_id')
        .in('discussion_id', discussionIds)

      // Count replies per discussion
      for (const reply of replies || []) {
        replyCounts[reply.discussion_id] = (replyCounts[reply.discussion_id] || 0) + 1
      }
    }

    // Format discussions to match UI expectations
    const formattedDiscussions = (discussions || []).map((d) => {
      // Handle Supabase join which can return object or array
      const userData = Array.isArray(d.user) ? d.user[0] : d.user

      return {
        id: d.id,
        title: d.title,
        content: d.content,
        is_pinned: d.is_pinned,
        is_resolved: d.is_resolved,
        view_count: 0, // Column may not exist - default to 0
        created_at: d.created_at,
        user: {
          id: userData?.id || '',
          full_name: userData?.full_name || 'Unknown User',
          avatar_url: userData?.avatar_url || null,
        },
        // UI expects replies as array with count object
        replies: [{ count: replyCounts[d.id] || 0 }]
      }
    })

    return NextResponse.json({
      discussions: formattedDiscussions,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Discussions GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new discussion
export async function POST(request: NextRequest) {
  try {
    // Dev auth bypass for testing
    const isDevBypass = process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

    // Use admin client in dev bypass mode to bypass RLS
    const supabase = isDevBypass
      ? await createServerSupabaseAdmin()
      : await createServerSupabaseClient()

    let userId: string | null = null

    if (!isDevBypass) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      userId = user.id
    } else {
      // In dev bypass mode, get the first student from users table
      const { data: testUser } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'student')
        .limit(1)
        .single()

      if (!testUser) {
        return NextResponse.json(
          { error: 'No test user found' },
          { status: 500 }
        )
      }
      userId = testUser.id
    }

    const body = await request.json()
    const { courseId, lessonId, title, content } = body

    if (!courseId || !title || !content) {
      return NextResponse.json(
        { error: 'courseId, title, and content are required' },
        { status: 400 }
      )
    }

    // Verify course exists
    const { data: course } = await supabase
      .from('courses')
      .select('id, instructor_id')
      .eq('id', courseId)
      .single()

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Skip enrollment check in dev bypass mode
    if (!isDevBypass) {
      const isInstructor = course.instructor_id === userId

      if (!isInstructor) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('user_id', userId)
          .single()

        if (!enrollment) {
          return NextResponse.json(
            { error: 'You must be enrolled in this course to post discussions' },
            { status: 403 }
          )
        }
      }
    }

    // Create discussion
    const { data: discussion, error: insertError } = await supabase
      .from('discussions')
      .insert({
        course_id: courseId,
        lesson_id: lessonId || null,
        user_id: userId,
        title,
        content,
      })
      .select(`
        id,
        title,
        content,
        is_pinned,
        is_resolved,
        created_at,
        user:users!discussions_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Format response to match UI expectations
    const userData = Array.isArray(discussion?.user) ? discussion.user[0] : discussion?.user

    return NextResponse.json({
      discussion: {
        id: discussion?.id,
        title: discussion?.title,
        content: discussion?.content,
        is_pinned: discussion?.is_pinned || false,
        is_resolved: discussion?.is_resolved || false,
        view_count: 0, // Column may not exist - default to 0
        created_at: discussion?.created_at,
        user: {
          id: userData?.id || userId,
          full_name: userData?.full_name || 'Unknown User',
          avatar_url: userData?.avatar_url || null,
        },
        replies: [{ count: 0 }]
      },
    })
  } catch (error) {
    console.error('Discussions POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
