#!/bin/bash
# Batch generate videos with SadTalker (CPU mode, memory-optimized)
# Run in background: nohup bash scripts/batch-sadtalker.sh > logs/video-gen.log 2>&1 &

set -e
cd /Users/seg/phazur-labs-academy

SADTALKER_DIR="tools/SadTalker"
AVATAR="assets/instructor/avatar.jpg"
OUTPUT_DIR="public/videos/lessons"
TEMP_DIR="temp/video-gen"
SCRIPTS_FILE="temp/lesson-scripts.json"

mkdir -p "$OUTPUT_DIR" logs

echo "=== Phazur Labs Academy - Batch Video Generation ==="
echo "Started at: $(date)"
echo "Settings: 256px, CPU mode (memory-optimized)"
echo ""

# Extract lesson IDs from JSON
LESSONS=$(python3 -c "import json; scripts=json.load(open('$SCRIPTS_FILE')); print(' '.join([s['lessonId'] for s in scripts]))")

COUNT=$(echo $LESSONS | wc -w | tr -d ' ')
echo "Found $COUNT lessons to generate"
echo "Estimated time: $((COUNT * 20)) minutes (~15-20 min each at 256px)"
echo ""

COMPLETED=0

for LESSON_ID in $LESSONS; do
    echo ""
    echo "=== [$((COMPLETED + 1))/$COUNT] $LESSON_ID ==="
    echo "Started: $(date)"

    # Skip if already exists
    if [ -f "$OUTPUT_DIR/${LESSON_ID}.mp4" ]; then
        echo "  ⏭️  Already exists, skipping..."
        COMPLETED=$((COMPLETED + 1))
        continue
    fi

    # Extract script for this lesson
    SCRIPT=$(python3 -c "
import json
scripts = json.load(open('$SCRIPTS_FILE'))
lesson = next((s for s in scripts if s['lessonId'] == '$LESSON_ID'), None)
if lesson:
    # Escape quotes for shell
    print(lesson['script'].replace(\"'\", \"'\\\\''\"))
")

    # Generate audio with Edge TTS
    AUDIO_FILE="$TEMP_DIR/${LESSON_ID}.mp3"
    echo "  🎤 Generating audio..."
    python3 << EOF
import asyncio
import edge_tts
async def main():
    text = '''$SCRIPT'''
    communicate = edge_tts.Communicate(text, 'en-US-AriaNeural')
    await communicate.save('$AUDIO_FILE')
asyncio.run(main())
EOF
    echo "  ✅ Audio: $(du -h "$AUDIO_FILE" | cut -f1)"

    # Generate video with SadTalker (memory-optimized settings)
    echo "  🎬 Generating video..."
    cd "$SADTALKER_DIR"
    python3 inference.py \
        --driven_audio "/Users/seg/phazur-labs-academy/$AUDIO_FILE" \
        --source_image "/Users/seg/phazur-labs-academy/$AVATAR" \
        --result_dir "/Users/seg/phazur-labs-academy/$TEMP_DIR/sadtalker_batch" \
        --still \
        --preprocess full \
        --size 256 \
        --cpu \
        --batch_size 1 || {
            echo "  ❌ SadTalker failed, trying with smaller batch..."
            python3 inference.py \
                --driven_audio "/Users/seg/phazur-labs-academy/$AUDIO_FILE" \
                --source_image "/Users/seg/phazur-labs-academy/$AVATAR" \
                --result_dir "/Users/seg/phazur-labs-academy/$TEMP_DIR/sadtalker_batch" \
                --still \
                --preprocess crop \
                --size 256 \
                --cpu
        }
    cd /Users/seg/phazur-labs-academy

    # Find and move the generated video
    LATEST_VIDEO=$(ls -t "$TEMP_DIR/sadtalker_batch"/*.mp4 2>/dev/null | head -1)
    if [ -n "$LATEST_VIDEO" ] && [ -f "$LATEST_VIDEO" ]; then
        mv "$LATEST_VIDEO" "$OUTPUT_DIR/${LESSON_ID}.mp4"
        SIZE=$(du -h "$OUTPUT_DIR/${LESSON_ID}.mp4" | cut -f1)
        echo "  ✅ Video saved: $OUTPUT_DIR/${LESSON_ID}.mp4 ($SIZE)"
        COMPLETED=$((COMPLETED + 1))
    else
        echo "  ❌ Video generation failed for $LESSON_ID"
    fi

    # Clean up temp files
    rm -f "$AUDIO_FILE"
    rm -rf "$TEMP_DIR/sadtalker_batch/"*

    echo "  Finished: $(date)"
done

echo ""
echo "=== COMPLETE ==="
echo "Generated $COMPLETED/$COUNT videos"
echo "Finished at: $(date)"
echo "Videos saved to: $OUTPUT_DIR/"
ls -la "$OUTPUT_DIR/"
