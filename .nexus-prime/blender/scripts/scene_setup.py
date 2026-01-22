"""
═══════════════════════════════════════════════════════════════════════════════
 NEXUS-PRIME: Scene Setup Script
 Quick scene configuration for various project types
 
 Usage in Blender:
   exec(open('~/.nexus-prime/blender/scripts/scene_setup.py').read())
   setup_scene('arch-viz')
═══════════════════════════════════════════════════════════════════════════════
"""

import bpy
import math
import os

# ═══════════════════════════════════════════════════════════════════════════════
#  Scene Presets
# ═══════════════════════════════════════════════════════════════════════════════

SCENE_PRESETS = {
    'arch-viz': {
        'description': 'Architectural visualization setup',
        'render_engine': 'CYCLES',
        'samples': 256,
        'resolution': (1920, 1080),
        'camera': {
            'location': (10, -10, 5),
            'rotation': (math.radians(70), 0, math.radians(45)),
            'lens': 24,
        },
        'lights': [
            {'type': 'SUN', 'energy': 3, 'location': (10, 10, 20), 'angle': math.radians(1)},
        ],
        'world': {
            'use_hdri': True,
            'hdri_strength': 0.8,
        },
        'collections': ['Architecture', 'Furniture', 'Lighting', 'Props'],
    },
    
    'product': {
        'description': 'Product photography setup',
        'render_engine': 'CYCLES',
        'samples': 512,
        'resolution': (2048, 2048),
        'camera': {
            'location': (3, -3, 2),
            'rotation': (math.radians(65), 0, math.radians(45)),
            'lens': 85,
        },
        'lights': [
            {'type': 'AREA', 'energy': 200, 'location': (2, -2, 3), 'size': 2},
            {'type': 'AREA', 'energy': 100, 'location': (-2, -1, 2), 'size': 1},
            {'type': 'AREA', 'energy': 50, 'location': (0, 2, 1), 'size': 1.5},
        ],
        'world': {
            'color': (0.05, 0.05, 0.05),
        },
        'collections': ['Product', 'Lighting', 'Background'],
    },
    
    'character': {
        'description': 'Character modeling/animation setup',
        'render_engine': 'CYCLES',
        'samples': 128,
        'resolution': (1920, 1080),
        'camera': {
            'location': (0, -5, 1.5),
            'rotation': (math.radians(90), 0, 0),
            'lens': 50,
        },
        'lights': [
            {'type': 'AREA', 'energy': 100, 'location': (2, -3, 3), 'size': 2},
            {'type': 'AREA', 'energy': 50, 'location': (-2, -2, 2), 'size': 1.5},
        ],
        'world': {
            'color': (0.3, 0.3, 0.3),
        },
        'collections': ['Character', 'Props', 'Environment'],
    },
    
    'motion': {
        'description': 'Motion graphics setup',
        'render_engine': 'BLENDER_EEVEE_NEXT',
        'samples': 64,
        'resolution': (1920, 1080),
        'frame_rate': 30,
        'camera': {
            'location': (0, -10, 0),
            'rotation': (math.radians(90), 0, 0),
            'lens': 35,
        },
        'lights': [
            {'type': 'POINT', 'energy': 500, 'location': (3, -3, 5)},
        ],
        'world': {
            'color': (0.0, 0.0, 0.0),
        },
        'collections': ['Graphics', 'Text', 'Background'],
    },
    
    'vfx': {
        'description': 'Visual effects setup',
        'render_engine': 'CYCLES',
        'samples': 256,
        'resolution': (1920, 1080),
        'film_transparent': True,
        'camera': {
            'location': (0, -10, 2),
            'rotation': (math.radians(80), 0, 0),
            'lens': 35,
        },
        'lights': [],
        'world': {
            'use_hdri': True,
        },
        'collections': ['FX_Elements', 'Simulation', 'Camera'],
    },
}


# ═══════════════════════════════════════════════════════════════════════════════
#  Functions
# ═══════════════════════════════════════════════════════════════════════════════

def clear_scene():
    """Clear all objects from scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    # Remove orphan data
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)
    for block in bpy.data.cameras:
        if block.users == 0:
            bpy.data.cameras.remove(block)
    for block in bpy.data.lights:
        if block.users == 0:
            bpy.data.lights.remove(block)


def create_collections(collection_names):
    """Create organized collections"""
    for name in collection_names:
        if name not in bpy.data.collections:
            collection = bpy.data.collections.new(name)
            bpy.context.scene.collection.children.link(collection)


def setup_camera(config):
    """Set up camera with config"""
    bpy.ops.object.camera_add(location=config['location'])
    camera = bpy.context.active_object
    camera.name = 'Main_Camera'
    camera.rotation_euler = config['rotation']
    camera.data.lens = config['lens']
    bpy.context.scene.camera = camera
    return camera


def setup_lights(lights_config):
    """Set up lights from config"""
    created_lights = []
    
    for i, light_config in enumerate(lights_config):
        bpy.ops.object.light_add(
            type=light_config['type'],
            location=light_config['location']
        )
        light = bpy.context.active_object
        light.name = f"Light_{i+1}"
        light.data.energy = light_config['energy']
        
        if light_config['type'] == 'AREA' and 'size' in light_config:
            light.data.size = light_config['size']
        if light_config['type'] == 'SUN' and 'angle' in light_config:
            light.data.angle = light_config['angle']
        
        created_lights.append(light)
    
    return created_lights


def setup_world(world_config):
    """Configure world settings"""
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    
    world.use_nodes = True
    nodes = world.node_tree.nodes
    
    if world_config.get('use_hdri'):
        # Set up for HDRI (user needs to load their own)
        bg_node = nodes.get('Background')
        if bg_node:
            bg_node.inputs['Strength'].default_value = world_config.get('hdri_strength', 1.0)
    elif 'color' in world_config:
        bg_node = nodes.get('Background')
        if bg_node:
            bg_node.inputs['Color'].default_value = (*world_config['color'], 1.0)


def setup_render_settings(preset):
    """Configure render settings"""
    scene = bpy.context.scene
    
    scene.render.engine = preset['render_engine']
    scene.render.resolution_x = preset['resolution'][0]
    scene.render.resolution_y = preset['resolution'][1]
    scene.render.resolution_percentage = 100
    
    if preset['render_engine'] == 'CYCLES':
        scene.cycles.samples = preset['samples']
        scene.cycles.use_denoising = True
        scene.cycles.device = 'GPU'
    elif preset['render_engine'] == 'BLENDER_EEVEE_NEXT':
        scene.eevee.taa_render_samples = preset['samples']
    
    if preset.get('film_transparent'):
        scene.render.film_transparent = True
    
    if 'frame_rate' in preset:
        scene.render.fps = preset['frame_rate']


def setup_scene(preset_name, clear=True):
    """
    Set up scene with preset configuration
    
    Args:
        preset_name: Name of preset (arch-viz, product, character, motion, vfx)
        clear: Whether to clear existing objects
    
    Returns:
        dict: Created objects
    """
    if preset_name not in SCENE_PRESETS:
        print(f"Unknown preset: {preset_name}")
        print(f"Available presets: {list(SCENE_PRESETS.keys())}")
        return None
    
    preset = SCENE_PRESETS[preset_name]
    
    print(f"\n{'='*60}")
    print(f"  NEXUS-PRIME Scene Setup")
    print(f"  Preset: {preset_name}")
    print(f"  Description: {preset['description']}")
    print(f"{'='*60}\n")
    
    if clear:
        print("Clearing scene...")
        clear_scene()
    
    # Create collections
    print("Creating collections...")
    create_collections(preset['collections'])
    
    # Setup render settings
    print("Configuring render settings...")
    setup_render_settings(preset)
    
    # Setup camera
    print("Setting up camera...")
    camera = setup_camera(preset['camera'])
    
    # Setup lights
    print("Setting up lights...")
    lights = setup_lights(preset['lights'])
    
    # Setup world
    print("Configuring world...")
    setup_world(preset['world'])
    
    print(f"\n{'='*60}")
    print(f"  Scene setup complete!")
    print(f"  Engine: {preset['render_engine']}")
    print(f"  Resolution: {preset['resolution'][0]}x{preset['resolution'][1]}")
    print(f"{'='*60}\n")
    
    return {
        'camera': camera,
        'lights': lights,
        'collections': preset['collections'],
    }


def list_presets():
    """List available scene presets"""
    print("\nAvailable Scene Presets:")
    print("-" * 40)
    for name, preset in SCENE_PRESETS.items():
        print(f"  {name}: {preset['description']}")


# ═══════════════════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n" + "="*60)
    print("  NEXUS-PRIME Scene Setup")
    print("="*60)
    print("\nUsage:")
    print("  setup_scene('arch-viz')  # Architectural visualization")
    print("  setup_scene('product')   # Product photography")
    print("  setup_scene('character') # Character work")
    print("  setup_scene('motion')    # Motion graphics")
    print("  setup_scene('vfx')       # Visual effects")
    print("\nUse list_presets() to see all available presets")
    list_presets()
