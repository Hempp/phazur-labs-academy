#!/usr/bin/env python3
"""
Phazur Labs Academy - Course Video Generator
Uses Edge TTS + SadTalker AI to create realistic talking head course videos

Usage:
    python scripts/generate-course-videos.py --list              # List available lessons
    python scripts/generate-course-videos.py --lesson react-1-1  # Generate one video (simple)
    python scripts/generate-course-videos.py --lesson react-1-1 --realistic  # Realistic AI video
    python scripts/generate-course-videos.py --course react      # Generate all react videos
    python scripts/generate-course-videos.py --all --realistic   # Generate all with AI faces
"""

import os
import sys
import json
import asyncio
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

# Edge TTS voices - professional narration voices
VOICES = {
    "male_us": "en-US-GuyNeural",      # Professional male US
    "female_us": "en-US-AriaNeural",   # Professional female US
    "male_uk": "en-GB-RyanNeural",     # Professional male UK
    "female_uk": "en-GB-SoniaNeural",  # Professional female UK
}

# Lesson scripts - educational content for each video
LESSON_SCRIPTS = {
    "lesson-react-1-1": {
        "title": "Welcome & Course Overview",
        "course": "Advanced React Patterns",
        "script": """
Welcome to Advanced React Patterns! I'm thrilled to be your guide on this journey into mastering React.

In this comprehensive course, you'll learn the most powerful patterns used by senior React developers at top tech companies.

We'll cover compound components, render props, custom hooks, and the latest patterns from React 18 and beyond.

But this isn't just theory. Every pattern comes with hands-on exercises and real-world projects.

By the end, you'll have the confidence to architect scalable, maintainable React applications.

Let's begin this exciting adventure together!
        """.strip()
    },
    "lesson-react-1-2": {
        "title": "What are Design Patterns?",
        "course": "Advanced React Patterns",
        "script": """
What exactly are design patterns, and why should you care about them?

Design patterns are proven solutions to common problems in software development. They're like recipes that experienced developers have refined over years of practice.

In React specifically, patterns help us solve recurring challenges. How do we share logic between components? How do we create flexible, reusable component APIs?

The patterns we'll learn aren't just theoretical concepts. They're used every day in production applications at companies like Facebook, Airbnb, and Netflix.

Understanding these patterns will transform how you think about component architecture.

Let's explore the main categories of React patterns and when to use each one.
        """.strip()
    },
    "lesson-react-1-3": {
        "title": "Setting Up Your Environment",
        "course": "Advanced React Patterns",
        "script": """
Before we dive into patterns, let's set up a professional development environment.

We'll use Visual Studio Code with essential extensions for React development. I'll show you my exact setup.

First, install Node.js version 18 or later. This gives us access to the latest JavaScript features and npm.

Next, we'll configure ESLint and Prettier for consistent code formatting. These tools catch errors before they become bugs.

I've prepared a starter template that includes everything you need. Download it from the resources section.

The template includes TypeScript configuration, testing setup with Jest and React Testing Library, and a clean project structure.

Let's walk through the setup together step by step.
        """.strip()
    },
    "lesson-react-2-1": {
        "title": "Understanding Compound Components",
        "course": "Advanced React Patterns",
        "script": """
Let's explore one of React's most powerful patterns: Compound Components.

Think about HTML's select element. It works together with option elements to create a cohesive dropdown. Neither makes sense alone, but together they're powerful.

Compound components bring this same elegance to React. Instead of passing complex configuration through props, users compose the UI they need.

Consider a tabs component. With compound components, you'd write Tab, TabList, and TabPanel. Each piece is simple, but they share state implicitly.

This pattern gives incredible flexibility. Users can customize layout, add wrappers, or rearrange children without you predicting every use case.

Libraries like Reach UI and Radix use this pattern extensively. Let's understand the theory, then build our own implementation.
        """.strip()
    },
    "lesson-react-2-2": {
        "title": "Building a Tabs Component",
        "course": "Advanced React Patterns",
        "script": """
Now let's build a real compound tabs component from scratch.

We'll start with the parent Tabs component. It holds the state: which tab is currently active.

The key insight is using React Context to share this state with children. Child components don't need props passed down manually.

First, create a TabsContext that holds the active index and a function to change it.

The TabList component renders its children, the individual Tab buttons. Each Tab uses the context to know if it's active and to handle clicks.

TabPanels and TabPanel work similarly. Only the active panel renders its content.

What makes this elegant? Users compose the UI naturally. They can add icons to tabs, change the order, or wrap panels in animations.

Let's write the code together, starting with the context and provider.
        """.strip()
    },
    "lesson-react-2-3": {
        "title": "Building an Accordion Component",
        "course": "Advanced React Patterns",
        "script": """
Let's apply the compound component pattern to build an accordion.

An accordion shows expandable sections. Click a header, and its content reveals. This is perfect for FAQs, settings panels, or navigation menus.

Our accordion will have three components: Accordion parent, AccordionItem for each section, and AccordionPanel for the content.

The parent maintains which items are expanded. We'll support both single and multiple expansion modes.

Each AccordionItem needs to know if it's expanded and how to toggle. We'll pass this through context, scoped to each item.

The animation is important for good user experience. We'll use CSS transitions on max-height for smooth expand and collapse.

This pattern scales beautifully. Add icons, customize headers, nest accordions. The API stays clean because children compose the structure.

Let's implement this step by step, starting with the state management.
        """.strip()
    },
    "lesson-react-3-1": {
        "title": "What are Render Props?",
        "course": "Advanced React Patterns",
        "script": """
Render props is a powerful pattern for sharing code between components.

The core idea is simple: instead of rendering fixed UI, a component calls a function prop and renders whatever it returns.

This gives the parent complete control over what gets rendered, while the child component handles the logic.

Consider a mouse tracker. It tracks cursor position, but you decide how to display it. Maybe coordinates, a tooltip, or a custom cursor.

The component with the logic passes data to your render function. You render whatever makes sense for your use case.

This pattern was revolutionary before hooks. Libraries like React Router and Downshift used it extensively.

While custom hooks often replace render props today, understanding this pattern deepens your React knowledge and helps you read older codebases.

Let's see how render props work in practice.
        """.strip()
    },
    "lesson-react-3-2": {
        "title": "Building a Mouse Tracker",
        "course": "Advanced React Patterns",
        "script": """
Let's build a mouse tracker using the render props pattern.

Our MouseTracker component will track cursor position and let consumers decide how to use that data.

First, we set up state for x and y coordinates. We attach a mousemove listener to update these values.

Here's the key part: instead of rendering UI, we call this.props.render, passing the coordinates.

Now consumers use it like this: MouseTracker with a render prop that receives x and y and returns JSX.

One consumer might show coordinates as text. Another might position a custom cursor. A third might calculate distance from center.

The MouseTracker doesn't care. It just tracks and shares the data.

We can also use the children as a function pattern. Same concept, cleaner syntax for simple cases.

This flexibility is the power of render props. Logic stays reusable while rendering stays customizable.
        """.strip()
    },
    "lesson-react-4-1": {
        "title": "Introduction to Custom Hooks",
        "course": "Advanced React Patterns",
        "script": """
Custom hooks are React's modern answer to code reuse. They're elegant, powerful, and essential knowledge.

A custom hook is simply a function that uses other hooks. The convention is to start with 'use', like useLocalStorage or useDebounce.

What makes hooks special? They let you extract component logic into reusable functions without changing your component hierarchy.

Before hooks, sharing stateful logic meant render props or higher-order components. Both had drawbacks: wrapper hell and complex code.

Hooks solve this cleanly. Extract logic into a function, call it from any component. No wrappers, no complex patterns.

The rules are simple: only call hooks at the top level, only call them from React functions.

Let's explore the most useful custom hooks and build our own library of reusable logic.
        """.strip()
    },
}

class CourseVideoGenerator:
    def __init__(self, voice="female_us", use_sadtalker=False):
        self.project_root = Path(__file__).parent.parent
        self.output_dir = self.project_root / "public" / "videos" / "lessons"
        self.temp_dir = self.project_root / "temp" / "video-gen"
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.voice = VOICES.get(voice, VOICES["female_us"])
        self.ffmpeg = self._find_ffmpeg()
        self.use_sadtalker = use_sadtalker

        # SadTalker paths
        self.sadtalker_dir = self.project_root / "tools" / "SadTalker"
        self.sadtalker_available = (self.sadtalker_dir / "checkpoints").exists()

        # Instructor avatar (check both jpg and png)
        avatar_jpg = self.project_root / "assets" / "instructor" / "avatar.jpg"
        avatar_png = self.project_root / "assets" / "instructor" / "avatar.png"
        self.avatar_path = avatar_jpg if avatar_jpg.exists() else avatar_png

        # Brand colors
        self.bg_color = "0x0f172a"  # Dark slate
        self.accent_color = "0x3b82f6"  # Blue

    def _find_ffmpeg(self):
        """Find FFmpeg binary"""
        paths = [
            "/Users/seg/bin/ffmpeg",
            "/opt/homebrew/bin/ffmpeg",
            "/usr/local/bin/ffmpeg",
            "ffmpeg"
        ]
        for path in paths:
            if path == "ffmpeg" or os.path.exists(path):
                return path
        return "ffmpeg"

    async def generate_audio(self, text: str, output_path: Path) -> bool:
        """Generate audio using edge-tts"""
        import edge_tts

        print(f"  🎤 Generating audio with Edge TTS ({self.voice})...")

        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(str(output_path))

        if output_path.exists():
            size_kb = output_path.stat().st_size / 1024
            print(f"  ✅ Audio generated: {size_kb:.1f} KB")
            return True
        return False

    def get_audio_duration(self, audio_path: Path) -> float:
        """Get audio duration using ffprobe"""
        cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(audio_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return float(result.stdout.strip())

    def generate_realistic_video(self, audio_path: Path, output_path: Path) -> bool:
        """Generate realistic talking head video using SadTalker AI"""
        if not self.sadtalker_available:
            print("  ❌ SadTalker models not found. Run: cd tools/SadTalker && bash download_models.sh")
            return False

        if not self.avatar_path.exists():
            print("  ❌ No avatar found at assets/instructor/avatar.jpg")
            return False

        print(f"  🤖 Generating realistic video with SadTalker AI...")
        print(f"  👤 Source: {self.avatar_path.name}")

        # Convert mp3 to wav for SadTalker (required format)
        wav_path = audio_path.with_suffix('.wav')
        convert_cmd = [
            self.ffmpeg, "-y", "-i", str(audio_path),
            "-ar", "16000", "-ac", "1", str(wav_path)
        ]
        subprocess.run(convert_cmd, capture_output=True)

        # SadTalker output directory
        sadtalker_output = self.temp_dir / "sadtalker_output"
        sadtalker_output.mkdir(parents=True, exist_ok=True)

        # Run SadTalker inference
        cmd = [
            sys.executable,
            str(self.sadtalker_dir / "inference.py"),
            "--driven_audio", str(wav_path),
            "--source_image", str(self.avatar_path),
            "--result_dir", str(sadtalker_output),
            "--checkpoint_dir", str(self.sadtalker_dir / "checkpoints"),
            "--size", "256",  # 256 is faster, 512 for higher quality
            "--batch_size", "1",  # Safer for CPU processing
            "--preprocess", "crop",
        ]

        # Add CPU flag if no CUDA available
        try:
            import torch
            if torch.cuda.is_available():
                print("  🚀 Running on GPU (CUDA)")
            else:
                cmd.append("--cpu")
                # Estimate: ~6 sec/frame, 25 fps, so 40s video = 1000 frames = ~1.5 hours
                audio_duration = self.get_audio_duration(wav_path)
                est_minutes = int(audio_duration * 25 * 6 / 60)
                print(f"  ⚠️  Running on CPU - estimated time: ~{est_minutes} minutes")
                print("  💡 Tip: For faster results, consider D-ID API or a machine with CUDA GPU")
        except ImportError:
            cmd.append("--cpu")
            print("  ⚠️  Running on CPU (this may take 1-2 hours per video)")

        print("  ⏳ Processing... (this may take a few minutes)")

        # Run SadTalker
        env = os.environ.copy()
        env["PYTHONPATH"] = str(self.sadtalker_dir)

        result = subprocess.run(
            cmd,
            cwd=str(self.sadtalker_dir),
            capture_output=True,
            text=True,
            env=env
        )

        # Find the generated video (SadTalker creates timestamped directories)
        generated_videos = list(sadtalker_output.glob("*.mp4"))
        if not generated_videos:
            # Check subdirectories
            generated_videos = list(sadtalker_output.glob("*/*.mp4"))

        if generated_videos:
            # Get the most recent one
            latest_video = max(generated_videos, key=lambda p: p.stat().st_mtime)

            # Move to final output with branded background
            self._composite_on_background(latest_video, output_path)

            # Cleanup
            wav_path.unlink(missing_ok=True)

            if output_path.exists():
                size_mb = output_path.stat().st_size / (1024 * 1024)
                print(f"  ✅ Realistic video created: {size_mb:.1f} MB")
                return True

        print(f"  ❌ SadTalker failed. Error: {result.stderr[-500:] if result.stderr else 'Unknown'}")
        return False

    def _composite_on_background(self, talking_head_video: Path, output_path: Path):
        """Composite the talking head video on a branded background"""
        duration = self.get_audio_duration(talking_head_video)

        # Composite: branded background + talking head centered
        filter_complex = (
            f"[0:v]scale=1920:1080[bg];"
            f"[1:v]scale=640:-1[face];"
            f"[bg][face]overlay=(W-w)/2:(H-h)/2[out]"
        )

        cmd = [
            self.ffmpeg, "-y",
            "-f", "lavfi",
            "-i", f"color=c={self.bg_color}:s=1920x1080:d={duration}",
            "-i", str(talking_head_video),
            "-filter_complex", filter_complex,
            "-map", "[out]",
            "-map", "1:a",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            str(output_path)
        ]

        subprocess.run(cmd, capture_output=True)

    def generate_video(self, audio_path: Path, output_path: Path, title: str, course: str) -> bool:
        """Generate video with instructor avatar, background, and title (simple mode)"""
        print(f"  🎬 Creating video with avatar...")

        duration = self.get_audio_duration(audio_path)

        # Check if avatar exists
        has_avatar = self.avatar_path.exists()
        if has_avatar:
            print(f"  👤 Using avatar: {self.avatar_path.name}")

        # Build FFmpeg command with avatar overlay
        if has_avatar:
            # Video with avatar overlay centered, plus text
            # Filter: scale avatar, overlay on background, add text
            filter_complex = (
                f"[0:v]scale=1920:1080[bg];"
                f"[1:v]scale=400:400[avatar];"
                f"[bg][avatar]overlay=(W-w)/2:(H-h)/2-100[v]"
            )
            cmd = [
                self.ffmpeg,
                "-y",
                "-f", "lavfi",
                "-i", f"color=c={self.bg_color}:s=1920x1080:d={duration}",
                "-i", str(self.avatar_path),
                "-i", str(audio_path),
                "-filter_complex", filter_complex,
                "-map", "[v]",
                "-map", "2:a",
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-c:a", "aac",
                "-b:a", "192k",
                "-pix_fmt", "yuv420p",
                "-shortest",
                str(output_path)
            ]
        else:
            # Simple video without avatar
            cmd = [
                self.ffmpeg,
                "-y",
                "-f", "lavfi",
                "-i", f"color=c={self.bg_color}:s=1920x1080:d={duration}",
                "-i", str(audio_path),
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-c:a", "aac",
                "-b:a", "192k",
                "-pix_fmt", "yuv420p",
                "-shortest",
                str(output_path)
            ]

        result = subprocess.run(cmd, capture_output=True, text=True)

        if output_path.exists() and output_path.stat().st_size > 1000:
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"  ✅ Video created: {size_mb:.1f} MB ({duration:.1f}s)")
            return True
        else:
            print(f"  ❌ FFmpeg error: {result.stderr[:300]}")
            return False

    async def generate_lesson_video(self, lesson_id: str) -> bool:
        """Generate video for a specific lesson"""
        # Normalize lesson ID
        if not lesson_id.startswith("lesson-"):
            lesson_id = f"lesson-{lesson_id}"

        if lesson_id not in LESSON_SCRIPTS:
            print(f"❌ No script found for: {lesson_id}")
            print(f"   Available: {', '.join(LESSON_SCRIPTS.keys())}")
            return False

        lesson = LESSON_SCRIPTS[lesson_id]
        title = lesson["title"]
        course = lesson["course"]
        script = lesson["script"]

        print(f"\n{'='*60}")
        print(f"🎬 Generating: {title}")
        print(f"   Course: {course}")
        print(f"   Lesson: {lesson_id}")
        print(f"{'='*60}")

        # Paths
        audio_path = self.temp_dir / f"{lesson_id}.mp3"
        video_path = self.output_dir / f"{lesson_id}.mp4"

        # Step 1: Generate audio
        if not await self.generate_audio(script, audio_path):
            return False

        # Step 2: Create video (realistic or simple)
        if self.use_sadtalker and self.sadtalker_available:
            success = self.generate_realistic_video(audio_path, video_path)
        else:
            success = self.generate_video(audio_path, video_path, title, course)

        if not success:
            return False

        # Cleanup temp audio
        audio_path.unlink(missing_ok=True)

        print(f"\n✅ Video saved to: {video_path}")
        return True

    def list_lessons(self):
        """List all available lessons"""
        print(f"\n📚 Available lessons ({len(LESSON_SCRIPTS)}):\n")
        for lesson_id, data in LESSON_SCRIPTS.items():
            print(f"  {lesson_id}")
            print(f"     {data['course']}: {data['title']}")
            print()


async def main():
    parser = argparse.ArgumentParser(description="Generate Phazur Labs course videos")
    parser.add_argument("--list", action="store_true", help="List available lessons")
    parser.add_argument("--lesson", help="Generate video for specific lesson (e.g., react-1-1)")
    parser.add_argument("--course", help="Generate all videos for a course filter (e.g., react)")
    parser.add_argument("--all", action="store_true", help="Generate all videos")
    parser.add_argument("--voice", choices=["male_us", "female_us", "male_uk", "female_uk"],
                       default="female_us", help="Voice to use")
    parser.add_argument("--realistic", action="store_true",
                       help="Use SadTalker AI for realistic talking head videos")

    args = parser.parse_args()

    generator = CourseVideoGenerator(voice=args.voice, use_sadtalker=args.realistic)

    # Show SadTalker status
    if args.realistic:
        if generator.sadtalker_available:
            print("🤖 SadTalker AI enabled - generating realistic videos")
        else:
            print("⚠️  SadTalker models not found. Run: cd tools/SadTalker && bash download_models.sh")
            print("   Falling back to simple video mode")
            generator.use_sadtalker = False

    if args.list:
        generator.list_lessons()
        return

    if args.lesson:
        success = await generator.generate_lesson_video(args.lesson)
        sys.exit(0 if success else 1)

    if args.course:
        matching = [lid for lid in LESSON_SCRIPTS.keys() if args.course in lid]
        if not matching:
            print(f"❌ No lessons found matching: {args.course}")
            sys.exit(1)

        print(f"\n🎓 Found {len(matching)} lessons for '{args.course}'")
        for lid in matching:
            print(f"   • {lid}: {LESSON_SCRIPTS[lid]['title']}")

        response = input(f"\nGenerate {len(matching)} videos? (y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled")
            return

        success_count = 0
        for i, lesson_id in enumerate(matching, 1):
            print(f"\n[{i}/{len(matching)}]")
            if await generator.generate_lesson_video(lesson_id):
                success_count += 1

        print(f"\n✅ Generated {success_count}/{len(matching)} videos")
        return

    if args.all:
        total = len(LESSON_SCRIPTS)
        print(f"\n🚀 Generate ALL {total} videos?")
        response = input("(y/n): ").strip().lower()
        if response != 'y':
            print("Cancelled")
            return

        success_count = 0
        for i, lesson_id in enumerate(LESSON_SCRIPTS.keys(), 1):
            print(f"\n[{i}/{total}]")
            if await generator.generate_lesson_video(lesson_id):
                success_count += 1

        print(f"\n✅ Generated {success_count}/{total} videos")
        return

    parser.print_help()


if __name__ == "__main__":
    asyncio.run(main())
