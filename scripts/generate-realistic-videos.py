#!/usr/bin/env python3
"""
Phazur Labs Academy - Realistic Video Generator
Uses Edge TTS for audio + D-ID API for realistic talking head videos

Setup:
    1. Get D-ID API key from https://studio.d-id.com/account (free tier: 20 videos)
    2. Add to ~/.secrets: export DID_API_KEY="your-key-here"

Usage:
    python scripts/generate-realistic-videos.py --list
    python scripts/generate-realistic-videos.py --lesson react-1-1
    python scripts/generate-realistic-videos.py --all
"""

import os
import sys
import json
import asyncio
import argparse
import requests
import base64
import time
from pathlib import Path

# Edge TTS voices
VOICES = {
    "female_us": "en-US-AriaNeural",
    "male_us": "en-US-GuyNeural",
    "female_uk": "en-GB-SoniaNeural",
    "male_uk": "en-GB-RyanNeural",
}

# Lesson scripts
LESSON_SCRIPTS = {
    "lesson-react-1-1": {
        "title": "Welcome & Course Overview",
        "course": "Advanced React Patterns",
        "script": """
Welcome to Advanced React Patterns! I'm thrilled to be your guide on this journey into mastering React.

In this comprehensive course, you'll learn the most powerful patterns used by senior React developers at top tech companies.

We'll cover compound components, render props, custom hooks, and the latest patterns from React 18 and beyond.

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

Understanding these patterns will transform how you think about component architecture.

Let's explore the main categories of React patterns and when to use each one.
        """.strip()
    },
    "lesson-react-1-3": {
        "title": "Setting Up Your Environment",
        "course": "Advanced React Patterns",
        "script": """
Before we dive into patterns, let's set up a professional development environment.

We'll use Visual Studio Code with essential extensions for React development.

First, install Node.js version 18 or later. Next, we'll configure ESLint and Prettier for consistent code formatting.

I've prepared a starter template that includes everything you need. Download it from the resources section.

Let's walk through the setup together step by step.
        """.strip()
    },
    "lesson-react-2-1": {
        "title": "Understanding Compound Components",
        "course": "Advanced React Patterns",
        "script": """
Let's explore one of React's most powerful patterns: Compound Components.

Think about HTML's select element. It works together with option elements to create a cohesive dropdown.

Compound components bring this same elegance to React. Instead of passing complex configuration through props, users compose the UI they need.

This pattern gives incredible flexibility. Let's understand the theory, then build our own implementation.
        """.strip()
    },
    "lesson-react-2-2": {
        "title": "Building a Tabs Component",
        "course": "Advanced React Patterns",
        "script": """
Now let's build a real compound tabs component from scratch.

We'll start with the parent Tabs component that holds the state.

The key insight is using React Context to share this state with children.

What makes this elegant? Users compose the UI naturally. They can add icons, change the order, or wrap panels in animations.

Let's write the code together.
        """.strip()
    },
    "lesson-react-2-3": {
        "title": "Building an Accordion Component",
        "course": "Advanced React Patterns",
        "script": """
Let's apply the compound component pattern to build an accordion.

An accordion shows expandable sections. This is perfect for FAQs, settings panels, or navigation menus.

Our accordion will have three components: Accordion parent, AccordionItem, and AccordionPanel.

This pattern scales beautifully. The API stays clean because children compose the structure.

Let's implement this step by step.
        """.strip()
    },
    "lesson-react-3-1": {
        "title": "What are Render Props?",
        "course": "Advanced React Patterns",
        "script": """
Render props is a powerful pattern for sharing code between components.

The core idea is simple: instead of rendering fixed UI, a component calls a function prop and renders whatever it returns.

This gives the parent complete control over what gets rendered.

While custom hooks often replace render props today, understanding this pattern is essential.

Let's see how render props work in practice.
        """.strip()
    },
    "lesson-react-3-2": {
        "title": "Building a Mouse Tracker",
        "course": "Advanced React Patterns",
        "script": """
Let's build a mouse tracker using the render props pattern.

Our MouseTracker component will track cursor position and let consumers decide how to use that data.

The MouseTracker doesn't care what you render. It just tracks and shares the data.

This flexibility is the power of render props.
        """.strip()
    },
    "lesson-react-4-1": {
        "title": "Introduction to Custom Hooks",
        "course": "Advanced React Patterns",
        "script": """
Custom hooks are React's modern answer to code reuse. They're elegant, powerful, and essential knowledge.

A custom hook is simply a function that uses other hooks.

What makes hooks special? They let you extract component logic into reusable functions.

The rules are simple: only call hooks at the top level, only call them from React functions.

Let's explore the most useful custom hooks and build our own library.
        """.strip()
    },
}


class RealisticVideoGenerator:
    def __init__(self, voice="female_us"):
        self.project_root = Path(__file__).parent.parent
        self.output_dir = self.project_root / "public" / "videos" / "lessons"
        self.temp_dir = self.project_root / "temp" / "video-gen"
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.voice = VOICES.get(voice, VOICES["female_us"])

        # D-ID API
        self.did_api_key = os.environ.get("DID_API_KEY")
        self.did_base_url = "https://api.d-id.com"

        # Instructor photo
        self.avatar_path = self._find_avatar()

    def _find_avatar(self):
        """Find instructor avatar"""
        for ext in ['jpg', 'jpeg', 'png']:
            path = self.project_root / "assets" / "instructor" / f"avatar.{ext}"
            if path.exists():
                return path
        return None

    async def generate_audio(self, text: str, output_path: Path) -> bool:
        """Generate audio using edge-tts"""
        import edge_tts

        print(f"  🎤 Generating audio...")
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(str(output_path))

        if output_path.exists():
            size_kb = output_path.stat().st_size / 1024
            print(f"  ✅ Audio: {size_kb:.1f} KB")
            return True
        return False

    def upload_audio_to_did(self, audio_path: Path) -> str:
        """Upload audio to D-ID and get URL"""
        print(f"  📤 Uploading audio to D-ID...")

        with open(audio_path, 'rb') as f:
            audio_data = f.read()

        # D-ID expects multipart form upload for audio
        files = {
            'audio': (audio_path.name, audio_data, 'audio/mpeg')
        }

        response = requests.post(
            f"{self.did_base_url}/audios",
            headers={
                "Authorization": f"Basic {self.did_api_key}",
            },
            files=files
        )

        if response.status_code in [200, 201]:
            result = response.json()
            audio_url = result.get('url') or result.get('result_url')
            print(f"  ✅ Audio uploaded: {result.get('id', 'OK')}")
            return audio_url
        else:
            # Try alternative: return base64 data URL
            print(f"  ⚠️  Direct upload failed, using base64...")
            audio_b64 = base64.b64encode(audio_data).decode()
            return f"data:audio/mpeg;base64,{audio_b64}"

    def upload_image_to_did(self, image_path: Path) -> str:
        """Upload image to D-ID and get URL"""
        print(f"  📤 Uploading image to D-ID...")

        with open(image_path, 'rb') as f:
            image_data = f.read()

        ext = image_path.suffix.lower()
        mime_type = "image/jpeg" if ext in ['.jpg', '.jpeg'] else "image/png"

        files = {
            'image': (image_path.name, image_data, mime_type)
        }

        response = requests.post(
            f"{self.did_base_url}/images",
            headers={
                "Authorization": f"Basic {self.did_api_key}",
            },
            files=files
        )

        if response.status_code in [200, 201]:
            result = response.json()
            image_url = result.get('url') or result.get('result_url')
            print(f"  ✅ Image uploaded")
            return image_url
        else:
            print(f"  ❌ Image upload failed: {response.status_code} - {response.text[:200]}")
            return None

    def create_did_video(self, audio_url: str, image_url: str) -> str:
        """Create talking head video with D-ID"""
        print(f"  🎬 Creating D-ID video...")

        # Create talk request
        payload = {
            "source_url": image_url,
            "script": {
                "type": "audio",
                "audio_url": audio_url,
            },
            "config": {
                "stitch": True,  # Better quality
            }
        }

        response = requests.post(
            f"{self.did_base_url}/talks",
            headers={
                "Authorization": f"Basic {self.did_api_key}",
                "Content-Type": "application/json",
            },
            json=payload
        )

        if response.status_code in [200, 201]:
            result = response.json()
            talk_id = result.get('id')
            print(f"  ✅ Video job created: {talk_id}")
            return talk_id
        else:
            print(f"  ❌ D-ID error: {response.status_code} - {response.text[:300]}")
            return None

    def wait_for_video(self, talk_id: str, max_wait: int = 300) -> str:
        """Wait for D-ID video to complete and return URL"""
        print(f"  ⏳ Waiting for video generation...")

        start_time = time.time()
        while time.time() - start_time < max_wait:
            response = requests.get(
                f"{self.did_base_url}/talks/{talk_id}",
                headers={"Authorization": f"Basic {self.did_api_key}"}
            )

            if response.status_code == 200:
                result = response.json()
                status = result.get('status')

                if status == 'done':
                    video_url = result.get('result_url')
                    print(f"  ✅ Video ready!")
                    return video_url
                elif status == 'error':
                    print(f"  ❌ Generation failed: {result.get('error', 'Unknown error')}")
                    return None
                else:
                    print(f"     Status: {status}...", end='\r')

            time.sleep(5)

        print(f"  ❌ Timeout waiting for video")
        return None

    def download_video(self, video_url: str, output_path: Path) -> bool:
        """Download video from D-ID"""
        print(f"  📥 Downloading video...")

        response = requests.get(video_url, stream=True)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"  ✅ Downloaded: {size_mb:.1f} MB")
            return True
        return False

    async def generate_lesson_video(self, lesson_id: str) -> bool:
        """Generate realistic video for a lesson"""
        if not lesson_id.startswith("lesson-"):
            lesson_id = f"lesson-{lesson_id}"

        if lesson_id not in LESSON_SCRIPTS:
            print(f"❌ No script found for: {lesson_id}")
            return False

        if not self.did_api_key:
            print("❌ D-ID API key not found!")
            print("   Get one at: https://studio.d-id.com/account")
            print("   Add to ~/.secrets: export DID_API_KEY='your-key'")
            return False

        if not self.avatar_path:
            print("❌ No instructor avatar found!")
            print("   Add photo at: assets/instructor/avatar.jpg")
            return False

        lesson = LESSON_SCRIPTS[lesson_id]
        print(f"\n{'='*60}")
        print(f"🎬 Generating: {lesson['title']}")
        print(f"   Using D-ID for realistic talking head video")
        print(f"{'='*60}")

        # Paths
        audio_path = self.temp_dir / f"{lesson_id}.mp3"
        video_path = self.output_dir / f"{lesson_id}.mp4"

        # Step 1: Generate audio
        if not await self.generate_audio(lesson['script'], audio_path):
            return False

        # Step 2: Upload audio to D-ID
        audio_url = self.upload_audio_to_did(audio_path)
        if not audio_url:
            return False

        # Step 3: Upload image to D-ID
        image_url = self.upload_image_to_did(self.avatar_path)
        if not image_url:
            return False

        # Step 4: Create D-ID video
        talk_id = self.create_did_video(audio_url, image_url)
        if not talk_id:
            return False

        # Step 5: Wait for completion
        video_url = self.wait_for_video(talk_id)
        if not video_url:
            return False

        # Step 6: Download video
        if not self.download_video(video_url, video_path):
            return False

        # Cleanup
        audio_path.unlink(missing_ok=True)

        print(f"\n✅ Video saved: {video_path}")
        return True

    def list_lessons(self):
        """List available lessons"""
        print(f"\n📚 Available lessons ({len(LESSON_SCRIPTS)}):\n")
        for lid, data in LESSON_SCRIPTS.items():
            print(f"  {lid}: {data['title']}")


async def main():
    parser = argparse.ArgumentParser(description="Generate realistic course videos with D-ID")
    parser.add_argument("--list", action="store_true", help="List lessons")
    parser.add_argument("--lesson", help="Generate specific lesson")
    parser.add_argument("--all", action="store_true", help="Generate all videos")
    parser.add_argument("--voice", choices=list(VOICES.keys()), default="female_us")

    args = parser.parse_args()

    generator = RealisticVideoGenerator(voice=args.voice)

    if args.list:
        generator.list_lessons()
        return

    if args.lesson:
        await generator.generate_lesson_video(args.lesson)
        return

    if args.all:
        print(f"\n🚀 Generate {len(LESSON_SCRIPTS)} realistic videos with D-ID?")
        print("   Note: This uses D-ID API credits (free tier: 20 videos)")
        response = input("Continue? (y/n): ").strip().lower()
        if response != 'y':
            return

        for i, lesson_id in enumerate(LESSON_SCRIPTS.keys(), 1):
            print(f"\n[{i}/{len(LESSON_SCRIPTS)}]")
            await generator.generate_lesson_video(lesson_id)
            time.sleep(2)  # Rate limiting
        return

    parser.print_help()


if __name__ == "__main__":
    asyncio.run(main())
