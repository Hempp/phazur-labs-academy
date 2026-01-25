import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.log('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function createTestAdmin() {
  const email = 'testadmin@phazurlabs.test'
  const password = 'TestAdmin123!'

  try {
    // Create user with admin API
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (signUpError) {
      console.log('Signup error:', signUpError.message)

      // If user exists, try to get them and update role
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users?.users?.find(u => u.email === email)

      if (existingUser) {
        console.log('User already exists:', existingUser.id)
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', existingUser.id)

        console.log('Role update:', updateError ? updateError.message : 'Success')
      }
      return
    }

    console.log('User created:', authData.user?.id)

    // Set admin role in users table
    if (authData.user) {
      // Wait a moment for the trigger to create the user record
      await new Promise(resolve => setTimeout(resolve, 1000))

      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (updateError) {
        console.log('Role update error:', updateError.message)
      } else {
        console.log('Admin role set successfully!')
        console.log('\nTest Admin Credentials:')
        console.log('Email:', email)
        console.log('Password:', password)
      }
    }
  } catch (err) {
    console.log('Error:', err)
  }
}

createTestAdmin()
