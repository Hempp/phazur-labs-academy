#!/usr/bin/env npx tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('Checking database...\n')

  // Check all users
  const { data: users } = await supabase
    .from('users')
    .select('id, email, full_name, role')
    .limit(10)

  console.log('All users:', users?.length || 0)
  if (users && users.length > 0) {
    users.forEach(u => {
      console.log('  -', u.full_name || 'No name', '|', u.role, '|', u.id)
    })
  }

  // Check courses with instructor info
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, instructor_id')

  console.log('\nExisting courses:', courses?.length || 0)
  if (courses && courses.length > 0) {
    courses.forEach(c => {
      console.log('  -', c.title)
      console.log('    instructor_id:', c.instructor_id || 'NULL')
    })
  }
}

main()
