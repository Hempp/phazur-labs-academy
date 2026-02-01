#!/usr/bin/env python3
"""
Batch Video Generator for Phazur Labs Academy
Generates videos for all lessons in a course or all courses

Usage:
    python scripts/batch-custom-videos.py --course react-patterns
    python scripts/batch-custom-videos.py --all
    python scripts/batch-custom-videos.py --lessons lesson-react-1-1,lesson-react-1-2
"""

import argparse
import sys
import time
from pathlib import Path
from datetime import datetime
import subprocess

# Lesson configurations
COURSES = {
    "react-patterns": [
        "lesson-react-1-1",
        "lesson-react-1-2",
        "lesson-react-1-3",
        "lesson-react-1-4",
    ],
    "typescript-advanced": [
        "lesson-ts-1-1",
        "lesson-ts-1-2",
    ],
    "node-backend": [
        "lesson-node-1-1",
        "lesson-node-1-2",
    ]
}


class BatchVideoGenerator:
    def __init__(self, test_mode=False, dry_run=False):
        self.test_mode = test_mode
        self.dry_run = dry_run
        self.project_root = Path(__file__).parent.parent
        self.generator_script = self.project_root / "scripts" / "custom-video-generator.py"

        self.results = {
            "success": [],
            "failed": [],
            "skipped": []
        }

    def generate_lesson(self, lesson_id):
        """Generate video for a single lesson"""
        print(f"\n{'='*60}")
        print(f"📹 Processing: {lesson_id}")
        print(f"{'='*60}\n")

        if self.dry_run:
            print("   [DRY RUN] Would generate video")
            self.results["skipped"].append(lesson_id)
            return True

        # Check if video already exists
        output_file = self.project_root / "public" / "courses" / f"{lesson_id}.mp4"
        if output_file.exists():
            print(f"⚠️  Video already exists: {output_file}")
            response = input("   Regenerate? (y/n): ").strip().lower()
            if response != 'y':
                print("   Skipping...")
                self.results["skipped"].append(lesson_id)
                return True

        # Run generator
        cmd = [
            "python3",
            str(self.generator_script),
            "--lesson", lesson_id
        ]

        if self.test_mode:
            cmd.append("--test")

        try:
            start_time = time.time()
            result = subprocess.run(cmd, check=True)
            duration = time.time() - start_time

            print(f"✅ Success! ({duration:.1f}s)")
            self.results["success"].append(lesson_id)
            return True

        except subprocess.CalledProcessError as e:
            print(f"❌ Failed: {e}")
            self.results["failed"].append(lesson_id)
            return False

        except KeyboardInterrupt:
            print("\n⚠️  Cancelled by user")
            self.results["skipped"].append(lesson_id)
            raise

    def generate_course(self, course_id):
        """Generate all videos for a course"""
        if course_id not in COURSES:
            print(f"❌ Unknown course: {course_id}")
            print(f"   Available courses: {', '.join(COURSES.keys())}")
            return False

        lessons = COURSES[course_id]
        print(f"\n🎓 Generating {len(lessons)} videos for course: {course_id}")
        print(f"   Lessons: {', '.join(lessons)}")

        if not self.dry_run:
            response = input("\nContinue? (y/n): ").strip().lower()
            if response != 'y':
                print("Cancelled")
                return False

        for i, lesson_id in enumerate(lessons, 1):
            print(f"\n[{i}/{len(lessons)}] Processing {lesson_id}...")
            self.generate_lesson(lesson_id)

            # Small delay between videos to avoid overheating
            if i < len(lessons) and not self.dry_run:
                print("\n⏸  Cooling down (10s)...")
                time.sleep(10)

        return True

    def generate_all(self):
        """Generate videos for all courses"""
        total_lessons = sum(len(lessons) for lessons in COURSES.values())

        print(f"\n🚀 BATCH GENERATION - ALL COURSES")
        print(f"   Total courses: {len(COURSES)}")
        print(f"   Total lessons: {total_lessons}")
        print()

        if not self.dry_run:
            print("⚠️  This will take several hours to complete.")
            print("   Make sure your Mac is plugged in and won't sleep.")
            response = input("\nContinue? (y/n): ").strip().lower()
            if response != 'y':
                print("Cancelled")
                return False

        start_time = time.time()

        for course_id in COURSES:
            print(f"\n{'='*60}")
            print(f"🎓 COURSE: {course_id}")
            print(f"{'='*60}")
            self.generate_course(course_id)

        duration = time.time() - start_time
        self.print_summary(duration)

    def print_summary(self, duration=None):
        """Print generation summary"""
        print(f"\n{'='*60}")
        print("📊 BATCH GENERATION SUMMARY")
        print(f"{'='*60}\n")

        print(f"✅ Successful: {len(self.results['success'])}")
        for lesson in self.results['success']:
            print(f"   • {lesson}")

        if self.results['failed']:
            print(f"\n❌ Failed: {len(self.results['failed'])}")
            for lesson in self.results['failed']:
                print(f"   • {lesson}")

        if self.results['skipped']:
            print(f"\n⏭  Skipped: {len(self.results['skipped'])}")
            for lesson in self.results['skipped']:
                print(f"   • {lesson}")

        if duration:
            hours = int(duration // 3600)
            minutes = int((duration % 3600) // 60)
            print(f"\n⏱  Total time: {hours}h {minutes}m")

        print()


def main():
    parser = argparse.ArgumentParser(description="Batch generate AI instructor videos")
    parser.add_argument("--course", help="Course ID (e.g., react-patterns)")
    parser.add_argument("--all", action="store_true", help="Generate all courses")
    parser.add_argument("--lessons", help="Comma-separated lesson IDs")
    parser.add_argument("--test", action="store_true", help="Test mode (faster, lower quality)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be generated")

    args = parser.parse_args()

    if not (args.course or args.all or args.lessons):
        parser.error("Must specify --course, --all, or --lessons")

    generator = BatchVideoGenerator(test_mode=args.test, dry_run=args.dry_run)

    try:
        if args.all:
            generator.generate_all()
        elif args.course:
            generator.generate_course(args.course)
        elif args.lessons:
            lessons = [l.strip() for l in args.lessons.split(',')]
            for lesson in lessons:
                generator.generate_lesson(lesson)
            generator.print_summary()

        sys.exit(0)

    except KeyboardInterrupt:
        print("\n\n⚠️  Batch generation cancelled")
        generator.print_summary()
        sys.exit(1)

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
