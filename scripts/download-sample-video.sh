#!/bin/bash
##
# Download Sample Video for Testing
#
# This script downloads a free sample video (Big Buck Bunny) to use for testing
# the video player and upload scripts without needing your own content yet.
#
# Usage:
#   bash scripts/download-sample-video.sh
#   bash scripts/download-sample-video.sh react-patterns
##

set -e  # Exit on error

# Configuration
SAMPLE_VIDEO_URL="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
COURSE_NAME=${1:-"react-patterns"}
VIDEO_DIR="public/videos/${COURSE_NAME}"
OUTPUT_FILE="${VIDEO_DIR}/1-1-welcome.mp4"

echo "📹 Downloading sample video for testing..."
echo ""
echo "   Course: ${COURSE_NAME}"
echo "   Target: ${OUTPUT_FILE}"
echo ""

# Create directory if it doesn't exist
mkdir -p "$VIDEO_DIR"

# Check if file already exists
if [ -f "$OUTPUT_FILE" ]; then
  echo "⚠️  Video already exists: ${OUTPUT_FILE}"
  read -p "   Overwrite? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   Skipping download."
    exit 0
  fi
fi

# Download the video
echo "⬇️  Downloading..."
if command -v curl &> /dev/null; then
  curl -L --progress-bar -o "$OUTPUT_FILE" "$SAMPLE_VIDEO_URL"
elif command -v wget &> /dev/null; then
  wget --progress=bar -O "$OUTPUT_FILE" "$SAMPLE_VIDEO_URL"
else
  echo "❌ Error: Neither curl nor wget is available"
  echo "   Please install one of these tools to download the sample video"
  exit 1
fi

# Verify download
if [ -f "$OUTPUT_FILE" ]; then
  FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
  echo ""
  echo "✅ Download complete!"
  echo "   File: ${OUTPUT_FILE}"
  echo "   Size: ${FILE_SIZE}"
  echo ""
  echo "🎬 You can now test the video player at:"
  echo "   http://localhost:3000/courses/advanced-react-patterns/learn?lesson=lesson-react-1-1"
  echo ""
  echo "💡 Tip: Run 'npm run dev' to start the development server"
else
  echo "❌ Download failed"
  exit 1
fi
