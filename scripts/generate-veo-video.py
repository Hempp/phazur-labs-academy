#!/usr/bin/env python3
"""
Google Veo Video Generator for Phazur Labs Academy
Generates AI videos using Gemini API with Veo models

Usage:
    python scripts/generate-veo-video.py --list
    python scripts/generate-veo-video.py --lesson lesson-react-1-1
    python scripts/generate-veo-video.py --prompt "Your prompt here"
"""

import os
import json
import time
import argparse
import requests
from pathlib import Path

# Configuration
API_KEY = os.environ.get('GOOGLE_GEMINI_API_KEY', '')
PROJECT_ROOT = Path(__file__).parent.parent
SCRIPTS_FILE = PROJECT_ROOT / 'temp' / 'lesson-scripts.json'
OUTPUT_DIR = PROJECT_ROOT / 'public' / 'videos' / 'lessons'

# Veo model options
VEO_MODELS = {
    'fast': 'veo-3.1-fast-generate-preview',
    'quality': 'veo-3.1-generate-preview',
    'stable': 'veo-3.0-generate-001',
}

# Instructor prompts for different lesson types
LESSON_PROMPTS = {
    'welcome': """A professional female tech instructor with warm, friendly demeanor speaking directly to camera
in a modern, minimalist studio. She has confident body language and genuine enthusiasm.
Clean dark blue gradient background with subtle floating code symbols. Soft professional lighting.
She gestures naturally while speaking about an exciting learning journey. 16:9 aspect ratio, cinematic quality.""",

    'concept': """A professional female instructor in a modern tech classroom explaining programming concepts.
She stands beside a large screen showing colorful diagrams. Animated elements float in the background.
She points and gestures to explain relationships. Clean, modern aesthetic with purple and blue accent colors.
Professional studio lighting. 16:9 cinematic.""",

    'advanced': """A tech instructor demonstrating code on a sleek holographic display.
She interacts with floating code blocks that reorganize themselves. Modern glass office environment.
Dynamic camera movement following her explanations. Futuristic but approachable aesthetic.
Blue and teal color scheme. 16:9 cinematic quality.""",
}


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


def generate_video(prompt: str, model: str = 'fast', duration: int = 8) -> dict:
    """Generate video using Veo API"""
    api_key = load_api_key()
    if not api_key:
        raise ValueError("GOOGLE_GEMINI_API_KEY not configured")

    model_id = VEO_MODELS.get(model, model)

    print(f"🎬 Generating video with {model_id}...")
    print(f"   Prompt: {prompt[:80]}...")

    # Start video generation using predictLongRunning endpoint
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

    print(f"   Operation: {operation_name}")
    print("   ⏳ Waiting for video generation...")

    # Poll for completion
    return wait_for_video(operation_name, api_key)


def wait_for_video(operation_name: str, api_key: str, timeout: int = 600) -> dict:
    """Poll for video generation completion"""
    start = time.time()

    while time.time() - start < timeout:
        url = f"https://generativelanguage.googleapis.com/v1beta/{operation_name}"
        response = requests.get(url, headers={'x-goog-api-key': api_key})

        if response.status_code != 200:
            print(f"   Warning: Poll error {response.status_code}")
            time.sleep(10)
            continue

        result = response.json()

        if result.get('done'):
            if 'error' in result:
                raise Exception(f"Generation failed: {result['error']}")

            # Extract video URL from response
            gen_response = result.get('response', {}).get('generateVideoResponse', {})
            samples = gen_response.get('generatedSamples', [])
            if samples:
                video_uri = samples[0].get('video', {}).get('uri')
                if video_uri:
                    print("   ✅ Video generated!")
                    return {'videoUrl': video_uri, 'result': result, 'apiKey': api_key}

            raise Exception(f"No video URI in result: {result}")

        # Still processing
        elapsed = int(time.time() - start)
        print(f"   Processing... ({elapsed}s elapsed)", end='\r')
        time.sleep(5)

    raise Exception("Video generation timed out")


def download_video(video_url: str, output_path: Path, api_key: str = None) -> bool:
    """Download video to local file"""
    print(f"   📥 Downloading to {output_path.name}...")

    headers = {}
    if api_key:
        headers['x-goog-api-key'] = api_key

    response = requests.get(video_url, headers=headers, stream=True)
    if response.status_code != 200:
        print(f"   ❌ Download failed: {response.status_code}")
        return False

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"   ✅ Saved: {output_path} ({size_mb:.1f} MB)")
    return True


def load_lessons() -> list:
    """Load lesson scripts"""
    if not SCRIPTS_FILE.exists():
        print(f"❌ Scripts not found: {SCRIPTS_FILE}")
        return []

    with open(SCRIPTS_FILE) as f:
        return json.load(f)


def get_lesson_prompt(lesson: dict) -> str:
    """Generate appropriate Veo prompt for a lesson"""
    title = lesson.get('title', '').lower()

    if 'welcome' in title or 'overview' in title:
        base = LESSON_PROMPTS['welcome']
    elif 'advanced' in title or 'deep' in title:
        base = LESSON_PROMPTS['advanced']
    else:
        base = LESSON_PROMPTS['concept']

    # Add lesson-specific context
    return f"{base}\n\nThe instructor is teaching: {lesson['title']} - {lesson['description']}"


def main():
    parser = argparse.ArgumentParser(description='Generate videos with Google Veo')
    parser.add_argument('--list', action='store_true', help='List available lessons')
    parser.add_argument('--lesson', help='Generate video for specific lesson ID')
    parser.add_argument('--prompt', help='Custom prompt for video generation')
    parser.add_argument('--model', default='fast', choices=['fast', 'quality', 'stable'])
    parser.add_argument('--output', help='Output file path')

    args = parser.parse_args()

    if args.list:
        lessons = load_lessons()
        print(f"\n📚 Available lessons ({len(lessons)}):\n")
        for lesson in lessons:
            print(f"  {lesson['lessonId']}: {lesson['title']}")
        return

    if args.lesson:
        lessons = load_lessons()
        lesson = next((l for l in lessons if l['lessonId'] == args.lesson), None)

        if not lesson:
            print(f"❌ Lesson not found: {args.lesson}")
            return

        print(f"\n🎬 Generating video for: {lesson['title']}\n")

        prompt = get_lesson_prompt(lesson)
        result = generate_video(prompt, model=args.model)

        output_path = OUTPUT_DIR / f"{args.lesson}-veo.mp4"
        download_video(result['videoUrl'], output_path, api_key=result.get('apiKey'))
        return

    if args.prompt:
        print(f"\n🎬 Generating custom video\n")
        result = generate_video(args.prompt, model=args.model)

        output_path = Path(args.output) if args.output else OUTPUT_DIR / f"custom-{int(time.time())}.mp4"
        download_video(result['videoUrl'], output_path)
        return

    parser.print_help()
    print("\n💡 Examples:")
    print("  python scripts/generate-veo-video.py --list")
    print("  python scripts/generate-veo-video.py --lesson lesson-react-1-1")
    print("  python scripts/generate-veo-video.py --prompt 'A coding tutorial scene'")


if __name__ == '__main__':
    main()
