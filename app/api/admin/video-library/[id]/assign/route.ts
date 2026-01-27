/**
 * Video Assignment API Route
 *
 * POST /api/admin/video-library/[id]/assign - Assign video to course/module/lesson
 * DELETE /api/admin/video-library/[id]/assign - Remove video from lesson
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getVideo, assignVideoToLesson, removeVideoFromLesson } from '@/lib/services/video-library'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin/instructor role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { courseId, moduleId, lessonId } = body

    // At minimum, lessonId is required
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
    }

    // Get current video
    const video = await getVideo(id)

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Instructors can only assign their own videos
    if (profile.role === 'instructor' && video.uploadedBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify the lesson exists and get course info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, module_id')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Get the module to find course
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .select('id, course_id')
      .eq('id', lesson.module_id)
      .single()

    if (moduleError || !module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Instructors can only assign to their own courses
    if (profile.role === 'instructor') {
      const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', module.course_id)
        .single()

      if (course && course.instructor_id !== user.id) {
        return NextResponse.json({ error: 'You can only assign videos to your own courses' }, { status: 403 })
      }
    }

    // Assign the video
    const updatedVideo = await assignVideoToLesson(id, lessonId, {
      courseId: courseId || module.course_id,
      moduleId: moduleId || module.id,
    })

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Error assigning video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to assign video' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin/instructor role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'instructor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get current video
    const video = await getVideo(id)

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Instructors can only unassign their own videos
    if (profile.role === 'instructor' && video.uploadedBy !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedVideo = await removeVideoFromLesson(id)

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Error unassigning video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unassign video' },
      { status: 500 }
    )
  }
}
