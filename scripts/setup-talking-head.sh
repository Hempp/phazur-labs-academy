#!/bin/bash
# Setup script for Talking Head video generation backends
# Installs SadTalker and/or Wav2Lip for free lip-sync video generation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     Talking Head Video Generation Setup                       ║"
echo "║     Installs SadTalker and/or Wav2Lip backends               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Default installation directory
INSTALL_DIR="${HOME}/.local/share"
SADTALKER_DIR="${INSTALL_DIR}/sadtalker"
WAV2LIP_DIR="${INSTALL_DIR}/wav2lip"

# Check for Python
check_python() {
    echo -e "${BLUE}Checking Python installation...${NC}"

    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
        PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
        echo -e "${GREEN}✓ Python ${PYTHON_VERSION} found${NC}"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
        PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2)
        echo -e "${GREEN}✓ Python ${PYTHON_VERSION} found${NC}"
    else
        echo -e "${RED}✗ Python not found. Please install Python 3.8+ first.${NC}"
        exit 1
    fi

    # Check version is 3.8+
    MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
    MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

    if [ "$MAJOR" -lt 3 ] || ([ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 8 ]); then
        echo -e "${RED}✗ Python 3.8+ required. Found ${PYTHON_VERSION}${NC}"
        exit 1
    fi
}

# Check for CUDA/GPU
check_gpu() {
    echo -e "${BLUE}Checking GPU availability...${NC}"

    if command -v nvidia-smi &> /dev/null; then
        echo -e "${GREEN}✓ NVIDIA GPU detected${NC}"
        nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null || true
        GPU_AVAILABLE=true
    else
        echo -e "${YELLOW}! No NVIDIA GPU detected. Processing will be slower on CPU.${NC}"
        GPU_AVAILABLE=false
    fi
}

# Check for FFmpeg
check_ffmpeg() {
    echo -e "${BLUE}Checking FFmpeg installation...${NC}"

    if command -v ffmpeg &> /dev/null; then
        echo -e "${GREEN}✓ FFmpeg found${NC}"
    else
        echo -e "${YELLOW}! FFmpeg not found. Installing...${NC}"

        if [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install ffmpeg
            else
                echo -e "${RED}✗ Homebrew not found. Please install FFmpeg manually.${NC}"
                exit 1
            fi
        elif [[ -f /etc/debian_version ]]; then
            sudo apt-get update && sudo apt-get install -y ffmpeg
        elif [[ -f /etc/redhat-release ]]; then
            sudo yum install -y ffmpeg
        else
            echo -e "${RED}✗ Please install FFmpeg manually for your system.${NC}"
            exit 1
        fi
    fi
}

# Install SadTalker
install_sadtalker() {
    echo -e "\n${BLUE}Installing SadTalker...${NC}"

    mkdir -p "$INSTALL_DIR"

    if [ -d "$SADTALKER_DIR" ]; then
        echo -e "${YELLOW}SadTalker directory exists. Updating...${NC}"
        cd "$SADTALKER_DIR"
        git pull
    else
        echo "Cloning SadTalker repository..."
        git clone https://github.com/OpenTalker/SadTalker.git "$SADTALKER_DIR"
        cd "$SADTALKER_DIR"
    fi

    # Create virtual environment
    echo "Setting up Python environment..."
    $PYTHON_CMD -m venv venv
    source venv/bin/activate

    # Install dependencies
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    pip install torch torchvision torchaudio
    pip install -r requirements.txt

    # Download checkpoints
    echo -e "\n${BLUE}Downloading SadTalker model checkpoints...${NC}"
    echo "This may take a while (several GB of data)..."

    mkdir -p checkpoints

    # Download from official sources
    if [ ! -f "checkpoints/SadTalker_V0.0.2_256.safetensors" ]; then
        echo "Downloading main model..."
        # Using HuggingFace mirror
        pip install huggingface_hub
        python -c "
from huggingface_hub import hf_hub_download
import os

# Download SadTalker checkpoints
files = [
    'SadTalker_V0.0.2_256.safetensors',
    'SadTalker_V0.0.2_512.safetensors',
    'mapping_00109-model.pth.tar',
    'mapping_00229-model.pth.tar',
]

for f in files:
    try:
        path = hf_hub_download(repo_id='vinthony/SadTalker', filename=f, local_dir='checkpoints')
        print(f'Downloaded: {f}')
    except Exception as e:
        print(f'Warning: Could not download {f}: {e}')
"
    else
        echo "Checkpoints already exist, skipping download."
    fi

    # Download face parsing model
    if [ ! -d "gfpgan/weights" ]; then
        echo "Downloading GFPGAN weights..."
        mkdir -p gfpgan/weights
        pip install gfpgan
        python -c "
from huggingface_hub import hf_hub_download
import os

files = ['detection_Resnet50_Final.pth', 'parsing_parsenet.pth']
for f in files:
    try:
        hf_hub_download(repo_id='vinthony/SadTalker', filename=f'gfpgan/weights/{f}', local_dir='.')
        print(f'Downloaded: {f}')
    except Exception as e:
        print(f'Warning: Could not download {f}: {e}')
"
    fi

    deactivate

    echo -e "${GREEN}✓ SadTalker installed successfully!${NC}"
}

# Install Wav2Lip
install_wav2lip() {
    echo -e "\n${BLUE}Installing Wav2Lip...${NC}"

    mkdir -p "$INSTALL_DIR"

    if [ -d "$WAV2LIP_DIR" ]; then
        echo -e "${YELLOW}Wav2Lip directory exists. Updating...${NC}"
        cd "$WAV2LIP_DIR"
        git pull
    else
        echo "Cloning Wav2Lip repository..."
        git clone https://github.com/Rudrabha/Wav2Lip.git "$WAV2LIP_DIR"
        cd "$WAV2LIP_DIR"
    fi

    # Create virtual environment
    echo "Setting up Python environment..."
    $PYTHON_CMD -m venv venv
    source venv/bin/activate

    # Install dependencies
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    pip install torch torchvision torchaudio
    pip install -r requirements.txt
    pip install opencv-python-headless

    # Download checkpoints
    echo -e "\n${BLUE}Downloading Wav2Lip model checkpoints...${NC}"

    mkdir -p checkpoints

    if [ ! -f "checkpoints/wav2lip.pth" ]; then
        echo "Downloading Wav2Lip model..."
        echo -e "${YELLOW}Note: You may need to manually download from:${NC}"
        echo "  https://github.com/Rudrabha/Wav2Lip#getting-the-weights"
        echo ""
        echo "Attempting automatic download..."

        # Try to download (may require manual download due to restrictions)
        pip install gdown
        python -c "
import gdown
import os

os.makedirs('checkpoints', exist_ok=True)

# Wav2Lip model
try:
    gdown.download(id='1c2s9SY0-dXHMmI89F3iNF-s0JWbhR_7j', output='checkpoints/wav2lip.pth', quiet=False)
    print('Downloaded wav2lip.pth')
except:
    print('Warning: Could not auto-download wav2lip.pth')
    print('Please download manually from the Wav2Lip GitHub releases')

# Wav2Lip GAN model (higher quality)
try:
    gdown.download(id='1LbozHoQLmJQi79M3R7cK9FxIJfRDKvnR', output='checkpoints/wav2lip_gan.pth', quiet=False)
    print('Downloaded wav2lip_gan.pth')
except:
    print('Warning: Could not auto-download wav2lip_gan.pth')
"
    else
        echo "Checkpoints already exist, skipping download."
    fi

    # Download face detection model
    if [ ! -f "face_detection/detection/sfd/s3fd.pth" ]; then
        echo "Downloading face detection model..."
        mkdir -p face_detection/detection/sfd
        python -c "
import gdown
gdown.download(id='1s6_QiH9L3lPjq99Gk6tEk7zXUJh5nM9l', output='face_detection/detection/sfd/s3fd.pth', quiet=False)
"
    fi

    deactivate

    echo -e "${GREEN}✓ Wav2Lip installed successfully!${NC}"
}

# Verify installation
verify_installation() {
    echo -e "\n${BLUE}Verifying installation...${NC}"

    SADTALKER_OK=false
    WAV2LIP_OK=false

    if [ -d "$SADTALKER_DIR" ]; then
        cd "$SADTALKER_DIR"
        if [ -f "checkpoints/SadTalker_V0.0.2_256.safetensors" ] || [ -f "checkpoints/SadTalker_V0.0.2_512.safetensors" ]; then
            echo -e "${GREEN}✓ SadTalker: Installed with models${NC}"
            SADTALKER_OK=true
        else
            echo -e "${YELLOW}! SadTalker: Installed but missing models${NC}"
        fi
    else
        echo -e "${RED}✗ SadTalker: Not installed${NC}"
    fi

    if [ -d "$WAV2LIP_DIR" ]; then
        cd "$WAV2LIP_DIR"
        if [ -f "checkpoints/wav2lip.pth" ] || [ -f "checkpoints/wav2lip_gan.pth" ]; then
            echo -e "${GREEN}✓ Wav2Lip: Installed with models${NC}"
            WAV2LIP_OK=true
        else
            echo -e "${YELLOW}! Wav2Lip: Installed but missing models${NC}"
        fi
    else
        echo -e "${RED}✗ Wav2Lip: Not installed${NC}"
    fi

    echo ""

    if $SADTALKER_OK || $WAV2LIP_OK; then
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║     Setup Complete! You can now use animated video mode.      ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"

        echo ""
        echo "Environment variables (add to your shell profile):"
        echo ""
        echo "  export SADTALKER_PATH=\"$SADTALKER_DIR\""
        echo "  export WAV2LIP_PATH=\"$WAV2LIP_DIR\""
    else
        echo -e "${RED}No backends were installed successfully.${NC}"
        echo "Please check the error messages above and try again."
        exit 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Select what to install:"
    echo "  1) SadTalker only (full head motion + lip sync, slower)"
    echo "  2) Wav2Lip only (lip sync only, faster)"
    echo "  3) Both (recommended)"
    echo "  4) Check status only"
    echo "  5) Exit"
    echo ""
    read -p "Enter your choice [1-5]: " choice

    case $choice in
        1)
            check_python
            check_gpu
            check_ffmpeg
            install_sadtalker
            verify_installation
            ;;
        2)
            check_python
            check_gpu
            check_ffmpeg
            install_wav2lip
            verify_installation
            ;;
        3)
            check_python
            check_gpu
            check_ffmpeg
            install_sadtalker
            install_wav2lip
            verify_installation
            ;;
        4)
            verify_installation
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please enter 1-5.${NC}"
            show_menu
            ;;
    esac
}

# Run
show_menu
