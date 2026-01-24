-- ============================================================================
-- Seed Assignment Data
-- Run this AFTER the assignments migration and course/lesson data exists
-- ============================================================================

-- First, create a test course if it doesn't exist (for development)
-- In production, courses should already exist

DO $$
DECLARE
  v_course_id UUID;
  v_lesson_id UUID;
  v_instructor_id UUID;
  v_student_id UUID;
  v_enrollment_id UUID;
BEGIN
  -- Get or create a test instructor
  SELECT id INTO v_instructor_id FROM users WHERE email = 'instructor@phazurlabs.com' LIMIT 1;

  IF v_instructor_id IS NULL THEN
    INSERT INTO users (email, full_name, role)
    VALUES ('instructor@phazurlabs.com', 'Sarah Johnson', 'instructor')
    RETURNING id INTO v_instructor_id;
  END IF;

  -- Get or create a test student
  SELECT id INTO v_student_id FROM users WHERE email = 'student@phazurlabs.com' LIMIT 1;

  IF v_student_id IS NULL THEN
    INSERT INTO users (email, full_name, role)
    VALUES ('student@phazurlabs.com', 'Test Student', 'student')
    RETURNING id INTO v_student_id;
  END IF;

  -- Get or create a test course
  SELECT id INTO v_course_id FROM courses WHERE slug = 'advanced-react-patterns' LIMIT 1;

  IF v_course_id IS NULL THEN
    INSERT INTO courses (
      slug, title, description, instructor_id, price, level,
      category, status, is_published
    )
    VALUES (
      'advanced-react-patterns',
      'Advanced React Patterns',
      'Master advanced React patterns including compound components, render props, and more.',
      v_instructor_id,
      49.99,
      'advanced',
      'Web Development',
      'published',
      true
    )
    RETURNING id INTO v_course_id;

    -- Create a module
    INSERT INTO modules (course_id, title, description, display_order)
    VALUES (v_course_id, 'Compound Components', 'Learn the compound components pattern', 1);

    -- Create a lesson for the assignment
    INSERT INTO lessons (course_id, module_id, title, type, display_order)
    SELECT v_course_id, m.id, 'Assignment: Build a Menu Component', 'assignment', 4
    FROM modules m WHERE m.course_id = v_course_id LIMIT 1
    RETURNING id INTO v_lesson_id;
  ELSE
    -- Get existing lesson
    SELECT l.id INTO v_lesson_id
    FROM lessons l
    WHERE l.course_id = v_course_id AND l.type = 'assignment'
    LIMIT 1;
  END IF;

  -- Create enrollment for test student
  SELECT id INTO v_enrollment_id FROM enrollments
  WHERE user_id = v_student_id AND course_id = v_course_id LIMIT 1;

  IF v_enrollment_id IS NULL THEN
    INSERT INTO enrollments (user_id, course_id, status)
    VALUES (v_student_id, v_course_id, 'active')
    RETURNING id INTO v_enrollment_id;
  END IF;

  -- Insert assignment if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM assignments WHERE course_id = v_course_id AND title = 'Build a Menu Component') THEN
    INSERT INTO assignments (
      lesson_id,
      course_id,
      title,
      description,
      instructions,
      due_days_after_enrollment,
      max_score,
      submission_types,
      allowed_file_types,
      max_file_size_mb,
      rubric,
      resources,
      is_required,
      display_order
    ) VALUES (
      v_lesson_id,
      v_course_id,
      'Build a Menu Component',
      'Create a flexible dropdown menu using the compound components pattern',
      E'## Objective\nCreate a reusable Menu component using the Compound Components pattern learned in this section.\n\n## Requirements\n\n### Component Structure\nYour implementation should include:\n- `Menu` - The root component that manages state\n- `Menu.Button` - The trigger button\n- `Menu.Items` - Container for menu items\n- `Menu.Item` - Individual clickable item\n\n### Functionality\n1. **Toggle Behavior**: The menu should open/close when the button is clicked\n2. **Click Outside**: Close the menu when clicking outside\n3. **Keyboard Support**:\n   - `Escape` closes the menu\n   - `Enter` or `Space` on an item selects it\n   - `Arrow Down/Up` navigates between items\n4. **Accessibility**:\n   - Proper ARIA attributes (`aria-expanded`, `aria-haspopup`, etc.)\n   - Focus management\n\n## Bonus Points\n- Add animation for open/close transitions\n- Support different positioning (top, bottom, left, right)\n- Implement nested menus (sub-menus)\n\n## Submission Guidelines\n1. Create a GitHub repository or CodeSandbox\n2. Include a README with setup instructions\n3. Provide example usage in your submission\n4. Submit the link below',
      7,
      100,
      ARRAY['url', 'file']::submission_type[],
      ARRAY['.zip', '.tsx', '.jsx'],
      10,
      '[
        {"id": "rubric-menu-1", "criteria": "Component Architecture", "description": "Proper compound component structure with Context", "max_points": 25},
        {"id": "rubric-menu-2", "criteria": "Core Functionality", "description": "Toggle, click outside, keyboard navigation work correctly", "max_points": 30},
        {"id": "rubric-menu-3", "criteria": "Accessibility", "description": "Proper ARIA attributes and focus management", "max_points": 25},
        {"id": "rubric-menu-4", "criteria": "Code Quality", "description": "Clean, typed, well-organized code", "max_points": 20}
      ]'::jsonb,
      '[
        {"id": "res-menu-1", "title": "Starter Template", "type": "template", "url": "/resources/assignments/menu-starter.zip"},
        {"id": "res-menu-2", "title": "WAI-ARIA Menu Pattern", "type": "link", "url": "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"}
      ]'::jsonb,
      true,
      1
    );
  END IF;

  -- Insert a second assignment (Render Props)
  IF NOT EXISTS (SELECT 1 FROM assignments WHERE course_id = v_course_id AND title = 'Build a Reusable Fetch Component') THEN
    INSERT INTO assignments (
      course_id,
      title,
      description,
      instructions,
      due_days_after_enrollment,
      max_score,
      submission_types,
      rubric,
      is_required,
      display_order
    ) VALUES (
      v_course_id,
      'Build a Reusable Fetch Component',
      'Create a data fetching component using the render props pattern',
      E'## Objective\nBuild a reusable `Fetch` component that handles data fetching and exposes loading, error, and data states to its children via render props.\n\n## Requirements\n\n### Component Props\n```tsx\ninterface FetchProps<T> {\n  url: string\n  options?: RequestInit\n  children: (state: FetchState<T>) => React.ReactNode\n}\n\ninterface FetchState<T> {\n  data: T | null\n  loading: boolean\n  error: Error | null\n  refetch: () => void\n}\n```\n\n### Features\n1. **Loading State**: Show loading state while fetching\n2. **Error Handling**: Properly handle and expose errors\n3. **Data Typing**: Support generic types for response data\n4. **Refetch**: Provide a refetch function\n5. **Abort**: Cancel requests on unmount or URL change\n\n## Bonus Points\n- Add caching support\n- Implement polling/interval refetch\n- Add retry logic for failed requests\n\n## Submission\nSubmit a GitHub repository link with your implementation.',
      5,
      100,
      ARRAY['url']::submission_type[],
      '[
        {"id": "rubric-fetch-1", "criteria": "Render Props Implementation", "description": "Correct render props pattern usage", "max_points": 25},
        {"id": "rubric-fetch-2", "criteria": "State Management", "description": "Proper handling of loading, error, data states", "max_points": 30},
        {"id": "rubric-fetch-3", "criteria": "TypeScript Usage", "description": "Proper generics and type safety", "max_points": 25},
        {"id": "rubric-fetch-4", "criteria": "Edge Cases", "description": "Abort, cleanup, error handling", "max_points": 20}
      ]'::jsonb,
      true,
      2
    );
  END IF;

  RAISE NOTICE 'Seed data created successfully!';
  RAISE NOTICE 'Course ID: %', v_course_id;
  RAISE NOTICE 'Instructor ID: %', v_instructor_id;
  RAISE NOTICE 'Student ID: %', v_student_id;
  RAISE NOTICE 'Enrollment ID: %', v_enrollment_id;
END $$;

-- Verify the data was inserted
SELECT
  a.id,
  a.title,
  a.max_score,
  a.submission_types,
  c.title as course_title
FROM assignments a
JOIN courses c ON c.id = a.course_id;
