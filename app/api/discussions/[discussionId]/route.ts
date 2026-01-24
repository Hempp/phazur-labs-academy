// Discussion Detail API
// Get discussion details, post replies, manage discussion

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET: Get discussion with replies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params
    const supabase = await createServerSupabaseClient()

    // Get discussion
    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .select(`
        id,
        course_id,
        lesson_id,
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
        course:courses (
          id,
          title,
          instructor_id
        )
      `)
      .eq('id', discussionId)
      .single()

    if (discussionError || !discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      )
    }

    // Get replies
    const { data: replies, error: repliesError } = await supabase
      .from('discussion_replies')
      .select(`
        id,
        content,
        is_instructor_reply,
        is_solution,
        likes_count,
        created_at,
        updated_at,
        user:users!discussion_replies_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('discussion_id', discussionId)
      .order('is_solution', { ascending: false })
      .order('created_at', { ascending: true })

    if (repliesError) {
      return NextResponse.json({ error: repliesError.message }, { status: 500 })
    }

    // Increment view count (fire and forget)
    supabase
      .from('discussions')
      .update({ view_count: (discussion.view_count || 0) + 1 })
      .eq('id', discussionId)
      .then(() => {})

    return NextResponse.json({
      discussion,
      replies: replies || [],
    })
  } catch (error) {
    console.error('Discussion GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Add a reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      )
    }

    // Get discussion to verify it exists and get course info
    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .select(`
        id,
        course_id,
        course:courses (
          instructor_id
        )
      `)
      .eq('id', discussionId)
      .single()

    if (discussionError || !discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      )
    }

    // Check if user is instructor
    const courseData = discussion.course as unknown as { instructor_id: string }
    const isInstructor = courseData.instructor_id === user.id

    // Verify enrollment if not instructor
    if (!isInstructor) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', discussion.course_id)
        .eq('user_id', user.id)
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course to reply' },
          { status: 403 }
        )
      }
    }

    // Create reply
    const { data: reply, error: insertError } = await supabase
      .from('discussion_replies')
      .insert({
        discussion_id: discussionId,
        user_id: user.id,
        content,
        is_instructor_reply: isInstructor,
      })
      .select(`
        id,
        content,
        is_instructor_reply,
        is_solution,
        likes_count,
        created_at,
        user:users!discussion_replies_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Reply added successfully',
      reply,
    })
  } catch (error) {
    console.error('Discussion reply POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update discussion (mark resolved, pin, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { is_resolved, is_pinned, title, content } = body

    // Get discussion
    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .select(`
        id,
        user_id,
        course:courses (
          instructor_id
        )
      `)
      .eq('id', discussionId)
      .single()

    if (discussionError || !discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      )
    }

    const courseData = discussion.course as unknown as { instructor_id: string }
    const isAuthor = discussion.user_id === user.id
    const isInstructor = courseData.instructor_id === user.id

    // Only author or instructor can update
    if (!isAuthor && !isInstructor) {
      return NextResponse.json(
        { error: 'You can only edit your own discussions' },
        { status: 403 }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Author can update content/title and mark resolved
    if (isAuthor) {
      if (title !== undefined) updateData.title = title
      if (content !== undefined) updateData.content = content
      if (is_resolved !== undefined) updateData.is_resolved = is_resolved
    }

    // Only instructor can pin
    if (isInstructor && is_pinned !== undefined) {
      updateData.is_pinned = is_pinned
    }

    // Instructor can also mark resolved
    if (isInstructor && is_resolved !== undefined) {
      updateData.is_resolved = is_resolved
    }

    const { data: updated, error: updateError } = await supabase
      .from('discussions')
      .update(updateData)
      .eq('id', discussionId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Discussion updated successfully',
      discussion: updated,
    })
  } catch (error) {
    console.error('Discussion PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete discussion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get discussion
    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .select(`
        id,
        user_id,
        course:courses (
          instructor_id
        )
      `)
      .eq('id', discussionId)
      .single()

    if (discussionError || !discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      )
    }

    const courseData = discussion.course as unknown as { instructor_id: string }
    const isAuthor = discussion.user_id === user.id
    const isInstructor = courseData.instructor_id === user.id

    // Only author or instructor can delete
    if (!isAuthor && !isInstructor) {
      return NextResponse.json(
        { error: 'You can only delete your own discussions' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('discussions')
      .delete()
      .eq('id', discussionId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Discussion deleted successfully',
    })
  } catch (error) {
    console.error('Discussion DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
