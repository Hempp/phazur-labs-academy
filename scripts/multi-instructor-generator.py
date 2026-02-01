#!/usr/bin/env python3
"""
Multi-Instructor Video Generator for Phazur Labs Academy
Supports multiple AI instructor avatars with different voices and photos

Usage:
    python scripts/multi-instructor-generator.py --instructor sarah-chen --lesson lesson-react-1-1
    python scripts/multi-instructor-generator.py --instructor marcus-williams --course typescript
    python scripts/multi-instructor-generator.py --all-instructors --test
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path
from datetime import datetime

# Instructor configurations
INSTRUCTORS = {
    'sarah-chen': {
        'name': 'Dr. Sarah Chen',
        'title': 'React & Frontend Expert',
        'voice': 'assets/instructors/sarah-chen/voice-sample.wav',
        'photo': 'assets/instructors/sarah-chen/photo.jpg',
        'specialty': 'React, JavaScript, Frontend Architecture',
        'style': 'energetic',
        'courses': ['react', 'javascript', 'frontend']
    },
    'marcus-williams': {
        'name': 'Marcus Williams',
        'title': 'TypeScript & Backend Specialist',
        'voice': 'assets/instructors/marcus-williams/voice-sample.wav',
        'photo': 'assets/instructors/marcus-williams/photo.jpg',
        'specialty': 'TypeScript, Node.js, System Design',
        'style': 'authoritative',
        'courses': ['typescript', 'node', 'backend']
    },
    'elena-rodriguez': {
        'name': 'Elena Rodriguez',
        'title': 'Full Stack & DevOps Engineer',
        'voice': 'assets/instructors/elena-rodriguez/voice-sample.wav',
        'photo': 'assets/instructors/elena-rodriguez/photo.jpg',
        'specialty': 'Full Stack, DevOps, Cloud',
        'style': 'dynamic',
        'courses': ['fullstack', 'devops', 'cloud']
    },
    'james-park': {
        'name': 'Dr. James Park',
        'title': 'Computer Science Professor',
        'voice': 'assets/instructors/james-park/voice-sample.wav',
        'photo': 'assets/instructors/james-park/photo.jpg',
        'specialty': 'Algorithms, Data Structures, CS Fundamentals',
        'style': 'academic',
        'courses': ['algorithms', 'datastructures', 'cs']
    },
    'aisha-kumar': {
        'name': 'Aisha Kumar',
        'title': 'UI/UX & Design Systems',
        'voice': 'assets/instructors/aisha-kumar/voice-sample.wav',
        'photo': 'assets/instructors/aisha-kumar/photo.jpg',
        'specialty': 'UI/UX, Design Systems, Accessibility',
        'style': 'creative',
        'courses': ['design', 'ux', 'accessibility']
    },
    'alex-thompson': {
        'name': 'Alex Thompson',
        'title': 'Security & Best Practices',
        'voice': 'assets/instructors/alex-thompson/voice-sample.wav',
        'photo': 'assets/instructors/alex-thompson/photo.jpg',
        'specialty': 'Security, Testing, Code Review',
        'style': 'serious',
        'courses': ['security', 'testing', 'quality']
    }
}

# Default instructor if none specified
DEFAULT_INSTRUCTOR = 'sarah-chen'


class MultiInstructorGenerator:
    def __init__(self, test_mode=False):
        self.test_mode = test_mode
        self.project_root = Path(__file__).parent.parent
        self.base_generator = self.project_root / "scripts" / "custom-video-generator.py"

    def get_instructor_for_course(self, course_id):
        """Auto-select instructor based on course"""
        course_lower = course_id.lower()

        for instructor_id, instructor in INSTRUCTORS.items():
            if any(c in course_lower for c in instructor['courses']):
                return instructor_id

        # Default fallback
        return DEFAULT_INSTRUCTOR

    def verify_instructor_assets(self, instructor_id):
        """Check if instructor has required voice and photo"""
        if instructor_id not in INSTRUCTORS:
            print(f"❌ Unknown instructor: {instructor_id}")
            print(f"   Available: {', '.join(INSTRUCTORS.keys())}")
            return False

        instructor = INSTRUCTORS[instructor_id]
        voice_path = self.project_root / instructor['voice']
        photo_path = self.project_root / instructor['photo']

        missing = []
        if not voice_path.exists():
            missing.append(f"Voice: {voice_path}")
        if not photo_path.exists():
            missing.append(f"Photo: {photo_path}")

        if missing:
            print(f"❌ Missing assets for {instructor['name']}:")
            for item in missing:
                print(f"   • {item}")
            print()
            print("📝 To create this instructor:")
            print(f"   1. mkdir -p {voice_path.parent}")
            print(f"   2. Record voice: npm run record:voice")
            print(f"      Save to: {voice_path}")
            print(f"   3. Add photo (1080p+ headshot): {photo_path}")
            print()
            print("💡 Quick setup:")
            print(f"   - Get AI photo: https://thispersondoesnotexist.com/")
            print(f"   - Hire voice actor: fiverr.com (search 'voice recording')")
            print(f"   - Or use yourself/team member!")
            return False

        return True

    def generate_video(self, instructor_id, lesson_id=None, script=None, title=None):
        """Generate video using specific instructor"""

        if not self.verify_instructor_assets(instructor_id):
            return False

        instructor = INSTRUCTORS[instructor_id]
        voice_path = self.project_root / instructor['voice']
        photo_path = self.project_root / instructor['photo']

        print(f"\n{'='*60}")
        print(f"🎬 Generating with {instructor['name']}")
        print(f"   {instructor['title']}")
        print(f"   Specialty: {instructor['specialty']}")
        print(f"{'='*60}\n")

        # Build command for base generator
        cmd = [
            "python3",
            str(self.base_generator),
        ]

        if lesson_id:
            # Use lesson script
            cmd.extend(["--lesson", lesson_id])
        elif script:
            # Use custom script
            cmd.extend(["--script", script])
            if title:
                cmd.extend(["--title", title])

        if self.test_mode:
            cmd.append("--test")

        # Set environment variables for instructor assets
        env = os.environ.copy()
        env['INSTRUCTOR_VOICE'] = str(voice_path)
        env['INSTRUCTOR_PHOTO'] = str(photo_path)
        env['INSTRUCTOR_NAME'] = instructor['name']

        try:
            result = subprocess.run(cmd, env=env, check=True)
            print(f"✅ Video generated with {instructor['name']}")
            return True

        except subprocess.CalledProcessError as e:
            print(f"❌ Generation failed: {e}")
            return False

    def list_instructors(self):
        """List all available instructors"""
        print("\n👥 Available Instructors:\n")

        for instructor_id, instructor in INSTRUCTORS.items():
            voice_path = self.project_root / instructor['voice']
            photo_path = self.project_root / instructor['photo']

            voice_ready = "✅" if voice_path.exists() else "❌"
            photo_ready = "✅" if photo_path.exists() else "❌"
            status = "✅ Ready" if (voice_path.exists() and photo_path.exists()) else "⏳ Setup needed"

            print(f"  {instructor_id}")
            print(f"    Name: {instructor['name']}")
            print(f"    Title: {instructor['title']}")
            print(f"    Specialty: {instructor['specialty']}")
            print(f"    Courses: {', '.join(instructor['courses'])}")
            print(f"    Voice: {voice_ready}  Photo: {photo_ready}  Status: {status}")
            print()

    def setup_instructor(self, instructor_id):
        """Guide user through setting up an instructor"""
        if instructor_id not in INSTRUCTORS:
            print(f"❌ Unknown instructor: {instructor_id}")
            return False

        instructor = INSTRUCTORS[instructor_id]
        voice_path = self.project_root / instructor['voice']
        photo_path = self.project_root / instructor['photo']

        print(f"\n🎓 Setting up {instructor['name']}")
        print(f"   {instructor['title']}\n")

        # Create directory
        voice_path.parent.mkdir(parents=True, exist_ok=True)

        print("📋 Setup Checklist:\n")

        # Voice
        if voice_path.exists():
            print(f"  ✅ Voice sample found: {voice_path}")
        else:
            print(f"  ❌ Voice sample needed: {voice_path}")
            print(f"     Options:")
            print(f"     1. Record yourself: npm run record:voice")
            print(f"        Then move to: {voice_path}")
            print(f"     2. Hire on Fiverr ($5-20): fiverr.com")
            print(f"        Search: 'voice recording'")
            print(f"     3. Use team member's voice")
            print()

        # Photo
        if photo_path.exists():
            print(f"  ✅ Photo found: {photo_path}")
        else:
            print(f"  ❌ Photo needed: {photo_path}")
            print(f"     Options:")
            print(f"     1. AI-generated (free): https://thispersondoesnotexist.com/")
            print(f"     2. Stock photo ($10-30): shutterstock.com, adobe stock")
            print(f"     3. Professional headshot ($50-200)")
            print(f"     4. Team member photo")
            print()

        # Sample script for voice recording
        print(f"\n📝 Voice Recording Script for {instructor['name']}:\n")
        print(f'  "{self.get_sample_script(instructor_id)}"')
        print()

        if voice_path.exists() and photo_path.exists():
            print(f"✅ {instructor['name']} is ready to use!")
            print(f"\n🎬 Test with:")
            print(f"   python scripts/multi-instructor-generator.py \\")
            print(f"     --instructor {instructor_id} \\")
            print(f"     --script 'Test video content' \\")
            print(f"     --test")
        else:
            print(f"⏳ Complete the setup above to use {instructor['name']}")

        return True

    def get_sample_script(self, instructor_id):
        """Get sample voice recording script for instructor"""
        scripts = {
            'sarah-chen': "Welcome to React development! I'm Dr. Sarah Chen, and I'm passionate about building beautiful, performant user interfaces. Throughout my career at top tech companies, I've seen patterns that work and patterns that don't. Today, we'll explore the techniques that make the difference between good code and great code.",

            'marcus-williams': "Hello, I'm Marcus Williams. Over my fifteen years in software engineering, I've learned that strong typing and robust architecture are the foundation of scalable systems. In this course, we'll take a deep dive into TypeScript's type system, exploring patterns that prevent bugs and improve code quality.",

            'elena-rodriguez': "Hi everyone, I'm Elena Rodriguez. As a full-stack engineer, I love connecting all the pieces from frontend to backend to deployment. In this course, we'll build complete applications and deploy them to production. You'll learn the practical skills that companies are hiring for right now.",

            'james-park': "Welcome! I'm Dr. James Park. Throughout my career in computer science research and teaching, I've found that truly understanding algorithms transforms how you think about problems. This course breaks down complex concepts into clear, manageable pieces.",

            'aisha-kumar': "Hello! I'm Aisha Kumar, and I believe great design makes technology accessible to everyone. In this course, we'll explore the principles that make interfaces intuitive and delightful. You'll learn to think like a designer while building the technical skills to bring your visions to life.",

            'alex-thompson': "I'm Alex Thompson. In cybersecurity, one small mistake can have huge consequences. That's why I'm passionate about teaching developers to write secure code from the start. This course covers the security principles and practices that protect users and systems."
        }
        return scripts.get(instructor_id, "Sample voice recording for instructor.")


def main():
    parser = argparse.ArgumentParser(description="Multi-Instructor Video Generator")
    parser.add_argument("--instructor", help="Instructor ID (e.g., sarah-chen)")
    parser.add_argument("--lesson", help="Lesson ID to generate")
    parser.add_argument("--script", help="Custom script text")
    parser.add_argument("--title", help="Custom video title")
    parser.add_argument("--course", help="Auto-select instructor for course")
    parser.add_argument("--test", action="store_true", help="Test mode (faster)")
    parser.add_argument("--list", action="store_true", help="List all instructors")
    parser.add_argument("--setup", help="Setup guide for specific instructor")

    args = parser.parse_args()

    generator = MultiInstructorGenerator(test_mode=args.test)

    # List instructors
    if args.list:
        generator.list_instructors()
        sys.exit(0)

    # Setup instructor
    if args.setup:
        generator.setup_instructor(args.setup)
        sys.exit(0)

    # Determine instructor
    if args.course:
        instructor_id = generator.get_instructor_for_course(args.course)
        print(f"📚 Auto-selected {INSTRUCTORS[instructor_id]['name']} for {args.course} course")
    elif args.instructor:
        instructor_id = args.instructor
    else:
        instructor_id = DEFAULT_INSTRUCTOR
        print(f"ℹ️  Using default instructor: {INSTRUCTORS[instructor_id]['name']}")

    # Generate video
    if args.lesson or args.script:
        success = generator.generate_video(
            instructor_id=instructor_id,
            lesson_id=args.lesson,
            script=args.script,
            title=args.title
        )
        sys.exit(0 if success else 1)
    else:
        parser.print_help()
        print("\n💡 Examples:")
        print("  python scripts/multi-instructor-generator.py --list")
        print("  python scripts/multi-instructor-generator.py --setup sarah-chen")
        print("  python scripts/multi-instructor-generator.py --instructor sarah-chen --lesson lesson-react-1-1")
        print("  python scripts/multi-instructor-generator.py --course react --lesson lesson-react-1-1")
        sys.exit(1)


if __name__ == "__main__":
    main()
