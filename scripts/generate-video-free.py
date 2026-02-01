#!/usr/bin/env python3
"""
Phazur Labs Academy - Free Video Generator
Uses Edge TTS (free) + SadTalker (local/free) for talking head videos

Zero cost, unlimited videos, runs entirely on your Mac.

Usage:
    python scripts/generate-video-free.py --list
    python scripts/generate-video-free.py --lesson lesson-react-1-1
    python scripts/generate-video-free.py --lesson lesson-react-1-1 --test
    python scripts/generate-video-free.py --all
"""

import os
import sys
import json
import asyncio
import argparse
import subprocess
import shutil
from pathlib import Path
from datetime import datetime

# Edge TTS voices for different instructors
INSTRUCTOR_VOICES = {
    "sarah-chen": "en-US-AriaNeural",      # Energetic female
    "marcus-williams": "en-US-GuyNeural",   # Professional male
    "elena-rodriguez": "en-US-JennyNeural", # Dynamic female
    "james-park": "en-US-DavisNeural",      # Academic male
    "aisha-kumar": "en-US-SaraNeural",      # Creative female
    "alex-thompson": "en-US-TonyNeural",    # Serious male
    "default": "en-US-AriaNeural",
}


class FreeVideoGenerator:
    def __init__(self, test_mode=False, instructor="default"):
        self.test_mode = test_mode
        self.project_root = Path(__file__).parent.parent
        self.output_dir = self.project_root / "public" / "courses"
        self.temp_dir = self.project_root / "temp" / "video-gen"
        self.sadtalker_dir = self.project_root / "tools" / "SadTalker"

        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Voice
        self.voice = INSTRUCTOR_VOICES.get(instructor, INSTRUCTOR_VOICES["default"])

        # Instructor assets
        self.avatar_path = self._find_avatar()
        self.voice_sample = self.project_root / "assets" / "instructor" / "voice-sample.wav"

        # Lesson scripts
        self.scripts_file = self.project_root / "temp" / "lesson-scripts.json"
        self.lesson_scripts = {}

    def _find_avatar(self):
        """Find instructor avatar image"""
        for name in ['avatar.jpg', 'avatar.jpeg', 'avatar.png', 'photo.jpg', 'photo.png']:
            path = self.project_root / "assets" / "instructor" / name
            if path.exists():
                return path
        return None

    def load_scripts(self):
        """Load lesson scripts from JSON"""
        if not self.scripts_file.exists():
            print(f"❌ Scripts file not found: {self.scripts_file}")
            print("   Run: node scripts/extract-lesson-scripts.mjs")
            return False

        with open(self.scripts_file) as f:
            scripts = json.load(f)

        for item in scripts:
            self.lesson_scripts[item['lessonId']] = item

        print(f"✅ Loaded {len(self.lesson_scripts)} lesson scripts")
        return True

    async def generate_audio_edge_tts(self, text: str, output_path: Path) -> bool:
        """Generate audio using Edge TTS (free Microsoft neural voices)"""
        try:
            import edge_tts
        except ImportError:
            print("❌ edge-tts not installed. Run: pip install edge-tts")
            return False

        print(f"  🎤 Generating audio with Edge TTS ({self.voice})...")

        try:
            communicate = edge_tts.Communicate(text, self.voice)
            await communicate.save(str(output_path))

            if output_path.exists():
                size_kb = output_path.stat().st_size / 1024
                print(f"  ✅ Audio generated: {size_kb:.1f} KB")
                return True
            return False
        except Exception as e:
            print(f"  ❌ Edge TTS error: {e}")
            return False

    def generate_audio_coqui(self, text: str, output_path: Path) -> bool:
        """Generate audio using Coqui TTS with voice cloning (requires voice sample)"""
        if not self.voice_sample.exists():
            print(f"  ⚠️  Voice sample not found, using Edge TTS instead")
            return False

        try:
            from TTS.api import TTS
            print(f"  🎤 Generating audio with Coqui TTS (voice cloning)...")

            tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
            tts.tts_to_file(
                text=text,
                file_path=str(output_path),
                speaker_wav=str(self.voice_sample),
                language="en"
            )

            if output_path.exists():
                size_kb = output_path.stat().st_size / 1024
                print(f"  ✅ Audio generated with voice clone: {size_kb:.1f} KB")
                return True
            return False
        except Exception as e:
            print(f"  ⚠️  Coqui TTS failed: {e}, falling back to Edge TTS")
            return False

    def generate_video_sadtalker(self, audio_path: Path, output_path: Path) -> bool:
        """Generate talking head video using SadTalker"""
        if not self.avatar_path:
            print("  ❌ No avatar image found!")
            print(f"     Add photo at: assets/instructor/avatar.jpg")
            return False

        if not self.sadtalker_dir.exists():
            print("  ❌ SadTalker not found!")
            print(f"     Expected at: {self.sadtalker_dir}")
            return False

        print(f"  🎬 Generating video with SadTalker...")

        # SadTalker output directory
        result_dir = self.temp_dir / "sadtalker_output"
        result_dir.mkdir(exist_ok=True)

        # Build command with absolute paths (required for SadTalker)
        inference_script = self.sadtalker_dir / "inference.py"
        cmd = [
            sys.executable,
            str(inference_script.absolute()),
            "--driven_audio", str(audio_path.absolute()),
            "--source_image", str(self.avatar_path.absolute()),
            "--result_dir", str(result_dir.absolute()),
            "--still",  # Minimize head movement for professional look
            "--preprocess", "full",
            "--cpu",  # Required: MPS/Metal has compatibility issues
        ]

        if self.test_mode:
            cmd.extend(["--size", "256"])
            print("     (test mode: ~15min for 5s video, CPU)")
        else:
            cmd.extend(["--size", "512", "--enhancer", "gfpgan"])
            print("     (production mode: higher quality, ~30min for 5s video, CPU)")

        try:
            # Run SadTalker from its directory
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=str(self.sadtalker_dir.absolute()),
                timeout=3600  # 1 hour timeout for longer videos
            )

            if result.returncode != 0:
                print(f"  ❌ SadTalker failed:")
                if result.stderr:
                    print(f"     {result.stderr[:500]}")
                return False

            # Find the generated video
            mp4_files = list(result_dir.glob("**/*.mp4"))
            if not mp4_files:
                print("  ❌ No output video found")
                return False

            # Get most recent video
            latest = max(mp4_files, key=lambda p: p.stat().st_mtime)
            shutil.move(str(latest), str(output_path))

            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"  ✅ Video generated: {size_mb:.1f} MB")
            return True

        except subprocess.TimeoutExpired:
            print("  ❌ SadTalker timed out (>10 min)")
            return False
        except Exception as e:
            print(f"  ❌ Error: {e}")
            return False

    async def generate_lesson(self, lesson_id: str) -> bool:
        """Generate video for a single lesson"""
        if lesson_id not in self.lesson_scripts:
            print(f"❌ No script found for: {lesson_id}")
            available = list(self.lesson_scripts.keys())[:5]
            print(f"   Available: {', '.join(available)}...")
            return False

        lesson = self.lesson_scripts[lesson_id]

        print(f"\n{'='*60}")
        print(f"🎬 {lesson['title']}")
        print(f"   Course: {lesson['courseTitle']}")
        print(f"   ID: {lesson_id}")
        print(f"{'='*60}")

        # File paths
        timestamp = datetime.now().strftime("%H%M%S")
        audio_path = self.temp_dir / f"{lesson_id}_{timestamp}.mp3"
        video_path = self.output_dir / f"{lesson_id}.mp4"

        # Step 1: Generate audio
        # Try voice cloning first if sample exists, fall back to Edge TTS
        audio_ok = self.generate_audio_coqui(lesson['script'], audio_path)
        if not audio_ok:
            audio_ok = await self.generate_audio_edge_tts(lesson['script'], audio_path)

        if not audio_ok:
            return False

        # Step 2: Generate talking head video
        if not self.generate_video_sadtalker(audio_path, video_path):
            return False

        # Cleanup
        audio_path.unlink(missing_ok=True)

        print(f"\n✅ Video saved: {video_path}")
        return True

    def list_lessons(self):
        """List all available lessons"""
        if not self.load_scripts():
            return

        print(f"\n📚 Available lessons ({len(self.lesson_scripts)}):\n")

        # Group by course
        by_course = {}
        for lid, data in self.lesson_scripts.items():
            course = data['courseTitle']
            if course not in by_course:
                by_course[course] = []
            by_course[course].append((lid, data['title']))

        for course, lessons in by_course.items():
            print(f"  📖 {course}")
            for lid, title in lessons:
                print(f"     {lid}: {title}")
            print()

    async def generate_all(self, auto_confirm=False):
        """Generate all lesson videos"""
        if not self.load_scripts():
            return

        total = len(self.lesson_scripts)

        print(f"\n🚀 Generate {total} videos?")
        print(f"   Estimated time: {total * 120} minutes in CPU mode (~{total * 2} hours)")
        print(f"   Cost: $0 (completely free!)\n")

        if not auto_confirm:
            response = input("Continue? (y/n): ").strip().lower()
            if response != 'y':
                print("Cancelled")
                return

        success = 0
        for i, lesson_id in enumerate(self.lesson_scripts.keys(), 1):
            print(f"\n[{i}/{total}]")
            if await self.generate_lesson(lesson_id):
                success += 1

            # Small delay between videos
            if i < total:
                await asyncio.sleep(2)

        print(f"\n{'='*60}")
        print(f"✅ Generated {success}/{total} videos")
        print(f"   Output: {self.output_dir}")
        print(f"{'='*60}")


async def main():
    parser = argparse.ArgumentParser(
        description="Generate free AI instructor videos (Edge TTS + SadTalker)"
    )
    parser.add_argument("--list", action="store_true", help="List available lessons")
    parser.add_argument("--lesson", help="Generate specific lesson (e.g., lesson-react-1-1)")
    parser.add_argument("--all", action="store_true", help="Generate all lessons")
    parser.add_argument("--test", action="store_true", help="Test mode (faster, lower quality)")
    parser.add_argument("--instructor", default="sarah-chen",
                       choices=list(INSTRUCTOR_VOICES.keys()),
                       help="Instructor voice to use")

    args = parser.parse_args()

    generator = FreeVideoGenerator(
        test_mode=args.test,
        instructor=args.instructor
    )

    if args.list:
        generator.list_lessons()
        return

    if args.lesson:
        if not generator.load_scripts():
            sys.exit(1)
        success = await generator.generate_lesson(args.lesson)
        sys.exit(0 if success else 1)

    if args.all:
        await generator.generate_all()
        return

    # Default: show help
    parser.print_help()
    print("\n💡 Quick start:")
    print("   python scripts/generate-video-free.py --list")
    print("   python scripts/generate-video-free.py --lesson lesson-react-1-1 --test")


if __name__ == "__main__":
    asyncio.run(main())
