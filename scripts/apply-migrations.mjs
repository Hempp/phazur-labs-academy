/**
 * Phazur Labs Academy - Apply Migrations
 * DATA-FORGE Agent - Database Architect
 *
 * Run with: node scripts/apply-migrations.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env manually
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

console.log('\n🏗️  NEXUS-PRIME | DATA-FORGE Agent');
console.log('━'.repeat(60));
console.log(`📊 Target: ${supabaseUrl}`);
console.log('');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Check if tables already exist
async function checkTables() {
  console.log('🔍 Checking existing tables...\n');

  const tables = ['users', 'courses', 'lessons', 'video_generations'];
  const results = {};

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    results[table] = error?.code !== 'PGRST205';
    console.log(`   ${results[table] ? '✅' : '❌'} ${table}`);
  }

  return results;
}

// Check storage buckets
async function checkBuckets() {
  console.log('\n📦 Checking storage buckets...\n');

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.log('   ⚠️  Could not list buckets');
    return {};
  }

  const bucketNames = buckets.map(b => b.name);
  const required = ['course-videos', 'video-thumbnails'];

  for (const bucket of required) {
    const exists = bucketNames.includes(bucket);
    console.log(`   ${exists ? '✅' : '❌'} ${bucket}`);
  }

  return bucketNames;
}

// Create storage buckets if they don't exist
async function createBuckets(existingBuckets) {
  console.log('\n📦 Creating missing storage buckets...\n');

  const bucketsToCreate = [
    { name: 'course-videos', public: true, fileSizeLimit: 524288000 }, // 500MB
    { name: 'video-thumbnails', public: true, fileSizeLimit: 5242880 }, // 5MB
  ];

  for (const bucket of bucketsToCreate) {
    if (!existingBuckets.includes(bucket.name)) {
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit
      });

      if (error && !error.message.includes('already exists')) {
        console.log(`   ❌ ${bucket.name}: ${error.message}`);
      } else {
        console.log(`   ✅ ${bucket.name} created`);
      }
    } else {
      console.log(`   ⏭️  ${bucket.name} already exists`);
    }
  }
}

async function main() {
  const tables = await checkTables();
  const buckets = await checkBuckets();

  // Create buckets if needed
  await createBuckets(buckets);

  const anyTableMissing = Object.values(tables).some(exists => !exists);

  if (anyTableMissing) {
    console.log('\n━'.repeat(60));
    console.log('\n⚠️  Some database tables are missing!');
    console.log('\n📝 To apply migrations, please:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/cpwowfcqkltnjcixmaaf/sql/new');
    console.log('   2. Copy and paste the contents of each migration file');
    console.log('   3. Run them in order:\n');

    const migrationsDir = resolve(__dirname, '..', 'supabase/migrations');
    const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      console.log(`      • ${file}`);
    }

    console.log('\n   Or use Supabase CLI with access token:');
    console.log('   $ supabase login');
    console.log('   $ supabase link --project-ref cpwowfcqkltnjcixmaaf');
    console.log('   $ supabase db push');
  } else {
    console.log('\n━'.repeat(60));
    console.log('\n✅ All required tables exist!');
  }

  console.log('\n🎯 DATA-FORGE: Check complete\n');
}

main().catch(console.error);
