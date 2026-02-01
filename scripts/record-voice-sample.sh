#!/bin/bash

# Voice Sample Recording Script
# Records a 60-second voice sample for TTS cloning

set -e

echo "🎤 Phazur Labs Academy - Voice Sample Recorder"
echo ""
echo "This will record a 60-second voice sample for AI voice cloning."
echo "Tips for best results:"
echo "  • Use a quiet room with minimal background noise"
echo "  • Speak naturally, as if teaching a student"
echo "  • Maintain consistent volume and pace"
echo "  • Use a good microphone (USB mic or AirPods work well)"
echo ""

# Create output directory
OUTPUT_DIR="assets/instructor"
mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="$OUTPUT_DIR/voice-sample.wav"

# Sample script for user to read
SAMPLE_SCRIPT="Welcome to Phazur Labs Academy. In this course, we'll explore advanced programming concepts and practical development techniques. You'll learn through hands-on projects, real-world examples, and interactive exercises. Let's begin our learning journey together. Remember, mastery comes through consistent practice and application."

echo "📝 Please read this script when recording starts:"
echo ""
echo "\"$SAMPLE_SCRIPT\""
echo ""
echo "Press ENTER when ready to record..."
read

echo "🔴 Recording in 3..."
sleep 1
echo "🔴 Recording in 2..."
sleep 1
echo "🔴 Recording in 1..."
sleep 1
echo "🔴 RECORDING NOW! (60 seconds)"
echo ""
echo "Read the script above naturally..."

# Record using ffmpeg (works on all systems)
ffmpeg -f avfoundation -i ":0" -t 60 -ar 22050 -ac 1 "$OUTPUT_FILE" 2>/dev/null

echo ""
echo "✅ Recording complete!"
echo "📁 Saved to: $OUTPUT_FILE"
echo ""
echo "🔊 Playing back your recording..."
afplay "$OUTPUT_FILE"

echo ""
echo "Questions:"
echo "1. Was the recording clear? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "✅ Great! Voice sample saved successfully."
    echo ""
    echo "📝 Next steps:"
    echo "1. Add instructor photo: $OUTPUT_DIR/photo.jpg"
    echo "2. Generate test video: npm run generate:custom-video -- --lesson lesson-react-1-1 --test"
else
    echo "🔄 Let's try again. Run this script to re-record."
    rm "$OUTPUT_FILE"
    exit 1
fi
