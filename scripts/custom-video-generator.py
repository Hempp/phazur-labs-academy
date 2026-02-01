#!/usr/bin/env python3
"""
Phazur Labs Academy - Custom Video Generator
Generates AI instructor videos using Coqui TTS + SadTalker

Usage:
    python scripts/custom-video-generator.py --lesson lesson-react-1-1
    python scripts/custom-video-generator.py --lesson lesson-react-1-1 --test
    python scripts/custom-video-generator.py --script "Your custom script here"
"""

import os
import sys
import argparse
import subprocess
import json
from pathlib import Path
from datetime import datetime

# Add SadTalker to Python path
SADTALKER_PATH = Path(__file__).parent.parent / "tools" / "SadTalker"
sys.path.insert(0, str(SADTALKER_PATH))

try:
    from TTS.api import TTS
except ImportError:
    print("❌ Coqui TTS not installed. Run: pip install coqui-tts")
    sys.exit(1)


class VideoGenerator:
    def __init__(self, test_mode=False):
        self.test_mode = test_mode
        self.project_root = Path(__file__).parent.parent
        self.output_dir = self.project_root / "public" / "courses"
        self.temp_dir = self.project_root / "temp" / "video-generation"
        self.temp_dir.mkdir(parents=True, exist_ok=True)

        # Voice model paths
        self.voice_sample = self.project_root / "assets" / "instructor" / "voice-sample.wav"
        self.instructor_photo = self.project_root / "assets" / "instructor" / "photo.jpg"

        # Initialize TTS
        print("🎤 Loading Coqui TTS model...")
        self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

    def load_lesson_script(self, lesson_id):
        """Extract lesson script from course-content.ts"""
        print(f"📖 Loading script for {lesson_id}...")

        # For now, return example scripts based on lesson type
        # TODO: Parse actual TypeScript file or use JSON export

        example_scripts = {
            "lesson-react-1-1": """
Welcome to Advanced React Patterns! I'm excited to guide you through this comprehensive course.

In this journey, we'll explore powerful patterns that will transform how you build React applications.
You'll learn compound components, render props, higher-order components, and the latest hooks patterns.

But this isn't just theory. We'll build real-world projects together, applying each pattern in practical scenarios.
By the end, you'll have the confidence to architect scalable, maintainable React applications.

Let's begin this exciting adventure into advanced React development!
            """.strip(),

            "lesson-react-1-2": """
Let's explore the concept of Compound Components, one of React's most powerful patterns.

Compound components allow you to create flexible, reusable component APIs. Think of it like HTML's select and option tags -
they work together as a cohesive unit while remaining separate components.

This pattern gives users of your components incredible flexibility. They can compose the UI exactly how they need it,
without you having to predict every use case with props.

We'll implement a real example together, building a custom dropdown component using this pattern.
You'll see how this approach leads to cleaner, more maintainable code.
            """.strip()
        }

        return example_scripts.get(lesson_id, f"This is the lesson content for {lesson_id}.")

    def generate_audio(self, text, output_path):
        """Generate speech audio using Coqui TTS with voice cloning"""
        print("🎵 Generating audio with TTS...")

        if self.voice_sample.exists():
            # Use voice cloning
            print(f"   Using voice clone from: {self.voice_sample}")
            self.tts.tts_to_file(
                text=text,
                file_path=str(output_path),
                speaker_wav=str(self.voice_sample),
                language="en"
            )
        else:
            # Use default voice
            print("   Using default voice (no voice sample found)")
            print(f"   Tip: Record a voice sample and save to: {self.voice_sample}")
            self.tts.tts_to_file(
                text=text,
                file_path=str(output_path),
                language="en"
            )

        print(f"✅ Audio generated: {output_path}")
        return output_path

    def generate_video(self, audio_path, output_path):
        """Generate talking head video using SadTalker"""
        print("🎬 Generating talking head video with SadTalker...")

        if not self.instructor_photo.exists():
            print(f"❌ Instructor photo not found: {self.instructor_photo}")
            print("   Please add a photo at: assets/instructor/photo.jpg")
            return None

        # Run SadTalker inference
        sadtalker_script = SADTALKER_PATH / "inference.py"

        cmd = [
            "python", str(sadtalker_script),
            "--driven_audio", str(audio_path),
            "--source_image", str(self.instructor_photo),
            "--result_dir", str(self.temp_dir),
            "--enhancer", "gfpgan",
            "--still",  # Minimize head movement for professional look
            "--preprocess", "full",
            "--size", "512"  # Higher quality
        ]

        if self.test_mode:
            print("   Running in TEST mode (faster, lower quality)")
            cmd.append("--fps=15")
        else:
            cmd.append("--fps=30")

        print(f"   Running: {' '.join(cmd)}")

        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            print("✅ Video generated successfully")

            # SadTalker outputs to results folder - find the generated video
            results_dir = self.temp_dir / "results"
            if results_dir.exists():
                videos = list(results_dir.glob("**/*.mp4"))
                if videos:
                    latest_video = max(videos, key=os.path.getctime)
                    # Move to output path
                    import shutil
                    shutil.move(str(latest_video), str(output_path))
                    return output_path

            print("⚠️  Could not find generated video in results folder")
            return None

        except subprocess.CalledProcessError as e:
            print(f"❌ SadTalker failed: {e}")
            print(f"   stdout: {e.stdout}")
            print(f"   stderr: {e.stderr}")
            return None

    def add_branding(self, video_path, output_path, lesson_title):
        """Add intro, outro, and branding using FFmpeg"""
        print("✨ Adding branding and effects...")

        # Create simple title overlay
        drawtext_filter = (
            f"drawtext=text='{lesson_title}':"
            "fontsize=48:fontcolor=white:x=(w-text_w)/2:y=50:"
            "shadowcolor=black:shadowx=2:shadowy=2:"
            "enable='between(t,0,3)'"  # Show for first 3 seconds
        )

        cmd = [
            "ffmpeg", "-i", str(video_path),
            "-vf", drawtext_filter,
            "-c:a", "copy",  # Copy audio without re-encoding
            "-y",  # Overwrite output
            str(output_path)
        ]

        try:
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"✅ Branding added: {output_path}")
            return output_path
        except subprocess.CalledProcessError as e:
            print(f"⚠️  FFmpeg branding failed (using original video): {e}")
            # If branding fails, just use original video
            import shutil
            shutil.copy(str(video_path), str(output_path))
            return output_path

    def generate(self, lesson_id=None, script=None, title=None):
        """Main generation workflow"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Get script
        if script:
            lesson_script = script
            lesson_title = title or "Custom Lesson"
            output_name = f"custom_{timestamp}"
        else:
            lesson_script = self.load_lesson_script(lesson_id)
            lesson_title = lesson_id.replace("-", " ").title()
            output_name = lesson_id

        print(f"\n{'='*60}")
        print(f"🎬 Generating video: {lesson_title}")
        print(f"{'='*60}\n")

        # Step 1: Generate audio
        audio_file = self.temp_dir / f"{output_name}_audio.wav"
        self.generate_audio(lesson_script, audio_file)

        # Step 2: Generate talking head video
        raw_video = self.temp_dir / f"{output_name}_raw.mp4"
        video_result = self.generate_video(audio_file, raw_video)

        if not video_result:
            print("❌ Video generation failed")
            return None

        # Step 3: Add branding
        final_video = self.output_dir / f"{output_name}.mp4"
        final_video.parent.mkdir(parents=True, exist_ok=True)
        self.add_branding(raw_video, final_video, lesson_title)

        # Cleanup temp files
        if not self.test_mode:
            print("🧹 Cleaning up temporary files...")
            audio_file.unlink(missing_ok=True)
            raw_video.unlink(missing_ok=True)

        print(f"\n{'='*60}")
        print(f"✅ VIDEO GENERATION COMPLETE!")
        print(f"{'='*60}")
        print(f"📁 Output: {final_video}")
        print(f"📊 Size: {final_video.stat().st_size / (1024*1024):.2f} MB")
        print()

        return final_video


def main():
    parser = argparse.ArgumentParser(description="Generate AI instructor videos")
    parser.add_argument("--lesson", help="Lesson ID (e.g., lesson-react-1-1)")
    parser.add_argument("--script", help="Custom script text")
    parser.add_argument("--title", help="Custom video title")
    parser.add_argument("--test", action="store_true", help="Test mode (faster, lower quality)")

    args = parser.parse_args()

    if not args.lesson and not args.script:
        parser.error("Must specify either --lesson or --script")

    generator = VideoGenerator(test_mode=args.test)

    try:
        result = generator.generate(
            lesson_id=args.lesson,
            script=args.script,
            title=args.title
        )

        if result:
            sys.exit(0)
        else:
            sys.exit(1)

    except KeyboardInterrupt:
        print("\n⚠️  Generation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
