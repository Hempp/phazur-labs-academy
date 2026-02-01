#!/bin/bash

# Phazur Labs Academy - Custom Video System Setup
# Run this on your Mac to install all dependencies

set -e

echo "🎬 Setting up Phazur Labs Custom Video Generation System..."
echo ""

# Check system requirements
echo "📋 Checking system requirements..."
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  This script is designed for macOS. Linux/Windows may require modifications."
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $PYTHON_VERSION"

# Check available RAM
TOTAL_RAM=$(sysctl hw.memsize | awk '{print int($2/1024/1024/1024)}')
echo "✓ Total RAM: ${TOTAL_RAM}GB"
if [ "$TOTAL_RAM" -lt 16 ]; then
    echo "⚠️  Warning: 16GB+ RAM recommended for best performance"
fi

# Check available storage
AVAILABLE_STORAGE=$(df -h . | awk 'NR==2 {print $4}')
echo "✓ Available storage: $AVAILABLE_STORAGE"

echo ""
echo "📦 Installing dependencies..."

# Install Homebrew packages
echo "→ Installing system packages via Homebrew..."
brew install python@3.10 ffmpeg git-lfs portaudio

# Create Python virtual environment
echo "→ Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
echo "→ Upgrading pip..."
pip install --upgrade pip

# Install Coqui TTS
echo "→ Installing Coqui TTS..."
pip install coqui-tts

# Install SadTalker dependencies
echo "→ Installing SadTalker dependencies..."
pip install torch torchvision torchaudio
pip install numpy opencv-python pillow scipy pyyaml tqdm
pip install imageio imageio-ffmpeg
pip install scikit-image
pip install face-alignment
pip install gradio

# Clone SadTalker repository
echo "→ Cloning SadTalker..."
if [ ! -d "tools/SadTalker" ]; then
    mkdir -p tools
    cd tools
    git clone https://github.com/OpenTalker/SadTalker.git
    cd SadTalker

    # Download pretrained models
    echo "→ Downloading SadTalker models (this may take a while)..."
    bash scripts/download_models.sh

    cd ../..
else
    echo "✓ SadTalker already installed"
fi

# Install additional Python packages
echo "→ Installing additional Python packages..."
pip install python-dotenv

# Test installations
echo ""
echo "🧪 Testing installations..."

# Test Coqui TTS
echo "→ Testing Coqui TTS..."
python3 << 'PYTHON_TEST'
try:
    from TTS.api import TTS
    print("✓ Coqui TTS installed successfully")
except Exception as e:
    print(f"✗ Coqui TTS test failed: {e}")
PYTHON_TEST

# Test PyTorch
echo "→ Testing PyTorch..."
python3 << 'PYTHON_TEST'
try:
    import torch
    print(f"✓ PyTorch {torch.__version__} installed successfully")
    if torch.backends.mps.is_available():
        print("✓ MPS (Apple Silicon GPU) available")
    else:
        print("→ MPS not available (Intel Mac - will use CPU)")
except Exception as e:
    print(f"✗ PyTorch test failed: {e}")
PYTHON_TEST

# Test FFmpeg
echo "→ Testing FFmpeg..."
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo "✓ $FFMPEG_VERSION"
else
    echo "✗ FFmpeg not found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Record your voice sample: npm run record:voice"
echo "3. Prepare instructor photo: Place in assets/instructor/photo.jpg"
echo "4. Generate test video: npm run generate:custom-video -- --lesson=lesson-react-1-1 --test"
echo ""
echo "📖 See CUSTOM_VIDEO_SYSTEM_DESIGN.md for full documentation"
