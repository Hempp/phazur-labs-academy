#!/usr/bin/env python3
"""
NEXUS-PRIME Video Generation Orchestrator
Generates all videos for Phazur Labs Academy using Google Veo

AI Implementation & Development Curriculum:
- Course 1: AI Foundations & Tool Mastery (14 lessons)
- Course 2: Building AI Agents (14 lessons)
- Course 3: MCP Development (12 lessons)
- Course 4: AI Workflow Architecture (14 lessons)
- Course 5: Training Teams on AI (12 lessons)
- Course 6: Enterprise AI Implementation (14 lessons)

Total: 80 lessons | Budget: 315 of 800 Veo credits

Usage:
    python scripts/generate-all-course-videos.py --list                    # List all courses/lessons
    python scripts/generate-all-course-videos.py --course ai-foundations   # Generate one course
    python scripts/generate-all-course-videos.py --all                     # Generate ALL videos
    python scripts/generate-all-course-videos.py --all --dry-run           # Preview without generating
"""

import os
import sys
import json
import time
import argparse
import requests
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

def log(msg: str, end: str = '\n'):
    """Print with timestamp and flush"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {msg}", end=end, flush=True)

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / 'public' / 'videos' / 'lessons'
SCRIPTS_DIR = PROJECT_ROOT / 'temp'
API_KEY = os.environ.get('GOOGLE_GEMINI_API_KEY', '')

# Import course data from curriculum module
sys.path.insert(0, str(PROJECT_ROOT / 'scripts' / 'courses'))
from ai_implementation_courses import ALL_COURSES, INSTRUCTORS, get_all_lessons, get_course_summary

# Veo model options
VEO_MODELS = {
    'fast': 'veo-3.1-fast-generate-preview',   # Preview fast (API key supported)
    'quality': 'veo-3.1-generate-preview',     # Preview quality (API key supported)
}

# ============================================================================
# INSTRUCTOR APPEARANCE PROFILES FOR VEO (NEXUS-PRIME: GENESIS Agent)
# ============================================================================

# These appearance descriptions extend the base INSTRUCTORS data for Veo prompts
INSTRUCTOR_VEO_PROFILES = {
    'james-park': {
        'appearance': 'Professional Asian male instructor with academic presence, research lab setting with AI visualizations on screens, smart casual with glasses, warm and patient demeanor',
        'voice_desc': 'Clear male voice, precise, patient teacher',
        'background': 'modern research lab with neural network visualizations',
    },
    'sarah-chen': {
        'appearance': 'Professional Asian female instructor with warm smile, innovative tech office with agent architecture diagrams, smart casual attire, enthusiastic presence',
        'voice_desc': 'Energetic female, clear articulation, warm tone',
        'background': 'cutting-edge AI development studio with code screens',
    },
    'marcus-williams': {
        'appearance': 'Professional African American male instructor with confident demeanor, modern enterprise office with system architecture on screens, business casual',
        'voice_desc': 'Deep male voice, measured pace, authoritative',
        'background': 'executive tech environment with MCP integrations displayed',
    },
    'elena-rodriguez': {
        'appearance': 'Professional Latina female instructor, energetic presence, workflow automation studio with n8n dashboards visible, modern attire',
        'voice_desc': 'Confident female, dynamic, encouraging',
        'background': 'automation command center with workflow visualizations',
    },
    'aisha-kumar': {
        'appearance': 'Professional South Asian female instructor, approachable and warm, collaborative training environment with team workshop setting, creative attire',
        'voice_desc': 'Warm female, expressive, friendly',
        'background': 'modern training facility with interactive displays',
    },
}

# ============================================================================
# COURSE DATA (Loaded from ai_implementation_courses.py)
# ============================================================================
# Courses are imported from the curriculum module. Use ALL_COURSES and INSTRUCTORS.
#
# Available courses:
#   - ai-foundations: AI Foundations & Tool Mastery (14 lessons)
#   - ai-agents: Building AI Agents (14 lessons)
#   - mcp-development: MCP Development (12 lessons)
#   - ai-workflows: AI Workflow Architecture (14 lessons)
#   - ai-training: Training Teams on AI (12 lessons)
#   - enterprise-ai: Enterprise AI Implementation (14 lessons)
#
# Total: 80 lessons | Budget: ~315 Veo credits (39% of 800)

# ============================================================================
# VIDEO PROMPT TEMPLATES (NEXUS-PRIME: GENESIS Agent)
# ============================================================================

def get_video_prompt(instructor_id: str, lesson: dict, course_title: str, module_title: str = '') -> str:
    """Generate Veo prompt for a lesson based on instructor and lesson type.

    Optimized for AI Implementation curriculum with focused, professional prompts.
    """
    instructor = INSTRUCTORS.get(instructor_id, {})
    veo_profile = INSTRUCTOR_VEO_PROFILES.get(instructor_id, {})

    instructor_name = instructor.get('name', 'Professional instructor')
    appearance = veo_profile.get('appearance', 'Professional instructor in modern tech environment')
    background = veo_profile.get('background', 'modern tech office')

    lesson_type = lesson.get('type', 'concept')
    lesson_title = lesson.get('title', '')

    # AI Implementation-specific prompt templates with Phazur Labs branding
    # Branding elements: Red (#e61919) and Yellow (#ffd000) accent colors, modern tech aesthetic
    branding = "Subtle Phazur Labs Academy branding visible - red and yellow accent colors, modern tech aesthetic"

    base_prompts = {
        'welcome': f"""{appearance} speaking directly to camera in a modern,
minimalist studio with AI visualization elements in background. {branding}.
Warm, welcoming expression and confident body language. Clean {background} with soft gradient lighting.
The instructor gestures naturally while introducing an exciting AI learning journey.
Cinematic quality, 16:9 aspect ratio, professional education video style.
Topic: {lesson_title} - Introduction to {course_title}""",

        'concept': f"""{appearance} in an elegant AI teaching environment
explaining core concepts. {branding}. Standing beside a large modern display showing AI architecture
diagrams and neural network visualizations. The instructor uses natural hand gestures
to explain relationships between AI concepts. Clean aesthetic with professional studio lighting.
{background} visible in background.
Topic: {lesson_title} - Core AI concepts in {course_title}""",

        'advanced': f"""{appearance} in a high-tech AI development environment
demonstrating advanced techniques. {branding}. Interacting with holographic-style code displays,
agent architectures, and data flow visualizations. Dynamic but controlled camera movement.
Futuristic yet approachable aesthetic with red and yellow AI-themed accents.
The instructor shows deep AI expertise while remaining accessible.
Topic: {lesson_title} - Advanced AI techniques in {course_title}""",

        'practical': f"""{appearance} in a hands-on AI workshop setting
demonstrating practical implementation. {branding}. Multiple screens visible showing code, API responses,
and AI tool interfaces. The instructor actively demonstrates building AI systems.
Warm, productive atmosphere with natural lighting. {background} setting.
Cinematic 16:9 quality, professional education video.
Topic: {lesson_title} - Hands-on AI implementation in {course_title}""",
    }

    return base_prompts.get(lesson_type, base_prompts['concept'])

# ============================================================================
# VEO API INTEGRATION (NEXUS-PRIME: QUANTUM-DEV Agent)
# ============================================================================

def load_api_key():
    """Load API key from environment or .env.local"""
    global API_KEY
    if not API_KEY:
        env_file = PROJECT_ROOT / '.env.local'
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                if line.startswith('GOOGLE_GEMINI_API_KEY='):
                    API_KEY = line.split('=', 1)[1].strip()
                    break
    return API_KEY

def generate_video(prompt: str, model: str = 'fast') -> dict:
    """Generate video using Veo API"""
    api_key = load_api_key()
    if not api_key:
        raise ValueError("GOOGLE_GEMINI_API_KEY not configured")

    model_id = VEO_MODELS.get(model, model)

    log(f"  Generating with {model_id}...")
    log(f"  Prompt: {prompt[:100]}...")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:predictLongRunning"

    response = requests.post(
        url,
        headers={
            'x-goog-api-key': api_key,
            'Content-Type': 'application/json'
        },
        json={
            'instances': [{
                'prompt': prompt
            }]
        }
    )

    if response.status_code != 200:
        error = response.text
        raise Exception(f"Veo API error ({response.status_code}): {error}")

    result = response.json()
    operation_name = result.get('name')

    if not operation_name:
        raise Exception(f"No operation name in response: {result}")

    log(f"  Operation: {operation_name}")
    return wait_for_video(operation_name, api_key)

def wait_for_video(operation_name: str, api_key: str, timeout: int = 600) -> dict:
    """Poll for video generation completion"""
    start = time.time()

    while time.time() - start < timeout:
        url = f"https://generativelanguage.googleapis.com/v1beta/{operation_name}"
        response = requests.get(url, headers={'x-goog-api-key': api_key})

        if response.status_code != 200:
            log(f"  Warning: Poll error {response.status_code}")
            time.sleep(10)
            continue

        result = response.json()

        if result.get('done'):
            if 'error' in result:
                raise Exception(f"Generation failed: {result['error']}")

            gen_response = result.get('response', {}).get('generateVideoResponse', {})
            samples = gen_response.get('generatedSamples', [])
            if samples:
                video_uri = samples[0].get('video', {}).get('uri')
                if video_uri:
                    log("  Video generated!")
                    return {'videoUrl': video_uri, 'result': result, 'apiKey': api_key}

            raise Exception(f"No video URI in result: {result}")

        elapsed = int(time.time() - start)
        print(f"\r  Processing... ({elapsed}s elapsed)", end='', flush=True)
        time.sleep(5)

    raise Exception("Video generation timed out")

def download_video(video_url: str, output_path: Path, api_key: str = None) -> bool:
    """Download video to local file"""
    log(f"  Downloading to {output_path.name}...")

    headers = {}
    if api_key:
        headers['x-goog-api-key'] = api_key

    response = requests.get(video_url, headers=headers, stream=True)
    if response.status_code != 200:
        log(f"  Download failed: {response.status_code}")
        return False

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    size_mb = output_path.stat().st_size / (1024 * 1024)
    log(f"  Saved: {output_path} ({size_mb:.1f} MB)")
    return True

# ============================================================================
# BATCH GENERATION (NEXUS-PRIME: CONDUCTOR Agent)
# ============================================================================

def get_course_by_slug(slug: str):
    """Find course by slug/id"""
    for course in ALL_COURSES:
        if course['id'] == slug or course['slug'] == slug:
            return course
    return None

def list_all_courses():
    """List all courses and lessons from AI Implementation curriculum"""
    summary = get_course_summary()

    log("=" * 70)
    log("PHAZUR LABS ACADEMY - AI Implementation Curriculum")
    log("=" * 70)
    log(f"Total: {summary['courses']} courses | {summary['lessons']} lessons | {summary['total_hours']} hours")
    log(f"Veo Budget: ~315 credits (39% of 800)")
    log("=" * 70)

    for course in ALL_COURSES:
        instructor = INSTRUCTORS.get(course['instructor_id'], {})
        lesson_count = sum(len(m['lessons']) for m in course['modules'])

        log(f"\n{course['title']}")
        log(f"  ID: {course['id']}")
        log(f"  Instructor: {instructor.get('name', 'Unknown')}")
        log(f"  Level: {course.get('level', 'intermediate')}")
        log(f"  Modules: {len(course['modules'])} | Lessons: {lesson_count}")

        for i, module in enumerate(course['modules'], 1):
            log(f"    {i}. {module['title']} ({len(module['lessons'])} lessons)")

    log("\n" + "=" * 70)
    log("SUMMARY")
    log("=" * 70)
    log(f"Courses: {summary['courses']}")
    log(f"Modules: {summary['modules']}")
    log(f"Lessons: {summary['lessons']}")
    log(f"Duration: {summary['total_hours']} hours ({summary['total_minutes']} min)")
    log("=" * 70)

def generate_course_videos(course_slug: str, model: str = 'fast', dry_run: bool = False):
    """Generate all videos for a single course"""
    course = get_course_by_slug(course_slug)

    if not course:
        log(f"Course not found: {course_slug}")
        log("Available courses:")
        for c in ALL_COURSES:
            log(f"  - {c['id']}: {c['title']}")
        return

    instructor = INSTRUCTORS.get(course['instructor_id'], {})
    instructor_name = instructor.get('name', 'Unknown')

    log(f"\n{'=' * 70}")
    log(f"Generating videos for: {course['title']}")
    log(f"Instructor: {instructor_name}")
    log(f"Level: {course.get('level', 'intermediate')}")
    log(f"{'=' * 70}")

    generated = 0
    failed = 0
    skipped = 0

    for module in course['modules']:
        log(f"\nModule: {module['title']}")

        for lesson in module['lessons']:
            lesson_id = lesson['id']
            output_path = OUTPUT_DIR / f"lesson-{lesson_id}-veo.mp4"

            # Check if video already exists
            if output_path.exists():
                log(f"  [SKIP] {lesson['title']} - already exists")
                skipped += 1
                continue

            log(f"\n  Generating: {lesson['title']}")

            if dry_run:
                prompt = get_video_prompt(course['instructor_id'], lesson, course['title'], module['title'])
                log(f"  [DRY RUN] Would generate with prompt:")
                log(f"    {prompt[:200]}...")
                continue

            try:
                prompt = get_video_prompt(course['instructor_id'], lesson, course['title'], module['title'])
                result = generate_video(prompt, model=model)

                if download_video(result['videoUrl'], output_path, result.get('apiKey')):
                    generated += 1
                    log(f"  [SUCCESS] {lesson['title']}")
                else:
                    failed += 1
                    log(f"  [FAILED] Download failed for {lesson['title']}")

            except Exception as e:
                failed += 1
                log(f"  [ERROR] {lesson['title']}: {e}")

            # Rate limiting - wait between videos
            time.sleep(2)

    log(f"\n{'=' * 70}")
    log(f"Course Complete: {course['title']}")
    log(f"Generated: {generated} | Failed: {failed} | Skipped: {skipped}")
    log(f"{'=' * 70}")

def generate_all_videos(model: str = 'fast', batch_size: int = 10, dry_run: bool = False, daily_limit: int = 0):
    """Generate videos for ALL courses in AI Implementation curriculum

    Args:
        model: Veo model to use ('fast' or 'quality')
        batch_size: Not used currently
        dry_run: If True, only show what would be generated
        daily_limit: Max videos to generate (0 = unlimited)
    """
    summary = get_course_summary()

    log("=" * 70)
    log("NEXUS-PRIME: GENERATING AI IMPLEMENTATION VIDEOS")
    log("=" * 70)
    log(f"Curriculum: {summary['courses']} courses | {summary['lessons']} lessons")
    log(f"Model: {model}")
    log(f"Daily Limit: {daily_limit if daily_limit > 0 else 'unlimited'}")
    log(f"Dry Run: {dry_run}")
    log("=" * 70)

    total_generated = 0
    total_skipped = 0
    total_failed = 0

    for course in ALL_COURSES:
        if daily_limit > 0 and total_generated >= daily_limit:
            log(f"\n[DAILY LIMIT] Reached {daily_limit} videos. Stopping for today.")
            break

        result = generate_course_videos_with_limit(
            course['id'],
            model=model,
            dry_run=dry_run,
            remaining_limit=daily_limit - total_generated if daily_limit > 0 else 0
        )

        total_generated += result.get('generated', 0)
        total_skipped += result.get('skipped', 0)
        total_failed += result.get('failed', 0)

        if daily_limit > 0 and total_generated >= daily_limit:
            break

    log("\n" + "=" * 70)
    log("SESSION COMPLETE")
    log("=" * 70)
    log(f"Generated: {total_generated}")
    log(f"Skipped (already exist): {total_skipped}")
    log(f"Failed: {total_failed}")
    log(f"Remaining: {summary['lessons'] - total_generated - total_skipped}")
    log("=" * 70)

    if daily_limit > 0 and total_generated >= daily_limit:
        log(f"\nRun again tomorrow to generate the next {daily_limit} videos!")


def generate_course_videos_with_limit(course_slug: str, model: str = 'fast', dry_run: bool = False, remaining_limit: int = 0):
    """Generate videos for a course with optional limit"""
    course = get_course_by_slug(course_slug)

    if not course:
        return {'generated': 0, 'skipped': 0, 'failed': 0}

    instructor = INSTRUCTORS.get(course['instructor_id'], {})
    instructor_name = instructor.get('name', 'Unknown')

    log(f"\n{'─' * 50}")
    log(f"Course: {course['title']}")
    log(f"Instructor: {instructor_name}")
    log(f"{'─' * 50}")

    generated = 0
    failed = 0
    skipped = 0

    for module in course['modules']:
        if remaining_limit > 0 and generated >= remaining_limit:
            break

        for lesson in module['lessons']:
            if remaining_limit > 0 and generated >= remaining_limit:
                log(f"\n[LIMIT REACHED] Stopping at {generated} videos")
                break

            lesson_id = lesson['id']
            output_path = OUTPUT_DIR / f"lesson-{lesson_id}-veo.mp4"

            # Check if video already exists
            if output_path.exists():
                skipped += 1
                continue

            log(f"\n  [{generated + 1}] {lesson['title']}")

            if dry_run:
                prompt = get_video_prompt(course['instructor_id'], lesson, course['title'], module['title'])
                log(f"      [DRY RUN] Would generate")
                generated += 1
                continue

            try:
                prompt = get_video_prompt(course['instructor_id'], lesson, course['title'], module['title'])
                result = generate_video(prompt, model=model)

                if download_video(result['videoUrl'], output_path, result.get('apiKey')):
                    generated += 1
                    log(f"      [SUCCESS] Saved to {output_path.name}")
                else:
                    failed += 1
                    log(f"      [FAILED] Download failed")

            except Exception as e:
                failed += 1
                error_msg = str(e)
                if "429" in error_msg or "quota" in error_msg.lower():
                    log(f"      [QUOTA EXHAUSTED] Daily limit reached")
                    return {'generated': generated, 'skipped': skipped, 'failed': failed}
                else:
                    log(f"      [ERROR] {e}")

            # Rate limiting
            time.sleep(2)

    return {'generated': generated, 'skipped': skipped, 'failed': failed}

def save_all_lesson_scripts():
    """Export all lesson scripts to JSON for reference and database seeding"""
    all_scripts = []
    summary = get_course_summary()

    for course in ALL_COURSES:
        instructor = INSTRUCTORS.get(course['instructor_id'], {})

        for module in course['modules']:
            for lesson in module['lessons']:
                script_data = {
                    'lessonId': lesson['id'],
                    'title': lesson['title'],
                    'courseId': course['id'],
                    'courseSlug': course['slug'],
                    'courseTitle': course['title'],
                    'moduleId': module['id'],
                    'moduleTitle': module['title'],
                    'instructorId': course['instructor_id'],
                    'instructorName': instructor.get('name', 'Unknown'),
                    'lessonType': lesson.get('type', 'concept'),
                    'duration': lesson.get('duration', 6),
                    'veoPrompt': get_video_prompt(
                        course['instructor_id'],
                        lesson,
                        course['title'],
                        module['title']
                    ),
                }
                all_scripts.append(script_data)

    # Save to temp directory
    scripts_file = SCRIPTS_DIR / 'ai-implementation-lessons.json'
    scripts_file.parent.mkdir(parents=True, exist_ok=True)

    with open(scripts_file, 'w') as f:
        json.dump({
            'summary': summary,
            'lessons': all_scripts,
            'generated_at': datetime.now().isoformat(),
        }, f, indent=2)

    log(f"Saved {len(all_scripts)} AI Implementation lesson scripts to {scripts_file}")

    # Also save a simplified Veo prompts file
    prompts_file = SCRIPTS_DIR / 'veo-prompts.json'
    prompts = [{
        'id': s['lessonId'],
        'title': s['title'],
        'prompt': s['veoPrompt'],
    } for s in all_scripts]

    with open(prompts_file, 'w') as f:
        json.dump(prompts, f, indent=2)

    log(f"Saved {len(prompts)} Veo prompts to {prompts_file}")

    return all_scripts

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='NEXUS-PRIME Video Generator for Phazur Labs Academy')
    parser.add_argument('--list', action='store_true', help='List all courses and lessons')
    parser.add_argument('--course', type=str, help='Generate videos for specific course')
    parser.add_argument('--all', action='store_true', help='Generate ALL videos for ALL courses')
    parser.add_argument('--export-scripts', action='store_true', help='Export all lesson scripts to JSON')
    parser.add_argument('--model', default='fast', choices=['fast', 'quality'], help='Veo model quality')
    parser.add_argument('--daily-limit', type=int, default=10, help='Max videos per day (default: 10)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be generated without actually generating')

    args = parser.parse_args()

    if args.list:
        list_all_courses()
        return

    if args.export_scripts:
        save_all_lesson_scripts()
        return

    if args.course:
        generate_course_videos(args.course, model=args.model, dry_run=args.dry_run)
        return

    if args.all:
        generate_all_videos(model=args.model, dry_run=args.dry_run, daily_limit=args.daily_limit)
        return

    parser.print_help()
    print("\n" + "=" * 60)
    print("AI IMPLEMENTATION CURRICULUM - Video Generator")
    print("=" * 60)
    print("\nAvailable Courses:")
    print("  ai-foundations   - AI Foundations & Tool Mastery (14 lessons)")
    print("  ai-agents        - Building AI Agents (14 lessons)")
    print("  mcp-development  - MCP Development (12 lessons)")
    print("  ai-workflows     - AI Workflow Architecture (14 lessons)")
    print("  ai-training      - Training Teams on AI (12 lessons)")
    print("  enterprise-ai    - Enterprise AI Implementation (14 lessons)")
    print("\nDaily Generation (10 videos/day):")
    print("  python scripts/generate-all-course-videos.py --all")
    print("  python scripts/generate-all-course-videos.py --all --daily-limit 10")
    print("\nOther Examples:")
    print("  python scripts/generate-all-course-videos.py --list")
    print("  python scripts/generate-all-course-videos.py --all --dry-run")
    print("  python scripts/generate-all-course-videos.py --all --daily-limit 0  # unlimited")

if __name__ == '__main__':
    main()
