"""
═══════════════════════════════════════════════════════════════════════════════
 NEXUS-PRIME: Commercial Space Generator for Blender
 Interior Design Master Team | SPATIAL-GURU + RENDER-MASTER Collaboration

 Usage in Blender:
   exec(open('/Users/seg/.nexus-prime/blender/interior_design/commercial_space_generator.py').read())
   generate_commercial_space(space_type='gallery', width=20, depth=15, height=4)
═══════════════════════════════════════════════════════════════════════════════
"""

import bpy
import bmesh
import math
import random
from mathutils import Vector, Matrix

# ═══════════════════════════════════════════════════════════════════════════════
#  Configuration Presets
# ═══════════════════════════════════════════════════════════════════════════════

SPACE_PRESETS = {
    'gallery': {
        'ceiling_height': 4.0,
        'wall_color': (0.95, 0.95, 0.95, 1.0),
        'floor_material': 'polished_concrete',
        'lighting_style': 'track',
        'style': 'minimal',
        'features': ['pedestals', 'benches', 'track_lighting']
    },
    'retail': {
        'ceiling_height': 3.5,
        'wall_color': (1.0, 1.0, 1.0, 1.0),
        'floor_material': 'wood_oak',
        'lighting_style': 'mixed',
        'style': 'modern',
        'features': ['display_tables', 'shelving', 'checkout']
    },
    'restaurant': {
        'ceiling_height': 3.2,
        'wall_color': (0.15, 0.12, 0.10, 1.0),
        'floor_material': 'herringbone_wood',
        'lighting_style': 'pendant',
        'style': 'warm',
        'features': ['tables', 'bar', 'booths']
    },
    'office': {
        'ceiling_height': 2.8,
        'wall_color': (0.98, 0.98, 0.98, 1.0),
        'floor_material': 'carpet_tile',
        'lighting_style': 'panel',
        'style': 'corporate',
        'features': ['desks', 'meeting_tables', 'collaboration']
    },
    'hotel_lobby': {
        'ceiling_height': 5.0,
        'wall_color': (0.92, 0.90, 0.85, 1.0),
        'floor_material': 'marble',
        'lighting_style': 'chandelier',
        'style': 'luxury',
        'features': ['reception', 'seating_groups', 'art']
    },
    'showroom': {
        'ceiling_height': 4.5,
        'wall_color': (0.1, 0.1, 0.1, 1.0),
        'floor_material': 'epoxy_gloss',
        'lighting_style': 'dramatic',
        'style': 'high_contrast',
        'features': ['platforms', 'spotlights', 'pedestals']
    }
}

MATERIAL_PRESETS = {
    'polished_concrete': {
        'base_color': (0.5, 0.5, 0.5, 1.0),
        'metalness': 0.0,
        'roughness': 0.2,
        'specular': 0.5
    },
    'wood_oak': {
        'base_color': (0.55, 0.35, 0.2, 1.0),
        'metalness': 0.0,
        'roughness': 0.6,
        'specular': 0.3
    },
    'herringbone_wood': {
        'base_color': (0.45, 0.28, 0.15, 1.0),
        'metalness': 0.0,
        'roughness': 0.5,
        'specular': 0.4
    },
    'carpet_tile': {
        'base_color': (0.3, 0.32, 0.35, 1.0),
        'metalness': 0.0,
        'roughness': 0.95,
        'specular': 0.05
    },
    'marble': {
        'base_color': (0.95, 0.93, 0.9, 1.0),
        'metalness': 0.0,
        'roughness': 0.1,
        'specular': 0.8
    },
    'epoxy_gloss': {
        'base_color': (0.08, 0.08, 0.08, 1.0),
        'metalness': 0.0,
        'roughness': 0.05,
        'specular': 0.9
    },
    'white_wall': {
        'base_color': (0.95, 0.95, 0.95, 1.0),
        'metalness': 0.0,
        'roughness': 0.8,
        'specular': 0.1
    },
    'brass': {
        'base_color': (0.83, 0.69, 0.22, 1.0),
        'metalness': 1.0,
        'roughness': 0.35,
        'specular': 0.5
    },
    'black_steel': {
        'base_color': (0.02, 0.02, 0.02, 1.0),
        'metalness': 0.9,
        'roughness': 0.4,
        'specular': 0.5
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
#  Utility Functions
# ═══════════════════════════════════════════════════════════════════════════════

def clear_scene():
    """Clear all objects from scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Clear orphan data
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)

def create_collection(name):
    """Create and return a collection"""
    if name in bpy.data.collections:
        return bpy.data.collections[name]
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection

def create_pbr_material(name, preset_name):
    """Create a PBR material from preset"""
    if name in bpy.data.materials:
        return bpy.data.materials[name]

    preset = MATERIAL_PRESETS.get(preset_name, MATERIAL_PRESETS['white_wall'])

    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (400, 0)

    principled = nodes.new('ShaderNodeBsdfPrincipled')
    principled.location = (0, 0)

    # Set values
    principled.inputs['Base Color'].default_value = preset['base_color']
    principled.inputs['Metallic'].default_value = preset['metalness']
    principled.inputs['Roughness'].default_value = preset['roughness']
    principled.inputs['Specular IOR Level'].default_value = preset['specular']

    links.new(principled.outputs['BSDF'], output.inputs['Surface'])

    return mat

# ═══════════════════════════════════════════════════════════════════════════════
#  Geometry Generators
# ═══════════════════════════════════════════════════════════════════════════════

def create_floor(width, depth, material_name='polished_concrete', collection=None):
    """Create floor plane with material"""
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.name = 'Floor'
    floor.scale = (width, depth, 1)
    bpy.ops.object.transform_apply(scale=True)

    # Apply material
    mat = create_pbr_material(f'Floor_{material_name}', material_name)
    floor.data.materials.append(mat)

    # Enable shadow receiving
    floor.cycles.is_shadow_catcher = False

    if collection:
        bpy.context.scene.collection.objects.unlink(floor)
        collection.objects.link(floor)

    return floor

def create_walls(width, depth, height, wall_color, collection=None):
    """Create four walls"""
    walls = []
    wall_thickness = 0.15

    wall_configs = [
        {'name': 'Wall_North', 'pos': (0, depth/2, height/2), 'scale': (width + wall_thickness*2, wall_thickness, height)},
        {'name': 'Wall_South', 'pos': (0, -depth/2, height/2), 'scale': (width + wall_thickness*2, wall_thickness, height)},
        {'name': 'Wall_East', 'pos': (width/2, 0, height/2), 'scale': (wall_thickness, depth, height)},
        {'name': 'Wall_West', 'pos': (-width/2, 0, height/2), 'scale': (wall_thickness, depth, height)},
    ]

    mat = create_pbr_material('Wall_Material', 'white_wall')

    for config in wall_configs:
        bpy.ops.mesh.primitive_cube_add(size=1, location=config['pos'])
        wall = bpy.context.active_object
        wall.name = config['name']
        wall.scale = config['scale']
        bpy.ops.object.transform_apply(scale=True)
        wall.data.materials.append(mat)
        walls.append(wall)

        if collection:
            bpy.context.scene.collection.objects.unlink(wall)
            collection.objects.link(wall)

    return walls

def create_ceiling(width, depth, height, collection=None):
    """Create ceiling plane"""
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, height))
    ceiling = bpy.context.active_object
    ceiling.name = 'Ceiling'
    ceiling.scale = (width, depth, 1)
    bpy.ops.object.transform_apply(scale=True)

    mat = create_pbr_material('Ceiling_Material', 'white_wall')
    ceiling.data.materials.append(mat)

    if collection:
        bpy.context.scene.collection.objects.unlink(ceiling)
        collection.objects.link(ceiling)

    return ceiling

# ═══════════════════════════════════════════════════════════════════════════════
#  Furniture & Fixture Generators
# ═══════════════════════════════════════════════════════════════════════════════

def create_pedestal(location, size='medium', style='modern', collection=None):
    """Create display pedestal"""
    sizes = {
        'small': (0.4, 0.4, 0.8),
        'medium': (0.6, 0.6, 1.0),
        'large': (0.8, 0.8, 1.2)
    }

    dims = sizes.get(size, sizes['medium'])

    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], dims[2]/2))
    pedestal = bpy.context.active_object
    pedestal.name = f'Pedestal_{location[0]:.1f}_{location[1]:.1f}'
    pedestal.scale = dims
    bpy.ops.object.transform_apply(scale=True)

    # Bevel edges for modern look
    bpy.ops.object.modifier_add(type='BEVEL')
    pedestal.modifiers['Bevel'].width = 0.02
    pedestal.modifiers['Bevel'].segments = 3
    bpy.ops.object.modifier_apply(modifier='Bevel')

    mat = create_pbr_material('Pedestal_Material', 'white_wall')
    pedestal.data.materials.append(mat)

    if collection:
        bpy.context.scene.collection.objects.unlink(pedestal)
        collection.objects.link(pedestal)

    return pedestal

def create_bench(location, rotation=0, collection=None):
    """Create gallery bench"""
    # Bench seat
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], 0.45))
    seat = bpy.context.active_object
    seat.name = f'Bench_{location[0]:.1f}_{location[1]:.1f}'
    seat.scale = (1.5, 0.5, 0.08)
    seat.rotation_euler.z = math.radians(rotation)
    bpy.ops.object.transform_apply(scale=True, rotation=True)

    mat = create_pbr_material('Bench_Material', 'wood_oak')
    seat.data.materials.append(mat)

    # Legs
    leg_mat = create_pbr_material('Bench_Legs', 'black_steel')
    leg_positions = [(-0.6, 0), (0.6, 0)]

    for lp in leg_positions:
        bpy.ops.mesh.primitive_cube_add(size=1)
        leg = bpy.context.active_object
        leg.name = f'Bench_Leg'
        leg.scale = (0.05, 0.4, 0.4)
        leg.location = (location[0] + lp[0], location[1] + lp[1], 0.2)
        leg.rotation_euler.z = math.radians(rotation)
        bpy.ops.object.transform_apply(scale=True, rotation=True)
        leg.data.materials.append(leg_mat)

        if collection:
            bpy.context.scene.collection.objects.unlink(leg)
            collection.objects.link(leg)

    if collection:
        bpy.context.scene.collection.objects.unlink(seat)
        collection.objects.link(seat)

    return seat

def create_art_frame(location, wall='north', size='medium', collection=None):
    """Create wall-mounted art frame"""
    sizes = {
        'small': (0.6, 0.8),
        'medium': (1.0, 1.2),
        'large': (1.5, 1.8),
        'panoramic': (2.0, 1.0)
    }

    dims = sizes.get(size, sizes['medium'])
    frame_depth = 0.05

    # Position based on wall
    if wall == 'north':
        pos = (location[0], location[1] - frame_depth/2, location[2])
        rot = (math.pi/2, 0, 0)
    elif wall == 'south':
        pos = (location[0], location[1] + frame_depth/2, location[2])
        rot = (-math.pi/2, 0, math.pi)
    elif wall == 'east':
        pos = (location[0] - frame_depth/2, location[1], location[2])
        rot = (0, math.pi/2, -math.pi/2)
    else:  # west
        pos = (location[0] + frame_depth/2, location[1], location[2])
        rot = (0, -math.pi/2, math.pi/2)

    # Frame
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    frame = bpy.context.active_object
    frame.name = f'ArtFrame_{wall}_{location[0]:.1f}'
    frame.scale = (dims[0], dims[1], frame_depth)
    frame.rotation_euler = rot
    bpy.ops.object.transform_apply(scale=True, rotation=True)

    mat = create_pbr_material('Frame_Material', 'black_steel')
    frame.data.materials.append(mat)

    if collection:
        bpy.context.scene.collection.objects.unlink(frame)
        collection.objects.link(frame)

    return frame

# ═══════════════════════════════════════════════════════════════════════════════
#  Lighting Systems
# ═══════════════════════════════════════════════════════════════════════════════

def create_track_lighting(width, depth, height, count=6, collection=None):
    """Create track lighting system for galleries"""
    lights = []
    track_y_positions = [-depth/4, depth/4]

    for track_y in track_y_positions:
        # Track rail
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, track_y, height - 0.1))
        track = bpy.context.active_object
        track.name = f'Track_Rail_{track_y:.1f}'
        track.scale = (width * 0.8, 0.05, 0.05)
        bpy.ops.object.transform_apply(scale=True)

        mat = create_pbr_material('Track_Material', 'black_steel')
        track.data.materials.append(mat)

        if collection:
            bpy.context.scene.collection.objects.unlink(track)
            collection.objects.link(track)

        # Spotlights on track
        spots_per_track = count // 2
        for i in range(spots_per_track):
            x_pos = -width * 0.35 + (width * 0.7 / (spots_per_track - 1)) * i

            bpy.ops.object.light_add(type='SPOT', location=(x_pos, track_y, height - 0.15))
            light = bpy.context.active_object
            light.name = f'Spot_{track_y:.1f}_{i}'
            light.data.energy = 500
            light.data.spot_size = math.radians(45)
            light.data.spot_blend = 0.5
            light.data.color = (1.0, 0.95, 0.9)  # Warm white
            light.rotation_euler = (math.radians(15), 0, 0)

            lights.append(light)

            if collection:
                bpy.context.scene.collection.objects.unlink(light)
                collection.objects.link(light)

    return lights

def create_pendant_lighting(width, depth, height, count=4, collection=None):
    """Create pendant/chandelier lighting for hospitality"""
    lights = []

    grid = int(math.sqrt(count))
    spacing_x = width * 0.6 / grid
    spacing_y = depth * 0.6 / grid

    for i in range(grid):
        for j in range(grid):
            x = -width * 0.3 + spacing_x * i + spacing_x/2
            y = -depth * 0.3 + spacing_y * j + spacing_y/2

            # Pendant fixture
            bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=0.2, location=(x, y, height - 0.5))
            fixture = bpy.context.active_object
            fixture.name = f'Pendant_Fixture_{i}_{j}'

            mat = create_pbr_material('Pendant_Material', 'brass')
            fixture.data.materials.append(mat)

            # Light
            bpy.ops.object.light_add(type='POINT', location=(x, y, height - 0.6))
            light = bpy.context.active_object
            light.name = f'Pendant_Light_{i}_{j}'
            light.data.energy = 300
            light.data.color = (1.0, 0.9, 0.8)  # Warm

            lights.append(light)

            if collection:
                bpy.context.scene.collection.objects.unlink(fixture)
                collection.objects.link(fixture)
                bpy.context.scene.collection.objects.unlink(light)
                collection.objects.link(light)

    return lights

def create_ambient_lighting(height, collection=None):
    """Create ambient/environment lighting"""
    # Sun light for fill
    bpy.ops.object.light_add(type='SUN', location=(0, 0, height + 5))
    sun = bpy.context.active_object
    sun.name = 'Ambient_Sun'
    sun.data.energy = 0.5
    sun.data.color = (1.0, 0.98, 0.95)
    sun.rotation_euler = (math.radians(45), 0, math.radians(30))

    if collection:
        bpy.context.scene.collection.objects.unlink(sun)
        collection.objects.link(sun)

    return sun

# ═══════════════════════════════════════════════════════════════════════════════
#  Main Generator Functions
# ═══════════════════════════════════════════════════════════════════════════════

def generate_commercial_space(
    space_type='gallery',
    width=15,
    depth=12,
    height=None,
    clear_existing=True,
    add_furniture=True,
    add_lighting=True
):
    """
    Main function to generate a commercial interior space

    Args:
        space_type: 'gallery', 'retail', 'restaurant', 'office', 'hotel_lobby', 'showroom'
        width: Room width in meters
        depth: Room depth in meters
        height: Ceiling height (auto from preset if None)
        clear_existing: Clear scene before generating
        add_furniture: Add furniture/fixtures
        add_lighting: Add lighting system

    Returns:
        Dictionary with all created objects
    """

    print(f"\n{'='*60}")
    print(f"  NEXUS-PRIME: Commercial Space Generator")
    print(f"  Space Type: {space_type.upper()}")
    print(f"  Dimensions: {width}m x {depth}m")
    print(f"{'='*60}\n")

    # Get preset
    preset = SPACE_PRESETS.get(space_type, SPACE_PRESETS['gallery'])

    if height is None:
        height = preset['ceiling_height']

    # Clear scene
    if clear_existing:
        clear_scene()

    # Create collections
    arch_collection = create_collection('Architecture')
    furniture_collection = create_collection('Furniture')
    lighting_collection = create_collection('Lighting')

    created_objects = {
        'architecture': [],
        'furniture': [],
        'lighting': []
    }

    # Architecture
    print("Creating architecture...")
    floor = create_floor(width, depth, preset['floor_material'], arch_collection)
    walls = create_walls(width, depth, height, preset['wall_color'], arch_collection)
    ceiling = create_ceiling(width, depth, height, arch_collection)

    created_objects['architecture'] = [floor, ceiling] + walls

    # Furniture based on space type
    if add_furniture:
        print("Adding furniture and fixtures...")

        if space_type == 'gallery':
            # Pedestals
            pedestal_positions = [
                (-width/4, 0), (width/4, 0), (0, -depth/4), (0, depth/4)
            ]
            for pos in pedestal_positions:
                p = create_pedestal(pos, 'medium', 'modern', furniture_collection)
                created_objects['furniture'].append(p)

            # Benches
            bench = create_bench((0, 0), 0, furniture_collection)
            created_objects['furniture'].append(bench)

            # Art frames on walls
            frame_positions = [
                ((0, depth/2 - 0.08, height * 0.55), 'north'),
                ((-width/3, depth/2 - 0.08, height * 0.55), 'north'),
                ((width/3, depth/2 - 0.08, height * 0.55), 'north'),
            ]
            for pos, wall in frame_positions:
                f = create_art_frame(pos, wall, 'medium', furniture_collection)
                created_objects['furniture'].append(f)

        elif space_type == 'retail':
            # Display tables
            table_positions = [(-width/4, -depth/4), (width/4, -depth/4), (0, depth/4)]
            for pos in table_positions:
                p = create_pedestal(pos, 'large', 'modern', furniture_collection)
                created_objects['furniture'].append(p)

        elif space_type == 'showroom':
            # Dramatic pedestals
            pedestal_positions = [(0, 0), (-width/3, 0), (width/3, 0)]
            for pos in pedestal_positions:
                p = create_pedestal(pos, 'large', 'modern', furniture_collection)
                created_objects['furniture'].append(p)

    # Lighting
    if add_lighting:
        print("Setting up lighting...")

        # Ambient
        ambient = create_ambient_lighting(height, lighting_collection)
        created_objects['lighting'].append(ambient)

        # Type-specific lighting
        if preset['lighting_style'] == 'track':
            lights = create_track_lighting(width, depth, height, 8, lighting_collection)
            created_objects['lighting'].extend(lights)

        elif preset['lighting_style'] == 'pendant':
            lights = create_pendant_lighting(width, depth, height, 4, lighting_collection)
            created_objects['lighting'].extend(lights)

        elif preset['lighting_style'] == 'dramatic':
            lights = create_track_lighting(width, depth, height, 12, lighting_collection)
            created_objects['lighting'].extend(lights)

    # Set up camera
    print("Setting up camera...")
    bpy.ops.object.camera_add(location=(0, -depth * 0.8, height * 0.6))
    camera = bpy.context.active_object
    camera.name = 'Main_Camera'
    camera.rotation_euler = (math.radians(75), 0, 0)
    bpy.context.scene.camera = camera

    # Render settings
    print("Configuring render settings...")
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.samples = 128
    bpy.context.scene.render.resolution_x = 1920
    bpy.context.scene.render.resolution_y = 1080

    print(f"\n{'='*60}")
    print(f"  Generation Complete!")
    print(f"  Objects created: {sum(len(v) for v in created_objects.values())}")
    print(f"{'='*60}\n")

    return created_objects

def generate_gallery_space(width=20, depth=15, height=4.5):
    """Quick generator for art gallery spaces"""
    return generate_commercial_space('gallery', width, depth, height)

def generate_retail_space(width=15, depth=12, height=3.5):
    """Quick generator for retail spaces"""
    return generate_commercial_space('retail', width, depth, height)

def generate_restaurant_space(width=18, depth=14, height=3.2):
    """Quick generator for restaurant spaces"""
    return generate_commercial_space('restaurant', width, depth, height)

def generate_showroom_space(width=25, depth=20, height=5):
    """Quick generator for showroom spaces"""
    return generate_commercial_space('showroom', width, depth, height)

# ═══════════════════════════════════════════════════════════════════════════════
#  CLI Interface
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    """Main entry point - generates a sample gallery space"""
    print("\n" + "="*60)
    print("  NEXUS-PRIME: Commercial Space Generator")
    print("  Interior Design Master Team")
    print("="*60)
    print("\nAvailable functions:")
    print("  - generate_commercial_space(space_type, width, depth, height)")
    print("  - generate_gallery_space(width, depth, height)")
    print("  - generate_retail_space(width, depth, height)")
    print("  - generate_restaurant_space(width, depth, height)")
    print("  - generate_showroom_space(width, depth, height)")
    print("\nSpace types: gallery, retail, restaurant, office, hotel_lobby, showroom")
    print("\nGenerating sample gallery space...\n")

    return generate_gallery_space(20, 15, 4.5)

# Run if executed directly
if __name__ == "__main__":
    main()
