#!/usr/bin/env node
/**
 * Trigger n8n video generation for a single lesson
 * Usage: node scripts/trigger-n8n-video.js <lesson-id>
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/phazur-video-webhook';

// Load lesson scripts
const scriptsPath = path.join(__dirname, '../temp/lesson-scripts.json');
if (!fs.existsSync(scriptsPath)) {
  console.error('❌ Error: lesson-scripts.json not found');
  console.error('   Run: node scripts/extract-lesson-scripts.mjs first');
  process.exit(1);
}

const lessonScripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));

// Instructor mapping by course
const courseInstructors = {
  'react': 'sarah-chen',
  'typescript': 'marcus-williams',
  'ts': 'marcus-williams',
  'fullstack': 'elena-rodriguez',
  'algorithms': 'james-park',
  'design': 'aisha-kumar',
  'security': 'alex-thompson'
};

async function generateVideo(lessonId) {
  console.log(`\n🎬 Generating video for: ${lessonId}\n`);

  // Get lesson data
  const lessonData = lessonScripts[lessonId];
  if (!lessonData) {
    console.error(`❌ Lesson not found: ${lessonId}`);
    console.log('\nAvailable lessons:');
    Object.keys(lessonScripts).forEach(id => {
      console.log(`  • ${id}: ${lessonScripts[id].title}`);
    });
    process.exit(1);
  }

  // Detect course from lesson ID
  const coursePart = lessonId.split('-')[1]; // e.g., "react" from "lesson-react-1-1"
  const instructor = courseInstructors[coursePart] || 'sarah-chen';
  const course = lessonData.course || coursePart;

  console.log(`📝 Lesson: ${lessonData.title}`);
  console.log(`📚 Course: ${course}`);
  console.log(`👤 Instructor: ${instructor}`);
  console.log(`📄 Script length: ${lessonData.script.length} characters`);
  console.log(`⏱️  Duration: ${lessonData.duration}`);
  console.log(`\n🚀 Sending to n8n workflow...`);

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, {
      lesson_id: lessonId,
      script: lessonData.script,
      instructor: instructor,
      course: course
    }, {
      timeout: 10000 // 10 second timeout for webhook response
    });

    console.log('\n✅ Video generation started successfully!');
    console.log('\nResponse:');
    console.log(JSON.stringify(response.data, null, 2));

    console.log('\n📊 Workflow Status:');
    console.log('  • Voice generation: In progress...');
    console.log('  • Video generation: Queued...');
    console.log('  • Upload to admin: Pending...');

    console.log('\n⏳ Estimated completion: 5-10 minutes');
    console.log('💡 Check n8n dashboard for progress');

    return response.data;

  } catch (error) {
    console.error('\n❌ Error triggering video generation:');

    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data);
    } else if (error.request) {
      console.error('   No response from n8n webhook');
      console.error('   Check that workflow is active and webhook URL is correct');
    } else {
      console.error('   ', error.message);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Verify n8n workflow is active');
    console.log('  2. Check webhook URL in .env file');
    console.log('  3. Test webhook with curl:');
    console.log(`     curl -X POST ${N8N_WEBHOOK_URL} \\`);
    console.log(`       -H "Content-Type: application/json" \\`);
    console.log(`       -d '{"lesson_id":"test","script":"test","instructor":"sarah-chen","course":"test"}'`);

    process.exit(1);
  }
}

// Main
const lessonId = process.argv[2];

if (!lessonId) {
  console.log('Usage: node scripts/trigger-n8n-video.js <lesson-id>');
  console.log('\nAvailable lessons:');
  Object.entries(lessonScripts).forEach(([id, data]) => {
    console.log(`  • ${id}: ${data.title}`);
  });
  process.exit(0);
}

generateVideo(lessonId);
