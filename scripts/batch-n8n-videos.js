#!/usr/bin/env node
/**
 * Batch generate videos for all lessons using n8n workflow
 * Usage: node scripts/batch-n8n-videos.js [--parallel 3] [--course react]
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/phazur-video-webhook';
const DEFAULT_PARALLEL = 3; // Process 3 videos at a time
const DELAY_BETWEEN_BATCHES = 30000; // 30 seconds

// Parse command line args
const args = process.argv.slice(2);
const parallelCount = args.includes('--parallel')
  ? parseInt(args[args.indexOf('--parallel') + 1])
  : DEFAULT_PARALLEL;
const courseFilter = args.includes('--course')
  ? args[args.indexOf('--course') + 1]
  : null;

// Load lesson scripts
const scriptsPath = path.join(__dirname, '../temp/lesson-scripts.json');
if (!fs.existsSync(scriptsPath)) {
  console.error('❌ Error: lesson-scripts.json not found');
  console.error('   Run: node scripts/extract-lesson-scripts.mjs first');
  process.exit(1);
}

const lessonScripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));

// Instructor mapping
const courseInstructors = {
  'react': 'sarah-chen',
  'typescript': 'marcus-williams',
  'ts': 'marcus-williams',
  'fullstack': 'elena-rodriguez',
  'algorithms': 'james-park',
  'design': 'aisha-kumar',
  'security': 'alex-thompson'
};

async function generateVideo(lessonId, lessonData) {
  const coursePart = lessonId.split('-')[1];
  const instructor = courseInstructors[coursePart] || 'sarah-chen';
  const course = lessonData.course || coursePart;

  try {
    const response = await axios.post(N8N_WEBHOOK_URL, {
      lesson_id: lessonId,
      script: lessonData.script,
      instructor: instructor,
      course: course
    }, {
      timeout: 10000
    });

    return {
      lessonId,
      success: true,
      instructor,
      data: response.data
    };

  } catch (error) {
    return {
      lessonId,
      success: false,
      instructor,
      error: error.response?.data || error.message
    };
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function batchGenerateVideos() {
  console.log('🎬 Phazur Labs - Batch Video Generation via n8n\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Filter lessons
  let lessons = Object.entries(lessonScripts);

  if (courseFilter) {
    lessons = lessons.filter(([id]) => id.includes(`-${courseFilter}-`));
    console.log(`📚 Filtering by course: ${courseFilter}`);
  }

  console.log(`📊 Total lessons to generate: ${lessons.length}`);
  console.log(`⚡ Parallel processing: ${parallelCount} at a time`);
  console.log(`⏱️  Delay between batches: ${DELAY_BETWEEN_BATCHES/1000}s`);
  console.log(`🌐 Webhook URL: ${N8N_WEBHOOK_URL}\n`);

  // Group lessons into batches
  const batches = [];
  for (let i = 0; i < lessons.length; i += parallelCount) {
    batches.push(lessons.slice(i, i + parallelCount));
  }

  console.log(`📦 Total batches: ${batches.length}\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Process batches
  const results = {
    success: [],
    failed: []
  };

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];

    console.log(`\n📦 Batch ${batchIndex + 1}/${batches.length} (${batch.length} videos)\n`);

    // Process batch in parallel
    const promises = batch.map(([lessonId, lessonData]) => {
      console.log(`   ⏳ Queuing: ${lessonId} - ${lessonData.title}`);
      return generateVideo(lessonId, lessonData);
    });

    const batchResults = await Promise.all(promises);

    // Print results
    console.log('\n   Results:');
    batchResults.forEach(result => {
      if (result.success) {
        console.log(`   ✅ ${result.lessonId} - Success (${result.instructor})`);
        results.success.push(result);
      } else {
        console.log(`   ❌ ${result.lessonId} - Failed: ${result.error}`);
        results.failed.push(result);
      }
    });

    // Wait before next batch (except for last batch)
    if (batchIndex < batches.length - 1) {
      console.log(`\n   ⏸️  Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  // Final summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 BATCH GENERATION COMPLETE\n');
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📈 Success Rate: ${((results.success.length / lessons.length) * 100).toFixed(1)}%\n`);

  if (results.failed.length > 0) {
    console.log('❌ Failed Lessons:');
    results.failed.forEach(result => {
      console.log(`   • ${result.lessonId}: ${result.error}`);
    });
    console.log('');
  }

  // Instructor breakdown
  const instructorCount = {};
  results.success.forEach(result => {
    instructorCount[result.instructor] = (instructorCount[result.instructor] || 0) + 1;
  });

  console.log('👥 Videos by Instructor:');
  Object.entries(instructorCount).forEach(([instructor, count]) => {
    console.log(`   • ${instructor}: ${count} videos`);
  });

  console.log('\n⏳ Estimated completion time: 5-10 minutes per video');
  console.log(`   Total: ${(lessons.length * 7.5)} minutes (~${(lessons.length * 7.5 / 60).toFixed(1)} hours)`);

  console.log('\n💡 Next Steps:');
  console.log('   1. Monitor progress in n8n dashboard');
  console.log('   2. Check Phazur Labs admin portal for uploaded videos');
  console.log('   3. Review Google Drive for final video files');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Save results to file
  const resultsPath = path.join(__dirname, '../temp/batch-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: lessons.length,
    success: results.success.length,
    failed: results.failed.length,
    results: {
      success: results.success.map(r => ({ lessonId: r.lessonId, instructor: r.instructor })),
      failed: results.failed.map(r => ({ lessonId: r.lessonId, error: r.error }))
    }
  }, null, 2));

  console.log(`📝 Results saved to: ${resultsPath}\n`);
}

// Run
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🎬 Phazur Labs Video Generation System 🎬         ║
║                   Powered by n8n                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

batchGenerateVideos().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
