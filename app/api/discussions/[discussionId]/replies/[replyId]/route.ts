// Discussion Reply API
// Manage individual replies (edit, delete, mark as solution)

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// PATCH: Update reply (edit content or mark as solution)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string; replyId: string }> }
) {
  try {
    const { discussionId, replyId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, is_solution } = body

    // Get reply with discussion and course info
    const { data: reply, error: replyError } = await supabase
      .from('discussion_replies')
      .select(`
        id,
        user_id,
        discussion:discussions (
          id,
          user_id,
          course:courses (
            instructor_id
          )
        )
      `)
      .eq('id', replyId)
      .eq('discussion_id', discussionId)
      .single()

    if (replyError || !reply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    const discussionData = reply.discussion as unknown as {
      id: string
      user_id: string
      course: { instructor_id: string }
    }

    const isReplyAuthor = reply.user_id === user.id
    const isDiscussionAuthor = discussionData.user_id === user.id
    const isInstructor = discussionData.course.instructor_id === user.id

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    // Only reply author can edit content
    if (content !== undefined) {
      if (!isReplyAuthor) {
        return NextResponse.json(
          { error: 'You can only edit your own replies' },
          { status: 403 }
        )
      }
      updateData.content = content
    }

    // Discussion author or instructor can mark as solution
    if (is_solution !== undefined) {
      if (!isDiscussionAuthor && !isInstructor) {
        return NextResponse.json(
          { error: 'Only the discussion author or instructor can mark solutions' },
          { status: 403 }
        )
      }
      updateData.is_solution = is_solution

      // If marking as solution, unmark other solutions in this discussion
      if (is_solution) {
        await supabase
          .from('discussion_replies')
          .update({ is_solution: false })
          .eq('discussion_id', discussionId)
          .neq('id', replyId)
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from('discussion_replies')
      .update(updateData)
      .eq('id', replyId)
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
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: is_solution ? 'Reply marked as solution' : 'Reply updated successfully',
      reply: updated,
    })
  } catch (error) {
    console.error('Reply PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete reply
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string; replyId: string }> }
) {
  try {
    const { discussionId, replyId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get reply
    const { data: reply, error: replyError } = await supabase
      .from('discussion_replies')
      .select(`
        id,
        user_id,
        discussion:discussions (
          course:courses (
            instructor_id
          )
        )
      `)
      .eq('id', replyId)
      .eq('discussion_id', discussionId)
      .single()

    if (replyError || !reply) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    const discussionData = reply.discussion as unknown as {
      course: { instructor_id: string }
    }

    const isAuthor = reply.user_id === user.id
    const isInstructor = discussionData.course.instructor_id === user.id

    // Only author or instructor can delete
    if (!isAuthor && !isInstructor) {
      return NextResponse.json(
        { error: 'You can only delete your own replies' },
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('discussion_replies')
      .delete()
      .eq('id', replyId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Reply deleted successfully',
    })
  } catch (error) {
    console.error('Reply DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
