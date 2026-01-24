// Lesson Notes API
// Manages user notes for specific lessons

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET: Retrieve notes for a lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get notes from lesson_progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .select('id, notes, updated_at')
      .eq('lesson_id', lessonId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      notes: progress?.notes || '',
      lastUpdated: progress?.updated_at || null
    })
  } catch (error) {
    console.error('Notes GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST/PUT: Create or update notes for a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notes } = body

    if (typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'notes must be a string' },
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
        { error: 'You must be enrolled in this course' },
        { status: 403 }
      )
    }

    // Upsert notes into lesson_progress
    const { data: progress, error: upsertError } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_id: lesson.course_id,
        notes: notes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      })
      .select('id, notes, updated_at')
      .single()

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notes saved successfully',
      notes: progress.notes,
      lastUpdated: progress.updated_at
    })
  } catch (error) {
    console.error('Notes POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Clear notes for a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update notes to null (don't delete the progress record)
    const { error: updateError } = await supabase
      .from('lesson_progress')
      .update({
        notes: null,
        updated_at: new Date().toISOString()
      })
      .eq('lesson_id', lessonId)
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notes cleared successfully'
    })
  } catch (error) {
    console.error('Notes DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
