// Bookmarks API
// Manages lesson bookmarks for users

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET: List user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Build query
    let query = supabase
      .from('lesson_bookmarks')
      .select(`
        id,
        lesson_id,
        course_id,
        created_at,
        lesson:lessons (
          id,
          title,
          type,
          duration_minutes,
          module:modules (
            id,
            title
          )
        ),
        course:courses (
          id,
          title,
          slug
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Filter by course if specified
    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: bookmarks, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('Bookmarks GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Add a bookmark
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
    const { lessonId } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      )
    }

    // Get lesson to verify it exists and get course_id
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, course_id')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Check if user is enrolled in the course
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', lesson.course_id)
      .eq('user_id', user.id)
      .single()

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled in this course to bookmark lessons' },
        { status: 403 }
      )
    }

    // Create bookmark (will fail silently on duplicate due to unique constraint)
    const { data: bookmark, error: insertError } = await supabase
      .from('lesson_bookmarks')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_id: lesson.course_id
      }, {
        onConflict: 'user_id,lesson_id',
        ignoreDuplicates: true
      })
      .select('id, lesson_id, course_id, created_at')
      .single()

    if (insertError && insertError.code !== '23505') {
      // 23505 = unique violation, which we can ignore
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Lesson bookmarked successfully',
      bookmark
    })
  } catch (error) {
    console.error('Bookmarks POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId query parameter is required' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('lesson_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Bookmark removed successfully'
    })
  } catch (error) {
    console.error('Bookmarks DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
