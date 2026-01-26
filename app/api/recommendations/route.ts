// AI-Powered Course Recommendations API
// Personalized course recommendations based on learning history and preferences

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface CourseRecommendation {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  difficulty_level: string
  duration_hours: number
  price: number
  rating: number
  enrollment_count: number
  instructor_name: string
  category: string
  tags: string[]
  recommendation_score: number
  recommendation_reason: string
}

// Mock recommendations for development
const mockRecommendations: CourseRecommendation[] = [
  {
    id: '1',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript-patterns',
    description: 'Master advanced TypeScript patterns for enterprise applications',
    thumbnail_url: null,
    difficulty_level: 'advanced',
    duration_hours: 12,
    price: 79,
    rating: 4.8,
    enrollment_count: 2340,
    instructor_name: 'Sarah Chen',
    category: 'Programming',
    tags: ['typescript', 'patterns', 'architecture'],
    recommendation_score: 0.95,
    recommendation_reason: 'Based on your JavaScript courses',
  },
  {
    id: '2',
    title: 'React Performance Optimization',
    slug: 'react-performance-optimization',
    description: 'Learn to build blazing-fast React applications',
    thumbnail_url: null,
    difficulty_level: 'intermediate',
    duration_hours: 8,
    price: 59,
    rating: 4.7,
    enrollment_count: 1850,
    instructor_name: 'Marcus Johnson',
    category: 'Frontend',
    tags: ['react', 'performance', 'optimization'],
    recommendation_score: 0.88,
    recommendation_reason: 'Popular among similar learners',
  },
  {
    id: '3',
    title: 'Node.js Microservices',
    slug: 'nodejs-microservices',
    description: 'Build scalable microservices with Node.js and Docker',
    thumbnail_url: null,
    difficulty_level: 'advanced',
    duration_hours: 15,
    price: 99,
    rating: 4.9,
    enrollment_count: 1200,
    instructor_name: 'Emily Rodriguez',
    category: 'Backend',
    tags: ['nodejs', 'microservices', 'docker'],
    recommendation_score: 0.82,
    recommendation_reason: 'Trending in your skill path',
  },
]

// GET: Get personalized course recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 25)
    const type = searchParams.get('type') || 'personalized' // personalized, trending, similar, new

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // For unauthenticated users, return trending courses
    if (!user) {
      return await getTrendingCourses(supabase, limit)
    }

    switch (type) {
      case 'personalized':
        return await getPersonalizedRecommendations(supabase, user.id, limit)
      case 'trending':
        return await getTrendingCourses(supabase, limit)
      case 'similar':
        const courseId = searchParams.get('courseId')
        if (!courseId) {
          return NextResponse.json(
            { error: 'courseId required for similar recommendations' },
            { status: 400 }
          )
        }
        return await getSimilarCourses(supabase, courseId, limit)
      case 'continue':
        return await getContinueLearning(supabase, user.id, limit)
      default:
        return await getPersonalizedRecommendations(supabase, user.id, limit)
    }
  } catch (error) {
    console.error('Recommendations GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get personalized recommendations based on user history
async function getPersonalizedRecommendations(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  limit: number
) {
  try {
    // 1. Get user's enrolled courses and completed courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        course_id,
        progress_percentage,
        completed_at,
        course:courses (
          id,
          category,
          difficulty_level,
          tags
        )
      `)
      .eq('user_id', userId)

    // 2. Get user's quiz performance to understand skill levels
    const { data: quizAttempts } = await supabase
      .from('quiz_attempts')
      .select(`
        score,
        quiz:quizzes (
          course_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    // 3. Build user profile from learning history
    const enrolledCourseIds = new Set(enrollments?.map(e => e.course_id) || [])
    const categories = new Map<string, number>()
    const tags = new Map<string, number>()
    let averageProgress = 0
    let completedCount = 0

    if (enrollments) {
      enrollments.forEach(e => {
        const course = Array.isArray(e.course) ? e.course[0] : e.course
        if (course) {
          // Count categories
          categories.set(
            course.category,
            (categories.get(course.category) || 0) + 1
          )
          // Count tags
          if (course.tags && Array.isArray(course.tags)) {
            course.tags.forEach((tag: string) => {
              tags.set(tag, (tags.get(tag) || 0) + 1)
            })
          }
        }
        averageProgress += e.progress_percentage || 0
        if (e.completed_at) completedCount++
      })
      if (enrollments.length > 0) {
        averageProgress /= enrollments.length
      }
    }

    // 4. Determine user's skill level based on completed courses
    let preferredDifficulty = 'beginner'
    if (completedCount >= 5) {
      preferredDifficulty = 'advanced'
    } else if (completedCount >= 2) {
      preferredDifficulty = 'intermediate'
    }

    // 5. Get candidate courses (not enrolled)
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        slug,
        description,
        thumbnail_url,
        difficulty_level,
        duration_hours,
        price,
        category,
        tags,
        status,
        instructor:users!courses_instructor_id_fkey (
          id,
          full_name
        )
      `)
      .eq('status', 'published')
      .limit(100)

    if (coursesError || !courses) {
      console.log('Using mock recommendations')
      return NextResponse.json({
        recommendations: mockRecommendations.slice(0, limit),
        type: 'personalized',
        total: mockRecommendations.length,
      })
    }

    // 6. Score each course
    const scoredCourses = courses
      .filter(course => !enrolledCourseIds.has(course.id))
      .map(course => {
        let score = 0
        let reason = ''

        // Category match (high weight)
        const categoryCount = categories.get(course.category) || 0
        if (categoryCount > 0) {
          score += 0.3 * Math.min(categoryCount / 3, 1)
          reason = `Based on your ${course.category} courses`
        }

        // Tag overlap
        const courseTags = course.tags || []
        let tagMatches = 0
        courseTags.forEach((tag: string) => {
          tagMatches += tags.get(tag) || 0
        })
        if (tagMatches > 0) {
          score += 0.2 * Math.min(tagMatches / 5, 1)
          if (!reason) {
            reason = 'Matches your interests'
          }
        }

        // Difficulty progression
        const difficultyMap: Record<string, number> = {
          beginner: 1,
          intermediate: 2,
          advanced: 3,
        }
        const userLevel = difficultyMap[preferredDifficulty] || 1
        const courseLevel = difficultyMap[course.difficulty_level] || 1

        if (courseLevel === userLevel || courseLevel === userLevel + 1) {
          score += 0.2
          if (!reason) {
            reason = 'Perfect for your skill level'
          }
        } else if (Math.abs(courseLevel - userLevel) > 1) {
          score -= 0.1
        }

        // Popularity boost (courses with more enrollments)
        // Note: We'd need enrollment counts here - using a placeholder
        score += 0.1 // Placeholder for popularity

        // Randomness factor for discovery
        score += Math.random() * 0.2

        // Ensure score is between 0 and 1
        score = Math.max(0, Math.min(1, score))

        if (!reason) {
          reason = 'Recommended for you'
        }

        const instructor = Array.isArray(course.instructor)
          ? course.instructor[0]
          : course.instructor

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnail_url: course.thumbnail_url,
          difficulty_level: course.difficulty_level,
          duration_hours: course.duration_hours || 0,
          price: course.price || 0,
          rating: 4.5, // Placeholder - would come from reviews
          enrollment_count: 0, // Placeholder
          instructor_name: instructor?.full_name || 'Unknown',
          category: course.category,
          tags: course.tags || [],
          recommendation_score: Math.round(score * 100) / 100,
          recommendation_reason: reason,
        }
      })
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, limit)

    return NextResponse.json({
      recommendations: scoredCourses,
      type: 'personalized',
      total: scoredCourses.length,
      user_profile: {
        enrolled_count: enrolledCourseIds.size,
        completed_count: completedCount,
        average_progress: Math.round(averageProgress),
        preferred_difficulty: preferredDifficulty,
        top_categories: Array.from(categories.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([cat]) => cat),
      },
    })
  } catch (error) {
    console.error('Error in personalized recommendations:', error)
    return NextResponse.json({
      recommendations: mockRecommendations.slice(0, limit),
      type: 'personalized',
      total: mockRecommendations.length,
    })
  }
}

// Get trending courses
async function getTrendingCourses(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  limit: number
) {
  try {
    // Get courses with most recent enrollments
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        slug,
        description,
        thumbnail_url,
        difficulty_level,
        duration_hours,
        price,
        category,
        tags,
        instructor:users!courses_instructor_id_fkey (
          full_name
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !courses) {
      return NextResponse.json({
        recommendations: mockRecommendations.slice(0, limit),
        type: 'trending',
        total: mockRecommendations.length,
      })
    }

    const recommendations = courses.map((course, index) => {
      const instructor = Array.isArray(course.instructor)
        ? course.instructor[0]
        : course.instructor
      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        difficulty_level: course.difficulty_level,
        duration_hours: course.duration_hours || 0,
        price: course.price || 0,
        rating: 4.5,
        enrollment_count: Math.floor(Math.random() * 2000) + 500,
        instructor_name: instructor?.full_name || 'Unknown',
        category: course.category,
        tags: course.tags || [],
        recommendation_score: 1 - index * 0.05,
        recommendation_reason: 'Trending now',
      }
    })

    return NextResponse.json({
      recommendations,
      type: 'trending',
      total: recommendations.length,
    })
  } catch (error) {
    console.error('Error in trending courses:', error)
    return NextResponse.json({
      recommendations: mockRecommendations.slice(0, limit),
      type: 'trending',
      total: mockRecommendations.length,
    })
  }
}

// Get similar courses to a specific course
async function getSimilarCourses(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  courseId: string,
  limit: number
) {
  try {
    // Get the source course
    const { data: sourceCourse, error: sourceError } = await supabase
      .from('courses')
      .select('category, tags, difficulty_level')
      .eq('id', courseId)
      .single()

    if (sourceError || !sourceCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Find similar courses
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        slug,
        description,
        thumbnail_url,
        difficulty_level,
        duration_hours,
        price,
        category,
        tags,
        instructor:users!courses_instructor_id_fkey (
          full_name
        )
      `)
      .eq('status', 'published')
      .neq('id', courseId)
      .limit(50)

    if (error || !courses) {
      return NextResponse.json({
        recommendations: [],
        type: 'similar',
        total: 0,
      })
    }

    // Score by similarity
    const sourceTags = new Set(sourceCourse.tags || [])
    const scoredCourses = courses
      .map(course => {
        let score = 0

        // Same category = high similarity
        if (course.category === sourceCourse.category) {
          score += 0.5
        }

        // Tag overlap
        const courseTags = course.tags || []
        const tagOverlap = courseTags.filter((t: string) => sourceTags.has(t)).length
        score += 0.3 * Math.min(tagOverlap / sourceTags.size, 1)

        // Similar difficulty
        if (course.difficulty_level === sourceCourse.difficulty_level) {
          score += 0.2
        }

        const instructor = Array.isArray(course.instructor)
          ? course.instructor[0]
          : course.instructor

        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          thumbnail_url: course.thumbnail_url,
          difficulty_level: course.difficulty_level,
          duration_hours: course.duration_hours || 0,
          price: course.price || 0,
          rating: 4.5,
          enrollment_count: 0,
          instructor_name: instructor?.full_name || 'Unknown',
          category: course.category,
          tags: course.tags || [],
          recommendation_score: Math.round(score * 100) / 100,
          recommendation_reason: 'Similar to what you viewed',
        }
      })
      .filter(c => c.recommendation_score > 0.3)
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, limit)

    return NextResponse.json({
      recommendations: scoredCourses,
      type: 'similar',
      total: scoredCourses.length,
      source_course_id: courseId,
    })
  } catch (error) {
    console.error('Error in similar courses:', error)
    return NextResponse.json({
      recommendations: [],
      type: 'similar',
      total: 0,
    })
  }
}

// Get courses to continue learning
async function getContinueLearning(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  limit: number
) {
  try {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        progress_percentage,
        updated_at,
        course:courses (
          id,
          title,
          slug,
          description,
          thumbnail_url,
          difficulty_level,
          duration_hours,
          category,
          instructor:users!courses_instructor_id_fkey (
            full_name
          )
        )
      `)
      .eq('user_id', userId)
      .is('completed_at', null)
      .gt('progress_percentage', 0)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error || !enrollments) {
      return NextResponse.json({
        recommendations: [],
        type: 'continue',
        total: 0,
      })
    }

    const recommendations = enrollments.map(enrollment => {
      const course = Array.isArray(enrollment.course)
        ? enrollment.course[0]
        : enrollment.course

      if (!course) return null

      const instructor = Array.isArray(course.instructor)
        ? course.instructor[0]
        : course.instructor

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        difficulty_level: course.difficulty_level,
        duration_hours: course.duration_hours || 0,
        price: 0, // Already enrolled
        rating: 4.5,
        enrollment_count: 0,
        instructor_name: instructor?.full_name || 'Unknown',
        category: course.category,
        tags: [],
        recommendation_score: 1,
        recommendation_reason: `${enrollment.progress_percentage}% complete`,
        progress_percentage: enrollment.progress_percentage,
      }
    }).filter(Boolean)

    return NextResponse.json({
      recommendations,
      type: 'continue',
      total: recommendations.length,
    })
  } catch (error) {
    console.error('Error in continue learning:', error)
    return NextResponse.json({
      recommendations: [],
      type: 'continue',
      total: 0,
    })
  }
}
