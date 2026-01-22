"""
═══════════════════════════════════════════════════════════════════════════════
 NEXUS-PRIME: Material Library
 PBR material generation and management for Blender
 
 Usage in Blender:
   exec(open('~/.nexus-prime/blender/scripts/material_library.py').read())
   create_material('Gold', 'metals')
═══════════════════════════════════════════════════════════════════════════════
"""

import bpy
from mathutils import Color

# ═══════════════════════════════════════════════════════════════════════════════
#  Material Presets Database
# ═══════════════════════════════════════════════════════════════════════════════

MATERIAL_PRESETS = {
    # ─────────────────────────────────────────────────────────────────────────────
    #  Metals
    # ─────────────────────────────────────────────────────────────────────────────
    'metals': {
        'gold': {
            'base_color': (1.0, 0.766, 0.336, 1.0),
            'metallic': 1.0,
            'roughness': 0.3,
            'specular': 0.5,
        },
        'silver': {
            'base_color': (0.972, 0.960, 0.915, 1.0),
            'metallic': 1.0,
            'roughness': 0.2,
            'specular': 0.5,
        },
        'copper': {
            'base_color': (0.955, 0.637, 0.538, 1.0),
            'metallic': 1.0,
            'roughness': 0.35,
            'specular': 0.5,
        },
        'brass': {
            'base_color': (0.887, 0.789, 0.434, 1.0),
            'metallic': 1.0,
            'roughness': 0.4,
            'specular': 0.5,
        },
        'bronze': {
            'base_color': (0.714, 0.428, 0.181, 1.0),
            'metallic': 1.0,
            'roughness': 0.45,
            'specular': 0.5,
        },
        'steel_polished': {
            'base_color': (0.56, 0.57, 0.58, 1.0),
            'metallic': 1.0,
            'roughness': 0.1,
            'specular': 0.5,
        },
        'steel_brushed': {
            'base_color': (0.56, 0.57, 0.58, 1.0),
            'metallic': 1.0,
            'roughness': 0.4,
            'specular': 0.5,
        },
        'aluminum': {
            'base_color': (0.913, 0.921, 0.925, 1.0),
            'metallic': 1.0,
            'roughness': 0.25,
            'specular': 0.5,
        },
        'chrome': {
            'base_color': (0.549, 0.556, 0.554, 1.0),
            'metallic': 1.0,
            'roughness': 0.05,
            'specular': 0.5,
        },
        'black_steel': {
            'base_color': (0.02, 0.02, 0.02, 1.0),
            'metallic': 0.9,
            'roughness': 0.4,
            'specular': 0.5,
        },
        'rust': {
            'base_color': (0.412, 0.216, 0.118, 1.0),
            'metallic': 0.3,
            'roughness': 0.8,
            'specular': 0.2,
        },
    },
    
    # ─────────────────────────────────────────────────────────────────────────────
    #  Wood
    # ─────────────────────────────────────────────────────────────────────────────
    'wood': {
        'oak': {
            'base_color': (0.55, 0.35, 0.2, 1.0),
            'metallic': 0.0,
            'roughness': 0.6,
            'specular': 0.3,
        },
        'walnut': {
            'base_color': (0.35, 0.22, 0.13, 1.0),
            'metallic': 0.0,
            'roughness': 0.55,
            'specular': 0.35,
        },
        'maple': {
            'base_color': (0.8, 0.65, 0.45, 1.0),
            'metallic': 0.0,
            'roughness': 0.5,
            'specular': 0.4,
        },
        'pine': {
            'base_color': (0.85, 0.7, 0.5, 1.0),
            'metallic': 0.0,
            'roughness': 0.65,
            'specular': 0.25,
        },
        'ebony': {
            'base_color': (0.08, 0.06, 0.05, 1.0),
            'metallic': 0.0,
            'roughness': 0.3,
            'specular': 0.5,
        },
        'bamboo': {
            'base_color': (0.85, 0.75, 0.55, 1.0),
            'metallic': 0.0,
            'roughness': 0.6,
            'specular': 0.3,
        },
        'teak': {
            'base_color': (0.5, 0.35, 0.2, 1.0),
            'metallic': 0.0,
            'roughness': 0.5,
            'specular': 0.35,
        },
        'plywood': {
            'base_color': (0.75, 0.6, 0.45, 1.0),
            'metallic': 0.0,
            'roughness': 0.7,
            'specular': 0.2,
        },
    },
    
    # ─────────────────────────────────────────────────────────────────────────────
    #  Stone
    # ─────────────────────────────────────────────────────────────────────────────
    'stone': {
        'marble_white': {
            'base_color': (0.95, 0.93, 0.9, 1.0),
            'metallic': 0.0,
            'roughness': 0.1,
            'specular': 0.8,
        },
        'marble_nero': {
            'base_color': (0.1, 0.1, 0.1, 1.0),
            'metallic': 0.0,
            'roughness': 0.15,
            'specular': 0.7,
        },
        'granite': {
            'base_color': (0.4, 0.4, 0.4, 1.0),
            'metallic': 0.0,
            'roughness': 0.4,
            'specular': 0.5,
        },
        'concrete': {
            'base_color': (0.5, 0.5, 0.5, 1.0),
            'metallic': 0.0,
            'roughness': 0.8,
            'specular': 0.1,
        },
        'polished_concrete': {
            'base_color': (0.55, 0.55, 0.55, 1.0),
            'metallic': 0.0,
            'roughness': 0.2,
            'specular': 0.5,
        },
        'brick': {
            'base_color': (0.6, 0.3, 0.2, 1.0),
            'metallic': 0.0,
            'roughness': 0.85,
            'specular': 0.1,
        },
        'slate': {
            'base_color': (0.25, 0.28, 0.3, 1.0),
            'metallic': 0.0,
            'roughness': 0.5,
            'specular': 0.3,
        },
        'limestone': {
            'base_color': (0.85, 0.82, 0.75, 1.0),
            'metallic': 0.0,
            'roughness': 0.6,
            'specular': 0.2,
        },
        'terrazzo': {
            'base_color': (0.8, 0.78, 0.75, 1.0),
            'metallic': 0.0,
            'roughness': 0.25,
            'specular': 0.5,
        },
    },
    
    # ─────────────────────────────────────────────────────────────────────────────
    #  Fabric
    # ─────────────────────────────────────────────────────────────────────────────
    'fabric': {
        'cotton_white': {
            'base_color': (0.95, 0.95, 0.95, 1.0),
            'metallic': 0.0,
            'roughness': 0.9,
            'specular': 0.05,
            'sheen': 0.5,
        },
        'linen': {
            'base_color': (0.9, 0.87, 0.8, 1.0),
            'metallic': 0.0,
            'roughness': 0.85,
            'specular': 0.1,
        },
        'velvet_blue': {
            'base_color': (0.1, 0.15, 0.35, 1.0),
            'metallic': 0.0,
            'roughness': 0.7,
            'specular': 0.2,
            'sheen': 1.0,
        },
        'velvet_red': {
            'base_color': (0.5, 0.1, 0.1, 1.0),
            'metallic': 0.0,
            'roughness': 0.7,
            'specular': 0.2,
            'sheen': 1.0,
        },
        'leather_brown': {
            'base_color': (0.35, 0.22, 0.15, 1.0),
            'metallic': 0.0,
            'roughness': 0.5,
            'specular': 0.4,
        },
        'leather_black': {
            'base_color': (0.05, 0.05, 0.05, 1.0),
            'metallic': 0.0,
            'roughness': 0.45,
            'specular': 0.5,
        },
        'silk': {
            'base_color': (0.9, 0.85, 0.8, 1.0),
            'metallic': 0.0,
            'roughness': 0.3,
            'specular': 0.6,
            'sheen': 0.8,
        },
        'denim': {
            'base_color': (0.2, 0.3, 0.5, 1.0),
            'metallic': 0.0,
            'roughness': 0.85,
            'specular': 0.1,
        },
    },
    
    # ─────────────────────────────────────────────────────────────────────────────
    #  Glass
    # ─────────────────────────────────────────────────────────────────────────────
    'glass': {
        'clear': {
            'base_color': (1.0, 1.0, 1.0, 1.0),
            'metallic': 0.0,
            'roughness': 0.0,
            'specular': 0.5,
            'transmission': 1.0,
            'ior': 1.45,
        },
        'frosted': {
            'base_color': (1.0, 1.0, 1.0, 1.0),
            'metallic': 0.0,
            'roughness': 0.3,
            'specular': 0.5,
            'transmission': 0.95,
            'ior': 1.45,
        },
        'tinted_gray': {
            'base_color': (0.3, 0.3, 0.3, 1.0),
            'metallic': 0.0,
            'roughness': 0.0,
            'specular': 0.5,
            'transmission': 0.9,
            'ior': 1.45,
        },
        'tinted_green': {
            'base_color': (0.6, 0.8, 0.65, 1.0),
            'metallic': 0.0,
            'roughness': 0.0,
            'specular': 0.5,
            'transmission': 0.85,
            'ior': 1.45,
        },
        'mirror': {
            'base_color': (0.9, 0.9, 0.9, 1.0),
            'metallic': 1.0,
            'roughness': 0.01,
            'specular': 1.0,
        },
    },
    
    # ─────────────────────────────────────────────────────────────────────────────
    #  Plastic
    # ─────────────────────────────────────────────────────────────────────────────
    'plastic': {
        'abs_white': {
            'base_color': (0.95, 0.95, 0.95, 1.0),
            'metallic': 0.0,
            'roughness': 0.4,
            'specular': 0.5,
        },
        'abs_black': {
            'base_color': (0.02, 0.02, 0.02, 1.0),
            'metallic': 0.0,
            'roughness': 0.4,
            'specular': 0.5,
        },
        'acrylic_clear': {
            'base_color': (1.0, 1.0, 1.0, 1.0),
            'metallic': 0.0,
            'roughness': 0.1,
            'specular': 0.5,
            'transmission': 0.95,
            'ior': 1.49,
        },
        'rubber': {
            'base_color': (0.1, 0.1, 0.1, 1.0),
            'metallic': 0.0,
            'roughness': 0.8,
            'specular': 0.2,
        },
        'silicone': {
            'base_color': (0.9, 0.9, 0.9, 1.0),
            'metallic': 0.0,
            'roughness': 0.6,
            'specular': 0.3,
            'subsurface': 0.2,
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════════════
#  Functions
# ═══════════════════════════════════════════════════════════════════════════════

def create_material(name, category='metals', preset_name=None):
    """
    Create a PBR material from the library
    
    Args:
        name: Material name
        category: Material category (metals, wood, stone, fabric, glass, plastic)
        preset_name: Preset name within category (optional, uses name if not provided)
    
    Returns:
        bpy.types.Material: Created material
    """
    preset_name = preset_name or name.lower().replace(' ', '_')
    
    if category not in MATERIAL_PRESETS:
        print(f"Unknown category: {category}")
        print(f"Available categories: {list(MATERIAL_PRESETS.keys())}")
        return None
    
    if preset_name not in MATERIAL_PRESETS[category]:
        print(f"Unknown preset: {preset_name} in {category}")
        print(f"Available presets: {list(MATERIAL_PRESETS[category].keys())}")
        return None
    
    preset = MATERIAL_PRESETS[category][preset_name]
    
    # Create material
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Get Principled BSDF
    principled = nodes.get('Principled BSDF')
    
    if principled:
        # Apply preset values
        principled.inputs['Base Color'].default_value = preset['base_color']
        principled.inputs['Metallic'].default_value = preset['metallic']
        principled.inputs['Roughness'].default_value = preset['roughness']
        principled.inputs['Specular IOR Level'].default_value = preset.get('specular', 0.5)
        
        # Optional properties
        if 'transmission' in preset:
            principled.inputs['Transmission Weight'].default_value = preset['transmission']
        if 'ior' in preset:
            principled.inputs['IOR'].default_value = preset['ior']
        if 'sheen' in preset:
            principled.inputs['Sheen Weight'].default_value = preset['sheen']
        if 'subsurface' in preset:
            principled.inputs['Subsurface Weight'].default_value = preset['subsurface']
    
    print(f"Created material: {name} ({category}/{preset_name})")
    return mat


def apply_material(obj_name, material_name):
    """Apply material to object by name"""
    if obj_name not in bpy.data.objects:
        print(f"Object not found: {obj_name}")
        return False
    
    if material_name not in bpy.data.materials:
        print(f"Material not found: {material_name}")
        return False
    
    obj = bpy.data.objects[obj_name]
    mat = bpy.data.materials[material_name]
    
    if obj.type != 'MESH':
        print(f"Object {obj_name} is not a mesh")
        return False
    
    if len(obj.data.materials) == 0:
        obj.data.materials.append(mat)
    else:
        obj.data.materials[0] = mat
    
    print(f"Applied {material_name} to {obj_name}")
    return True


def list_materials(category=None):
    """List available materials"""
    if category:
        if category in MATERIAL_PRESETS:
            print(f"\n{category.upper()} Materials:")
            for name in MATERIAL_PRESETS[category]:
                print(f"  - {name}")
        else:
            print(f"Unknown category: {category}")
    else:
        for cat, presets in MATERIAL_PRESETS.items():
            print(f"\n{cat.upper()}:")
            for name in presets:
                print(f"  - {name}")


def create_material_palette(palette_name, materials_list):
    """
    Create multiple materials at once
    
    Args:
        palette_name: Prefix for material names
        materials_list: List of (category, preset_name) tuples
    
    Returns:
        list: Created materials
    """
    created = []
    for category, preset in materials_list:
        mat_name = f"{palette_name}_{preset}"
        mat = create_material(mat_name, category, preset)
        if mat:
            created.append(mat)
    return created


# ═══════════════════════════════════════════════════════════════════════════════
#  Quick Access Functions
# ═══════════════════════════════════════════════════════════════════════════════

def metal(name, preset='steel_polished'):
    """Quick create metal material"""
    return create_material(name, 'metals', preset)

def wood(name, preset='oak'):
    """Quick create wood material"""
    return create_material(name, 'wood', preset)

def stone(name, preset='concrete'):
    """Quick create stone material"""
    return create_material(name, 'stone', preset)

def fabric(name, preset='cotton_white'):
    """Quick create fabric material"""
    return create_material(name, 'fabric', preset)

def glass(name, preset='clear'):
    """Quick create glass material"""
    return create_material(name, 'glass', preset)


# ═══════════════════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n" + "="*60)
    print("  NEXUS-PRIME Material Library")
    print("="*60)
    print("\nAvailable functions:")
    print("  - create_material(name, category, preset)")
    print("  - apply_material(obj_name, material_name)")
    print("  - list_materials(category=None)")
    print("  - create_material_palette(palette_name, materials_list)")
    print("\nQuick functions:")
    print("  - metal(name, preset)")
    print("  - wood(name, preset)")
    print("  - stone(name, preset)")
    print("  - fabric(name, preset)")
    print("  - glass(name, preset)")
    print("\nUse list_materials() to see all available presets")
