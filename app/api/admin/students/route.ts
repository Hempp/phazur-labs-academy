import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET - List all students
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const plan = searchParams.get('plan') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query for students
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        role,
        created_at,
        is_active,
        preferences,
        enrollments:enrollments(
          id,
          course_id,
          enrolled_at,
          progress_percentage,
          courses(id, title, slug)
        )
      `, { count: 'exact' })
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: students, error, count } = await query

    if (error) {
      throw error
    }

    // Transform data to match UI expectations
    const transformedStudents = students?.map(student => ({
      id: student.id,
      name: student.full_name,
      email: student.email,
      avatar: student.avatar_url,
      status: student.is_active ? 'Active' : 'Inactive',
      plan: 'Pro', // TODO: Get from subscriptions table when implemented
      enrolledCourses: student.enrollments?.length || 0,
      enrollments: student.enrollments,
      joinDate: student.created_at,
      lastActive: student.created_at, // TODO: Track last activity
    }))

    return NextResponse.json({
      students: transformedStudents,
      total: count,
      limit,
      offset,
    })

  } catch (error) {
    console.error('Students fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST - Create a new student
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, courseIds } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
    }

    // Create the user in auth (this will trigger the users table insert via trigger)
    // For now, we'll create a record directly since we don't have signup flow
    // In production, you'd send an invite email

    // Generate a UUID for the new user
    const { data: newUserId } = await supabase.rpc('uuid_generate_v4')

    // Insert into users table
    const { data: newStudent, error: insertError } = await supabase
      .from('users')
      .insert({
        id: newUserId || crypto.randomUUID(),
        email,
        full_name: name,
        role: 'student',
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      // Check for unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
      }
      throw insertError
    }

    // Enroll in selected courses
    if (courseIds && courseIds.length > 0 && newStudent) {
      const enrollments = courseIds.map((courseId: string) => ({
        user_id: newStudent.id,
        course_id: courseId,
        is_active: true,
      }))

      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert(enrollments)

      if (enrollError) {
        console.error('Failed to enroll student in courses:', enrollError)
        // Continue anyway - user is created
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        id: newStudent.id,
        name: newStudent.full_name,
        email: newStudent.email,
        status: 'Active',
      },
      message: 'Student created successfully',
    })

  } catch (error) {
    console.error('Student creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create student' },
      { status: 500 }
    )
  }
}
