#!/bin/bash
#
# Daily Video Generation Script for Phazur Labs Academy
# Generates 10 Veo videos per day until all 80 lessons are complete
#
# Run manually: ./scripts/daily-video-generation.sh
# Cron schedule: 0 9 * * * /Users/seg/phazur-labs-academy/scripts/daily-video-generation.sh
#

# Configuration
PROJECT_DIR="/Users/seg/phazur-labs-academy"
LOG_FILE="$PROJECT_DIR/temp/video-generation.log"
DAILY_LIMIT=10

# Load environment
cd "$PROJECT_DIR"
source .env.local 2>/dev/null || true
export GOOGLE_GEMINI_API_KEY="${GOOGLE_GEMINI_API_KEY:-AIzaSyCfRs6u8zbN10aYoQmsqwKhAdY7raUhdsI}"

# Create log directory if needed
mkdir -p "$PROJECT_DIR/temp"

# Log start
echo "" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "Video Generation - $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Run the video generation
python3 "$PROJECT_DIR/scripts/generate-all-course-videos.py" --all --daily-limit "$DAILY_LIMIT" 2>&1 | tee -a "$LOG_FILE"

# Log completion
echo "" >> "$LOG_FILE"
echo "Completed at $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
