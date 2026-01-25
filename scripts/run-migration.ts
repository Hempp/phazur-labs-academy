import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('Running migration: add view_count to discussions...')
  
  // Check if column exists
  const { data: columns, error: checkError } = await supabase
    .rpc('get_column_info', { 
      table_name: 'discussions',
      column_name: 'view_count'
    })
    .maybeSingle()

  if (checkError && !checkError.message.includes('does not exist')) {
    console.log('Could not check column, attempting to add...')
  }

  // Try to add the column using raw SQL via RPC
  // Since we can't run raw SQL, let's try a different approach
  // We'll just test if the column exists by selecting it
  const { data, error } = await supabase
    .from('discussions')
    .select('view_count')
    .limit(1)

  if (error && error.message.includes('view_count')) {
    console.log('Column view_count does not exist.')
    console.log('Please run the following SQL in your Supabase dashboard:')
    console.log('ALTER TABLE discussions ADD COLUMN view_count INTEGER DEFAULT 0;')
  } else if (error) {
    console.error('Error checking column:', error.message)
  } else {
    console.log('Column view_count already exists!')
  }
}

runMigration()
