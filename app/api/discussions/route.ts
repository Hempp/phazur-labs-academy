// Discussions API
// List and create course/lesson discussions

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

    const supabase = await createServerSupabaseClient()

    // Helper to build the query with or without view_count
    const buildQuery = (includeViewCount: boolean) => {
      const selectFields = includeViewCount
        ? `
          id,
          title,
          content,
          is_pinned,
          is_resolved,
          view_count,
          created_at,
          updated_at,
          user:users!discussions_user_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          replies:discussion_replies (count)
        `
        : `
          id,
          title,
          content,
          is_pinned,
          is_resolved,
          created_at,
          updated_at,
          user:users!discussions_user_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          replies:discussion_replies (count)
        `

      let query = supabase
        .from('discussions')
        .select(selectFields, { count: 'exact' })
        .eq('course_id', courseId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      // Filter by lesson if specified
      if (lessonId) {
        query = query.eq('lesson_id', lessonId)
      }

      return query
    }

    // Try with view_count first, fallback without it
    let { data: discussions, error, count } = await buildQuery(true)

    // If view_count column doesn't exist, retry without it
    if (error?.message?.includes('view_count')) {
      console.warn('view_count column missing, falling back to query without it')
      const result = await buildQuery(false)
      discussions = result.data
      error = result.error
      count = result.count
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add default view_count if missing
    const discussionsWithViewCount = (discussions || []).map((d: Record<string, unknown>) => ({
      ...d,
      view_count: d.view_count ?? 0
    }))

    return NextResponse.json({
      discussions: discussionsWithViewCount,
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
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, lessonId, title, content } = body

    if (!courseId || !title || !content) {
      return NextResponse.json(
        { error: 'courseId, title, and content are required' },
        { status: 400 }
      )
    }

    // Verify user is enrolled or is instructor
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single()

    const isInstructor = course?.instructor_id === user.id

    if (!isInstructor) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course to post discussions' },
          { status: 403 }
        )
      }
    }

    // Create discussion (try with view_count, fallback without)
    const selectWithViewCount = `
      id,
      title,
      content,
      is_pinned,
      is_resolved,
      view_count,
      created_at,
      user:users!discussions_user_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `
    const selectWithoutViewCount = `
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
    `

    let { data: discussion, error: insertError } = await supabase
      .from('discussions')
      .insert({
        course_id: courseId,
        lesson_id: lessonId || null,
        user_id: user.id,
        title,
        content,
      })
      .select(selectWithViewCount)
      .single()

    // If view_count column doesn't exist, retry without it
    if (insertError?.message?.includes('view_count')) {
      const result = await supabase
        .from('discussions')
        .insert({
          course_id: courseId,
          lesson_id: lessonId || null,
          user_id: user.id,
          title,
          content,
        })
        .select(selectWithoutViewCount)
        .single()
      discussion = result.data
      insertError = result.error
    }

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Discussion created successfully',
      discussion: {
        ...discussion,
        view_count: (discussion as Record<string, unknown>)?.view_count ?? 0
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
