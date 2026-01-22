"""
═══════════════════════════════════════════════════════════════════════════════
 NEXUS-PRIME: Batch Render Script
 Render multiple .blend files with consistent settings
 
 Usage:
   blender --background --python batch_render.py -- --input /path/to/files --output /path/to/output
═══════════════════════════════════════════════════════════════════════════════
"""

import bpy
import os
import sys
import argparse
import json
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════════════
#  Configuration
# ═══════════════════════════════════════════════════════════════════════════════

RENDER_PRESETS = {
    'preview': {
        'engine': 'CYCLES',
        'samples': 64,
        'resolution_x': 1280,
        'resolution_y': 720,
        'resolution_percentage': 100,
        'file_format': 'PNG',
    },
    'production': {
        'engine': 'CYCLES',
        'samples': 256,
        'resolution_x': 1920,
        'resolution_y': 1080,
        'resolution_percentage': 100,
        'file_format': 'PNG',
    },
    'final': {
        'engine': 'CYCLES',
        'samples': 1024,
        'resolution_x': 3840,
        'resolution_y': 2160,
        'resolution_percentage': 100,
        'file_format': 'PNG',
    },
    'eevee_fast': {
        'engine': 'BLENDER_EEVEE_NEXT',
        'samples': 64,
        'resolution_x': 1920,
        'resolution_y': 1080,
        'resolution_percentage': 100,
        'file_format': 'PNG',
    },
}


# ═══════════════════════════════════════════════════════════════════════════════
#  Functions
# ═══════════════════════════════════════════════════════════════════════════════

def apply_render_settings(preset_name):
    """Apply render preset to current scene"""
    preset = RENDER_PRESETS.get(preset_name, RENDER_PRESETS['preview'])
    scene = bpy.context.scene
    
    scene.render.engine = preset['engine']
    scene.render.resolution_x = preset['resolution_x']
    scene.render.resolution_y = preset['resolution_y']
    scene.render.resolution_percentage = preset['resolution_percentage']
    scene.render.image_settings.file_format = preset['file_format']
    
    if preset['engine'] == 'CYCLES':
        scene.cycles.samples = preset['samples']
        scene.cycles.use_denoising = True
        scene.cycles.device = 'GPU'
    elif preset['engine'] == 'BLENDER_EEVEE_NEXT':
        scene.eevee.taa_render_samples = preset['samples']


def get_blend_files(input_path):
    """Get all .blend files from input path"""
    blend_files = []
    
    if os.path.isfile(input_path) and input_path.endswith('.blend'):
        blend_files.append(input_path)
    elif os.path.isdir(input_path):
        for root, dirs, files in os.walk(input_path):
            for file in files:
                if file.endswith('.blend'):
                    blend_files.append(os.path.join(root, file))
    
    return sorted(blend_files)


def render_file(blend_path, output_dir, preset_name, camera_name=None):
    """Render a single .blend file"""
    try:
        # Open file
        bpy.ops.wm.open_mainfile(filepath=blend_path)
        
        # Apply settings
        apply_render_settings(preset_name)
        
        # Set camera if specified
        if camera_name and camera_name in bpy.data.objects:
            bpy.context.scene.camera = bpy.data.objects[camera_name]
        
        # Set output path
        filename = os.path.splitext(os.path.basename(blend_path))[0]
        output_path = os.path.join(output_dir, f"{filename}.png")
        bpy.context.scene.render.filepath = output_path
        
        # Render
        bpy.ops.render.render(write_still=True)
        
        return {
            'status': 'success',
            'file': blend_path,
            'output': output_path,
        }
        
    except Exception as e:
        return {
            'status': 'error',
            'file': blend_path,
            'error': str(e),
        }


def batch_render(input_path, output_dir, preset_name='production', camera_name=None):
    """Batch render all .blend files"""
    blend_files = get_blend_files(input_path)
    
    if not blend_files:
        print(f"No .blend files found in: {input_path}")
        return []
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    total = len(blend_files)
    
    print(f"\n{'='*60}")
    print(f"  NEXUS-PRIME Batch Render")
    print(f"  Files: {total}")
    print(f"  Preset: {preset_name}")
    print(f"  Output: {output_dir}")
    print(f"{'='*60}\n")
    
    for i, blend_path in enumerate(blend_files, 1):
        print(f"[{i}/{total}] Rendering: {os.path.basename(blend_path)}")
        result = render_file(blend_path, output_dir, preset_name, camera_name)
        results.append(result)
        
        if result['status'] == 'success':
            print(f"  ✓ Complete: {result['output']}")
        else:
            print(f"  ✗ Error: {result['error']}")
    
    # Summary
    success = sum(1 for r in results if r['status'] == 'success')
    errors = sum(1 for r in results if r['status'] == 'error')
    
    print(f"\n{'='*60}")
    print(f"  Batch Complete")
    print(f"  Success: {success}/{total}")
    print(f"  Errors: {errors}/{total}")
    print(f"{'='*60}\n")
    
    return results


# ═══════════════════════════════════════════════════════════════════════════════
#  CLI Interface
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    # Get arguments after --
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []
    
    parser = argparse.ArgumentParser(description='NEXUS-PRIME Batch Render')
    parser.add_argument('--input', '-i', required=True, help='Input path (file or directory)')
    parser.add_argument('--output', '-o', required=True, help='Output directory')
    parser.add_argument('--preset', '-p', default='production', 
                        choices=list(RENDER_PRESETS.keys()),
                        help='Render preset')
    parser.add_argument('--camera', '-c', help='Camera name to use')
    parser.add_argument('--json', '-j', help='Output results to JSON file')
    
    args = parser.parse_args(argv)
    
    results = batch_render(
        input_path=args.input,
        output_dir=args.output,
        preset_name=args.preset,
        camera_name=args.camera,
    )
    
    # Save results to JSON if requested
    if args.json:
        with open(args.json, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'preset': args.preset,
                'results': results,
            }, f, indent=2)
        print(f"Results saved to: {args.json}")


if __name__ == "__main__":
    main()
