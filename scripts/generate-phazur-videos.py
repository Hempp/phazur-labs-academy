#!/usr/bin/env python3
"""
Phazur Labs Academy - Production Video Generator
Uses actual course content from course-content.ts via extracted scripts

Usage:
    python scripts/generate-phazur-videos.py --extract  # Extract scripts first
    python scripts/generate-phazur-videos.py --lesson lesson-react-1-1
    python scripts/generate-phazur-videos.py --course react-patterns
    python scripts/generate-phazur-videos.py --all
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

class PhazurVideoGenerator:
    def __init__(self, test_mode=False):
        self.test_mode = test_mode
        self.project_root = Path(__file__).parent.parent
        self.scripts_file = self.project_root / "temp" / "lesson-scripts.json"
        self.generator = self.project_root / "scripts" / "custom-video-generator.py"

        self.lesson_scripts = {}

    def extract_scripts(self):
        """Extract lesson scripts from TypeScript course content"""
        print("📚 Extracting lesson scripts from course content...")

        extract_script = self.project_root / "scripts" / "extract-lesson-scripts.ts"

        try:
            # Run TypeScript extraction
            result = subprocess.run(
                ["npx", "tsx", str(extract_script)],
                cwd=str(self.project_root),
                capture_output=True,
                text=True,
                check=True
            )

            print("✅ Scripts extracted successfully!")
            return True

        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to extract scripts: {e}")
            print(f"   stdout: {e.stdout}")
            print(f"   stderr: {e.stderr}")
            return False

    def load_scripts(self):
        """Load extracted lesson scripts"""
        if not self.scripts_file.exists():
            print(f"❌ Scripts file not found: {self.scripts_file}")
            print("   Run: python scripts/generate-phazur-videos.py --extract")
            return False

        try:
            with open(self.scripts_file, 'r') as f:
                scripts = json.load(f)

            # Index by lesson ID
            for script_data in scripts:
                self.lesson_scripts[script_data['lessonId']] = script_data

            print(f"✅ Loaded {len(self.lesson_scripts)} lesson scripts")
            return True

        except Exception as e:
            print(f"❌ Failed to load scripts: {e}")
            return False

    def generate_video(self, lesson_id):
        """Generate video for a specific lesson"""
        if lesson_id not in self.lesson_scripts:
            print(f"❌ No script found for lesson: {lesson_id}")
            print(f"   Available lessons: {', '.join(list(self.lesson_scripts.keys())[:5])}...")
            return False

        script_data = self.lesson_scripts[lesson_id]

        print(f"\n{'='*60}")
        print(f"🎬 Generating: {script_data['title']}")
        print(f"   Course: {script_data['courseTitle']}")
        print(f"   Lesson ID: {lesson_id}")
        print(f"{'='*60}\n")

        # Build command
        cmd = [
            "python3",
            str(self.generator),
            "--script", script_data['script'],
            "--title", script_data['title']
        ]

        if self.test_mode:
            cmd.append("--test")

        # Add custom output filename
        output_name = lesson_id

        try:
            result = subprocess.run(cmd, check=True)

            # Rename output to match lesson ID
            temp_output = self.project_root / "public" / "courses" / f"custom_{lesson_id}.mp4"
            final_output = self.project_root / "public" / "courses" / f"{lesson_id}.mp4"

            if temp_output.exists():
                import shutil
                shutil.move(str(temp_output), str(final_output))

            print(f"✅ Video saved: {final_output}")
            return True

        except subprocess.CalledProcessError as e:
            print(f"❌ Generation failed: {e}")
            return False

    def generate_course(self, course_filter):
        """Generate all videos for lessons matching a course filter"""
        matching_lessons = [
            lesson_id for lesson_id in self.lesson_scripts.keys()
            if course_filter in lesson_id
        ]

        if not matching_lessons:
            print(f"❌ No lessons found matching: {course_filter}")
            return False

        print(f"\n🎓 Found {len(matching_lessons)} lessons for '{course_filter}':")
        for lesson_id in matching_lessons:
            print(f"   • {lesson_id}: {self.lesson_scripts[lesson_id]['title']}")

        response = input(f"\nGenerate {len(matching_lessons)} videos? (y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled")
            return False

        success_count = 0
        for i, lesson_id in enumerate(matching_lessons, 1):
            print(f"\n[{i}/{len(matching_lessons)}]")
            if self.generate_video(lesson_id):
                success_count += 1

            # Cooling period between videos
            if i < len(matching_lessons):
                import time
                print("\n⏸  Cooling down (10s)...")
                time.sleep(10)

        print(f"\n✅ Generated {success_count}/{len(matching_lessons)} videos")
        return True

    def generate_all(self):
        """Generate all videos"""
        total = len(self.lesson_scripts)

        print(f"\n🚀 GENERATE ALL VIDEOS")
        print(f"   Total lessons: {total}")
        print(f"   Estimated time: {total * 10 // 60} hours")
        print()

        response = input(f"Generate ALL {total} videos? This will take several hours. (y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled")
            return False

        success_count = 0
        for i, lesson_id in enumerate(self.lesson_scripts.keys(), 1):
            print(f"\n[{i}/{total}]")
            if self.generate_video(lesson_id):
                success_count += 1

            # Cooling period
            if i < total:
                import time
                print("\n⏸  Cooling down (10s)...")
                time.sleep(10)

        print(f"\n✅ Generated {success_count}/{total} videos")
        return True

def main():
    parser = argparse.ArgumentParser(description="Generate Phazur Labs Academy videos")
    parser.add_argument("--extract", action="store_true", help="Extract scripts from course content")
    parser.add_argument("--lesson", help="Generate specific lesson (e.g., lesson-react-1-1)")
    parser.add_argument("--course", help="Generate all lessons for a course (e.g., react)")
    parser.add_argument("--all", action="store_true", help="Generate all videos")
    parser.add_argument("--test", action="store_true", help="Test mode (faster, lower quality)")
    parser.add_argument("--list", action="store_true", help="List all available lessons")

    args = parser.parse_args()

    generator = PhazurVideoGenerator(test_mode=args.test)

    # Extract scripts if requested
    if args.extract:
        if not generator.extract_scripts():
            sys.exit(1)
        if not (args.lesson or args.course or args.all or args.list):
            print("\n✅ Scripts extracted! Now you can generate videos.")
            print("   Example: python scripts/generate-phazur-videos.py --lesson lesson-react-1-1")
            sys.exit(0)

    # Load scripts
    if not generator.load_scripts():
        print("\n💡 Tip: Run with --extract to extract scripts first")
        sys.exit(1)

    # List mode
    if args.list:
        print(f"\n📚 Available lessons ({len(generator.lesson_scripts)}):\n")
        for lesson_id, data in sorted(generator.lesson_scripts.items()):
            print(f"   {lesson_id}")
            print(f"      {data['courseTitle']}: {data['title']}")
            print()
        sys.exit(0)

    # Generate based on arguments
    try:
        if args.lesson:
            success = generator.generate_video(args.lesson)
        elif args.course:
            success = generator.generate_course(args.course)
        elif args.all:
            success = generator.generate_all()
        else:
            parser.print_help()
            sys.exit(1)

        sys.exit(0 if success else 1)

    except KeyboardInterrupt:
        print("\n\n⚠️  Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
