#!/usr/bin/env python3
"""
NEXUS-PRIME Interior Design - Gallery Space Generator
Generates a sample art gallery space and saves to .blend file
"""

import bpy
import math
import os

# Clear existing objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Clear existing materials
for material in bpy.data.materials:
    bpy.data.materials.remove(material)

# ═══════════════════════════════════════════════════════════════════════════════
# MATERIAL CREATION
# ═══════════════════════════════════════════════════════════════════════════════

def create_material(name, base_color, metallic=0.0, roughness=0.5, emission=None):
    """Create a PBR material"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (400, 0)

    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)

    # Set values
    bsdf.inputs['Base Color'].default_value = (*base_color, 1.0)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness

    if emission:
        bsdf.inputs['Emission Color'].default_value = (*emission, 1.0)
        bsdf.inputs['Emission Strength'].default_value = 5.0

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat

# Create materials
mat_floor = create_material("Gallery_Floor", (0.9, 0.88, 0.85), roughness=0.2)  # Polished concrete
mat_wall = create_material("Gallery_Wall", (0.98, 0.98, 0.98), roughness=0.9)  # Matte white
mat_ceiling = create_material("Gallery_Ceiling", (0.95, 0.95, 0.95), roughness=0.8)
mat_pedestal = create_material("Pedestal", (1.0, 1.0, 1.0), roughness=0.3)
mat_bench = create_material("Bench_Wood", (0.4, 0.3, 0.2), roughness=0.6)
mat_bench_leather = create_material("Bench_Leather", (0.1, 0.1, 0.1), roughness=0.5)
mat_frame = create_material("Frame_Black", (0.02, 0.02, 0.02), roughness=0.4)
mat_brass = create_material("Brass", (0.83, 0.69, 0.22), metallic=1.0, roughness=0.35)
mat_track = create_material("Track_Black", (0.05, 0.05, 0.05), metallic=0.8, roughness=0.3)

# Art materials (colored canvases for sample artworks)
mat_art_1 = create_material("Art_Blue", (0.1, 0.3, 0.6), roughness=0.8)
mat_art_2 = create_material("Art_Red", (0.7, 0.15, 0.1), roughness=0.8)
mat_art_3 = create_material("Art_Gold", (0.8, 0.65, 0.2), roughness=0.7)
mat_art_4 = create_material("Art_Green", (0.2, 0.5, 0.3), roughness=0.8)
mat_art_5 = create_material("Art_Purple", (0.4, 0.2, 0.5), roughness=0.8)
mat_art_6 = create_material("Art_Teal", (0.1, 0.5, 0.5), roughness=0.8)

# ═══════════════════════════════════════════════════════════════════════════════
# GALLERY DIMENSIONS
# ═══════════════════════════════════════════════════════════════════════════════

WIDTH = 20.0   # meters
DEPTH = 15.0   # meters
HEIGHT = 5.0   # meters
WALL_THICKNESS = 0.3

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE FLOOR
# ═══════════════════════════════════════════════════════════════════════════════

bpy.ops.mesh.primitive_plane_add(size=1, location=(WIDTH/2, DEPTH/2, 0))
floor = bpy.context.active_object
floor.name = "Gallery_Floor"
floor.scale = (WIDTH, DEPTH, 1)
floor.data.materials.append(mat_floor)

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE WALLS
# ═══════════════════════════════════════════════════════════════════════════════

def create_wall(name, location, scale):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    wall = bpy.context.active_object
    wall.name = name
    wall.scale = scale
    wall.data.materials.append(mat_wall)
    return wall

# Back wall
create_wall("Wall_Back", (WIDTH/2, DEPTH, HEIGHT/2), (WIDTH, WALL_THICKNESS, HEIGHT))

# Front wall with entrance opening
create_wall("Wall_Front_Left", (WIDTH*0.25, 0, HEIGHT/2), (WIDTH*0.4, WALL_THICKNESS, HEIGHT))
create_wall("Wall_Front_Right", (WIDTH*0.75, 0, HEIGHT/2), (WIDTH*0.4, WALL_THICKNESS, HEIGHT))

# Side walls
create_wall("Wall_Left", (0, DEPTH/2, HEIGHT/2), (WALL_THICKNESS, DEPTH, HEIGHT))
create_wall("Wall_Right", (WIDTH, DEPTH/2, HEIGHT/2), (WALL_THICKNESS, DEPTH, HEIGHT))

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE CEILING
# ═══════════════════════════════════════════════════════════════════════════════

bpy.ops.mesh.primitive_plane_add(size=1, location=(WIDTH/2, DEPTH/2, HEIGHT))
ceiling = bpy.context.active_object
ceiling.name = "Gallery_Ceiling"
ceiling.scale = (WIDTH, DEPTH, 1)
ceiling.rotation_euler = (math.pi, 0, 0)
ceiling.data.materials.append(mat_ceiling)

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE ART FRAMES ON WALLS
# ═══════════════════════════════════════════════════════════════════════════════

def create_artwork(name, location, rotation, size, art_material):
    """Create a framed artwork"""
    frame_depth = 0.05
    frame_width = 0.08

    # Frame
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    frame = bpy.context.active_object
    frame.name = f"Frame_{name}"
    frame.scale = (size[0] + frame_width*2, frame_depth, size[1] + frame_width*2)
    frame.rotation_euler = rotation
    frame.data.materials.append(mat_frame)

    # Canvas (artwork)
    canvas_loc = list(location)
    if rotation[2] == 0:  # Back wall
        canvas_loc[1] -= 0.02
    elif rotation[2] == math.pi/2:  # Left wall
        canvas_loc[0] += 0.02
    elif rotation[2] == -math.pi/2:  # Right wall
        canvas_loc[0] -= 0.02

    bpy.ops.mesh.primitive_plane_add(size=1, location=canvas_loc)
    canvas = bpy.context.active_object
    canvas.name = f"Art_{name}"
    canvas.scale = (size[0], size[1], 1)
    canvas.rotation_euler = (math.pi/2, 0, rotation[2])
    canvas.data.materials.append(art_material)

    return frame, canvas

# Back wall artworks
create_artwork("Piece_1", (4, DEPTH - 0.2, 2.5), (math.pi/2, 0, 0), (2.0, 1.5), mat_art_1)
create_artwork("Piece_2", (10, DEPTH - 0.2, 2.5), (math.pi/2, 0, 0), (2.5, 2.0), mat_art_2)
create_artwork("Piece_3", (16, DEPTH - 0.2, 2.5), (math.pi/2, 0, 0), (1.8, 2.2), mat_art_3)

# Left wall artworks
create_artwork("Piece_4", (0.2, 4, 2.5), (math.pi/2, 0, math.pi/2), (1.5, 1.5), mat_art_4)
create_artwork("Piece_5", (0.2, 10, 2.5), (math.pi/2, 0, math.pi/2), (2.0, 1.8), mat_art_5)

# Right wall artworks
create_artwork("Piece_6", (WIDTH - 0.2, 5, 2.5), (math.pi/2, 0, -math.pi/2), (2.2, 1.6), mat_art_6)
create_artwork("Piece_7", (WIDTH - 0.2, 11, 2.5), (math.pi/2, 0, -math.pi/2), (1.8, 2.0), mat_art_1)

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE PEDESTALS FOR SCULPTURES
# ═══════════════════════════════════════════════════════════════════════════════

def create_pedestal(name, location, height=1.0, width=0.6):
    """Create a display pedestal"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], height/2))
    pedestal = bpy.context.active_object
    pedestal.name = f"Pedestal_{name}"
    pedestal.scale = (width, width, height)
    pedestal.data.materials.append(mat_pedestal)

    # Add a brass accent ring at top
    bpy.ops.mesh.primitive_torus_add(
        major_radius=width/2 + 0.02,
        minor_radius=0.015,
        location=(location[0], location[1], height)
    )
    ring = bpy.context.active_object
    ring.name = f"Pedestal_Ring_{name}"
    ring.data.materials.append(mat_brass)

    return pedestal

# Create pedestals in center of gallery
create_pedestal("Center_1", (7, 7), height=1.1, width=0.5)
create_pedestal("Center_2", (13, 7), height=0.9, width=0.6)
create_pedestal("Center_3", (10, 11), height=1.0, width=0.55)

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE GALLERY BENCHES
# ═══════════════════════════════════════════════════════════════════════════════

def create_bench(name, location, rotation=0):
    """Create a gallery viewing bench"""
    bench_length = 2.0
    bench_width = 0.5
    bench_height = 0.45

    # Seat
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], bench_height))
    seat = bpy.context.active_object
    seat.name = f"Bench_Seat_{name}"
    seat.scale = (bench_length, bench_width, 0.08)
    seat.rotation_euler = (0, 0, rotation)
    seat.data.materials.append(mat_bench_leather)

    # Legs
    leg_positions = [
        (-bench_length/2 + 0.1, -bench_width/2 + 0.1),
        (-bench_length/2 + 0.1, bench_width/2 - 0.1),
        (bench_length/2 - 0.1, -bench_width/2 + 0.1),
        (bench_length/2 - 0.1, bench_width/2 - 0.1),
    ]

    for i, (lx, ly) in enumerate(leg_positions):
        # Rotate leg positions
        rx = lx * math.cos(rotation) - ly * math.sin(rotation)
        ry = lx * math.sin(rotation) + ly * math.cos(rotation)

        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=(location[0] + rx, location[1] + ry, bench_height/2)
        )
        leg = bpy.context.active_object
        leg.name = f"Bench_Leg_{name}_{i}"
        leg.scale = (0.05, 0.05, bench_height)
        leg.data.materials.append(mat_bench)

    return seat

# Create benches for viewing
create_bench("Center", (10, 5), rotation=0)
create_bench("Left", (3, 7), rotation=math.pi/2)

# ═══════════════════════════════════════════════════════════════════════════════
# CREATE TRACK LIGHTING
# ═══════════════════════════════════════════════════════════════════════════════

def create_track_light(name, location, target_location):
    """Create a track light fixture with spot light"""
    # Track rail segment
    bpy.ops.mesh.primitive_cube_add(size=1, location=(location[0], location[1], HEIGHT - 0.1))
    track = bpy.context.active_object
    track.name = f"Track_{name}"
    track.scale = (0.8, 0.05, 0.05)
    track.data.materials.append(mat_track)

    # Light housing
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.08,
        depth=0.15,
        location=(location[0], location[1], HEIGHT - 0.25)
    )
    housing = bpy.context.active_object
    housing.name = f"Light_Housing_{name}"
    housing.data.materials.append(mat_track)

    # Actual light
    bpy.ops.object.light_add(
        type='SPOT',
        location=(location[0], location[1], HEIGHT - 0.35)
    )
    light = bpy.context.active_object
    light.name = f"Spotlight_{name}"
    light.data.energy = 500
    light.data.spot_size = math.radians(45)
    light.data.spot_blend = 0.5
    light.data.color = (1.0, 0.95, 0.9)  # Warm white (4000K approx)

    # Point light at target
    direction = (
        target_location[0] - location[0],
        target_location[1] - location[1],
        target_location[2] - (HEIGHT - 0.35)
    )
    light.rotation_euler = (
        math.atan2(math.sqrt(direction[0]**2 + direction[1]**2), -direction[2]),
        0,
        math.atan2(direction[0], direction[1])
    )

    return light

# Create track lights for each artwork
# Back wall
create_track_light("Art_1", (4, DEPTH - 2), (4, DEPTH - 0.2, 2.5))
create_track_light("Art_2", (10, DEPTH - 2), (10, DEPTH - 0.2, 2.5))
create_track_light("Art_3", (16, DEPTH - 2), (16, DEPTH - 0.2, 2.5))

# Left wall
create_track_light("Art_4", (2, 4), (0.2, 4, 2.5))
create_track_light("Art_5", (2, 10), (0.2, 10, 2.5))

# Right wall
create_track_light("Art_6", (WIDTH - 2, 5), (WIDTH - 0.2, 5, 2.5))
create_track_light("Art_7", (WIDTH - 2, 11), (WIDTH - 0.2, 11, 2.5))

# Pedestal lights
create_track_light("Ped_1", (7, 5), (7, 7, 1.1))
create_track_light("Ped_2", (13, 5), (13, 7, 0.9))
create_track_light("Ped_3", (10, 9), (10, 11, 1.0))

# ═══════════════════════════════════════════════════════════════════════════════
# ADD AMBIENT LIGHTING
# ═══════════════════════════════════════════════════════════════════════════════

# Add soft ambient light from above
bpy.ops.object.light_add(type='AREA', location=(WIDTH/2, DEPTH/2, HEIGHT - 0.5))
ambient = bpy.context.active_object
ambient.name = "Ambient_Light"
ambient.data.energy = 200
ambient.data.size = WIDTH * 0.8
ambient.data.color = (1.0, 0.98, 0.95)

# ═══════════════════════════════════════════════════════════════════════════════
# SETUP CAMERA
# ═══════════════════════════════════════════════════════════════════════════════

# Main gallery view camera
bpy.ops.object.camera_add(location=(WIDTH/2, -2, 2.0))
camera = bpy.context.active_object
camera.name = "Camera_Main"
camera.rotation_euler = (math.radians(80), 0, 0)
camera.data.lens = 24  # Wide angle for interior

# Set as active camera
bpy.context.scene.camera = camera

# ═══════════════════════════════════════════════════════════════════════════════
# RENDER SETTINGS
# ═══════════════════════════════════════════════════════════════════════════════

# Set render engine to Cycles for quality
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 256
bpy.context.scene.cycles.use_denoising = True

# Set resolution
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.resolution_percentage = 100

# Set output path
output_dir = os.path.expanduser("~/.nexus-prime/blender/interior_design/output")
os.makedirs(output_dir, exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════════
# ORGANIZE COLLECTIONS
# ═══════════════════════════════════════════════════════════════════════════════

# Create collections
def get_or_create_collection(name):
    if name in bpy.data.collections:
        return bpy.data.collections[name]
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection

col_structure = get_or_create_collection("Structure")
col_artwork = get_or_create_collection("Artwork")
col_furniture = get_or_create_collection("Furniture")
col_lighting = get_or_create_collection("Lighting")

# Move objects to collections
for obj in bpy.data.objects:
    try:
        if obj.name.startswith(("Wall_", "Gallery_Floor", "Gallery_Ceiling")):
            if obj.name not in col_structure.objects:
                col_structure.objects.link(obj)
                if obj.name in bpy.context.scene.collection.objects:
                    bpy.context.scene.collection.objects.unlink(obj)
        elif obj.name.startswith(("Frame_", "Art_")):
            if obj.name not in col_artwork.objects:
                col_artwork.objects.link(obj)
                if obj.name in bpy.context.scene.collection.objects:
                    bpy.context.scene.collection.objects.unlink(obj)
        elif obj.name.startswith(("Pedestal_", "Bench_")):
            if obj.name not in col_furniture.objects:
                col_furniture.objects.link(obj)
                if obj.name in bpy.context.scene.collection.objects:
                    bpy.context.scene.collection.objects.unlink(obj)
        elif obj.name.startswith(("Track_", "Light_", "Spotlight_", "Ambient_")):
            if obj.name not in col_lighting.objects:
                col_lighting.objects.link(obj)
                if obj.name in bpy.context.scene.collection.objects:
                    bpy.context.scene.collection.objects.unlink(obj)
    except Exception as e:
        print(f"Note: Could not organize {obj.name}: {e}")

# ═══════════════════════════════════════════════════════════════════════════════
# SAVE FILE
# ═══════════════════════════════════════════════════════════════════════════════

save_path = os.path.expanduser("~/.nexus-prime/blender/interior_design/output/sample_gallery.blend")
bpy.ops.wm.save_as_mainfile(filepath=save_path)

print("=" * 60)
print("NEXUS-PRIME Interior Design - Gallery Generated Successfully!")
print("=" * 60)
print(f"Saved to: {save_path}")
print(f"Dimensions: {WIDTH}m x {DEPTH}m x {HEIGHT}m")
print("Features:")
print("  - 7 framed artworks on walls")
print("  - 3 display pedestals")
print("  - 2 viewing benches")
print("  - 10 track spotlights")
print("  - Ambient ceiling lighting")
print("  - PBR materials configured")
print("  - Camera positioned for main view")
print("=" * 60)
