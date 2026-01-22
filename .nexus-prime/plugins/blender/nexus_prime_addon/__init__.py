# NEXUS-PRIME Blender Add-on
# Integrates Claude AI assistance directly into Blender

bl_info = {
    "name": "NEXUS-PRIME AI Assistant",
    "author": "NEXUS-PRIME Team",
    "version": (1, 0, 0),
    "blender": (4, 0, 0),
    "location": "View3D > Sidebar > NEXUS",
    "description": "AI-powered assistant for Blender workflows",
    "category": "3D View",
}

import bpy
import json
import os
import subprocess
from bpy.props import (
    StringProperty,
    EnumProperty,
    BoolProperty,
    IntProperty,
    FloatProperty,
    FloatVectorProperty,
    PointerProperty,
)
from bpy.types import (
    Panel,
    Operator,
    PropertyGroup,
    AddonPreferences,
)


# ============================================================
# PROPERTY GROUPS
# ============================================================

class NexusSceneSettings(PropertyGroup):
    """Scene-level settings for NEXUS-PRIME"""
    
    project_type: EnumProperty(
        name="Project Type",
        items=[
            ('ARCH_VIZ', "Arch-Viz", "Architectural visualization"),
            ('PRODUCT', "Product", "Product visualization"),
            ('CHARACTER', "Character", "Character/creature work"),
            ('MOTION', "Motion Graphics", "Motion graphics and animation"),
            ('VFX', "VFX", "Visual effects and simulation"),
            ('GAME', "Game Assets", "Game-ready assets"),
        ],
        default='PRODUCT'
    )
    
    render_engine: EnumProperty(
        name="Render Engine",
        items=[
            ('CYCLES', "Cycles", "Path tracing renderer"),
            ('EEVEE', "Eevee", "Real-time renderer"),
        ],
        default='CYCLES'
    )
    
    export_format: EnumProperty(
        name="Export Format",
        items=[
            ('GLTF', "glTF 2.0", "Web and game-ready format"),
            ('FBX', "FBX", "Industry standard exchange"),
            ('USD', "USD", "Universal Scene Description"),
            ('OBJ', "OBJ", "Legacy format"),
        ],
        default='GLTF'
    )
    
    ai_prompt: StringProperty(
        name="AI Prompt",
        description="Describe what you want to create",
        default=""
    )
    
    material_preset: EnumProperty(
        name="Material Preset",
        items=[
            ('METAL_BRUSHED', "Brushed Metal", "Brushed aluminum/steel"),
            ('METAL_POLISHED', "Polished Metal", "Chrome/mirror finish"),
            ('WOOD_OAK', "Oak Wood", "Natural oak grain"),
            ('WOOD_WALNUT', "Walnut Wood", "Dark walnut grain"),
            ('FABRIC_COTTON', "Cotton Fabric", "Soft cotton texture"),
            ('FABRIC_VELVET', "Velvet Fabric", "Luxurious velvet"),
            ('GLASS_CLEAR', "Clear Glass", "Transparent glass"),
            ('GLASS_FROSTED', "Frosted Glass", "Diffuse glass"),
            ('CONCRETE', "Concrete", "Raw concrete"),
            ('MARBLE', "Marble", "White marble with veins"),
            ('PLASTIC_MATTE', "Matte Plastic", "Matte polymer"),
            ('PLASTIC_GLOSSY', "Glossy Plastic", "Shiny polymer"),
            ('LEATHER', "Leather", "Natural leather"),
            ('CERAMIC', "Ceramic", "Glazed ceramic"),
            ('RUBBER', "Rubber", "Soft rubber"),
        ],
        default='METAL_BRUSHED'
    )


class NexusAddonPreferences(AddonPreferences):
    """Add-on preferences"""
    bl_idname = __name__
    
    nexus_path: StringProperty(
        name="NEXUS-PRIME Path",
        description="Path to NEXUS-PRIME installation",
        default=os.path.expanduser("~/.nexus-prime"),
        subtype='DIR_PATH'
    )
    
    auto_save: BoolProperty(
        name="Auto-save Before Render",
        description="Automatically save file before rendering",
        default=True
    )
    
    render_output: StringProperty(
        name="Default Render Output",
        description="Default output directory for renders",
        default="//renders/",
        subtype='DIR_PATH'
    )
    
    def draw(self, context):
        layout = self.layout
        layout.prop(self, "nexus_path")
        layout.prop(self, "auto_save")
        layout.prop(self, "render_output")


# ============================================================
# OPERATORS
# ============================================================

class NEXUS_OT_setup_scene(Operator):
    """Set up scene based on project type"""
    bl_idname = "nexus.setup_scene"
    bl_label = "Setup Scene"
    bl_options = {'REGISTER', 'UNDO'}
    
    def execute(self, context):
        settings = context.scene.nexus_settings
        project_type = settings.project_type
        
        # Clear existing objects (optional)
        # bpy.ops.object.select_all(action='SELECT')
        # bpy.ops.object.delete()
        
        # Set render engine
        context.scene.render.engine = 'CYCLES' if settings.render_engine == 'CYCLES' else 'BLENDER_EEVEE_NEXT'
        
        # Configure based on project type
        if project_type == 'ARCH_VIZ':
            self.setup_arch_viz(context)
        elif project_type == 'PRODUCT':
            self.setup_product(context)
        elif project_type == 'CHARACTER':
            self.setup_character(context)
        elif project_type == 'MOTION':
            self.setup_motion(context)
        elif project_type == 'VFX':
            self.setup_vfx(context)
        elif project_type == 'GAME':
            self.setup_game(context)
        
        self.report({'INFO'}, f"Scene configured for {project_type}")
        return {'FINISHED'}
    
    def setup_arch_viz(self, context):
        """Architecture visualization setup"""
        context.scene.render.resolution_x = 3840
        context.scene.render.resolution_y = 2160
        context.scene.cycles.samples = 512
        context.scene.view_settings.view_transform = 'Filmic'
        context.scene.view_settings.look = 'High Contrast'
        
    def setup_product(self, context):
        """Product visualization setup"""
        context.scene.render.resolution_x = 2048
        context.scene.render.resolution_y = 2048
        context.scene.cycles.samples = 256
        context.scene.render.film_transparent = True
        
    def setup_character(self, context):
        """Character work setup"""
        context.scene.render.resolution_x = 1920
        context.scene.render.resolution_y = 1080
        context.scene.cycles.samples = 128
        
    def setup_motion(self, context):
        """Motion graphics setup"""
        context.scene.render.resolution_x = 1920
        context.scene.render.resolution_y = 1080
        context.scene.render.fps = 60
        context.scene.frame_end = 300
        
    def setup_vfx(self, context):
        """VFX setup"""
        context.scene.render.resolution_x = 1920
        context.scene.render.resolution_y = 1080
        context.scene.cycles.samples = 256
        context.scene.render.use_motion_blur = True
        
    def setup_game(self, context):
        """Game asset setup"""
        context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
        context.scene.render.resolution_x = 1024
        context.scene.render.resolution_y = 1024


class NEXUS_OT_apply_material(Operator):
    """Apply material preset to selected objects"""
    bl_idname = "nexus.apply_material"
    bl_label = "Apply Material"
    bl_options = {'REGISTER', 'UNDO'}
    
    def execute(self, context):
        settings = context.scene.nexus_settings
        preset = settings.material_preset
        
        if not context.selected_objects:
            self.report({'WARNING'}, "No objects selected")
            return {'CANCELLED'}
        
        # Create material
        mat = self.create_material(preset)
        
        # Apply to selected objects
        for obj in context.selected_objects:
            if obj.type == 'MESH':
                if obj.data.materials:
                    obj.data.materials[0] = mat
                else:
                    obj.data.materials.append(mat)
        
        self.report({'INFO'}, f"Applied {preset} material")
        return {'FINISHED'}
    
    def create_material(self, preset):
        """Create PBR material based on preset"""
        mat_name = f"NEXUS_{preset}"
        
        # Check if material exists
        if mat_name in bpy.data.materials:
            return bpy.data.materials[mat_name]
        
        # Create new material
        mat = bpy.data.materials.new(name=mat_name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        
        # Clear default nodes
        nodes.clear()
        
        # Create Principled BSDF
        bsdf = nodes.new('ShaderNodeBsdfPrincipled')
        bsdf.location = (0, 0)
        
        # Create Output
        output = nodes.new('ShaderNodeOutputMaterial')
        output.location = (300, 0)
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
        
        # Configure based on preset
        presets = {
            'METAL_BRUSHED': {'Base Color': (0.8, 0.8, 0.8, 1), 'Metallic': 1.0, 'Roughness': 0.4},
            'METAL_POLISHED': {'Base Color': (0.9, 0.9, 0.9, 1), 'Metallic': 1.0, 'Roughness': 0.05},
            'WOOD_OAK': {'Base Color': (0.4, 0.26, 0.13, 1), 'Metallic': 0.0, 'Roughness': 0.5},
            'WOOD_WALNUT': {'Base Color': (0.25, 0.15, 0.08, 1), 'Metallic': 0.0, 'Roughness': 0.4},
            'FABRIC_COTTON': {'Base Color': (0.9, 0.9, 0.88, 1), 'Metallic': 0.0, 'Roughness': 0.9},
            'FABRIC_VELVET': {'Base Color': (0.3, 0.1, 0.15, 1), 'Metallic': 0.0, 'Roughness': 0.95},
            'GLASS_CLEAR': {'Base Color': (1, 1, 1, 1), 'Metallic': 0.0, 'Roughness': 0.0, 'Transmission': 1.0},
            'GLASS_FROSTED': {'Base Color': (1, 1, 1, 1), 'Metallic': 0.0, 'Roughness': 0.3, 'Transmission': 1.0},
            'CONCRETE': {'Base Color': (0.5, 0.5, 0.5, 1), 'Metallic': 0.0, 'Roughness': 0.8},
            'MARBLE': {'Base Color': (0.95, 0.95, 0.93, 1), 'Metallic': 0.0, 'Roughness': 0.2},
            'PLASTIC_MATTE': {'Base Color': (0.2, 0.2, 0.2, 1), 'Metallic': 0.0, 'Roughness': 0.5},
            'PLASTIC_GLOSSY': {'Base Color': (0.1, 0.1, 0.1, 1), 'Metallic': 0.0, 'Roughness': 0.1},
            'LEATHER': {'Base Color': (0.15, 0.08, 0.05, 1), 'Metallic': 0.0, 'Roughness': 0.6},
            'CERAMIC': {'Base Color': (0.9, 0.9, 0.88, 1), 'Metallic': 0.0, 'Roughness': 0.15},
            'RUBBER': {'Base Color': (0.05, 0.05, 0.05, 1), 'Metallic': 0.0, 'Roughness': 0.7},
        }
        
        if preset in presets:
            for key, value in presets[preset].items():
                if key == 'Base Color':
                    bsdf.inputs['Base Color'].default_value = value
                elif key == 'Metallic':
                    bsdf.inputs['Metallic'].default_value = value
                elif key == 'Roughness':
                    bsdf.inputs['Roughness'].default_value = value
                elif key == 'Transmission':
                    bsdf.inputs['Transmission Weight'].default_value = value
        
        return mat


class NEXUS_OT_quick_render(Operator):
    """Quick render with optimized settings"""
    bl_idname = "nexus.quick_render"
    bl_label = "Quick Render"
    
    def execute(self, context):
        prefs = context.preferences.addons[__name__].preferences
        
        # Auto-save if enabled
        if prefs.auto_save and bpy.data.filepath:
            bpy.ops.wm.save_mainfile()
        
        # Set output path
        if prefs.render_output:
            context.scene.render.filepath = prefs.render_output
        
        # Render
        bpy.ops.render.render('INVOKE_DEFAULT', write_still=True)
        
        return {'FINISHED'}


class NEXUS_OT_export_asset(Operator):
    """Export selected objects in chosen format"""
    bl_idname = "nexus.export_asset"
    bl_label = "Export Asset"
    
    def execute(self, context):
        settings = context.scene.nexus_settings
        export_format = settings.export_format
        
        if not context.selected_objects:
            self.report({'WARNING'}, "No objects selected")
            return {'CANCELLED'}
        
        # Get export path
        filepath = bpy.data.filepath
        if filepath:
            export_dir = os.path.dirname(filepath)
            export_name = os.path.splitext(os.path.basename(filepath))[0]
        else:
            export_dir = os.path.expanduser("~/Desktop")
            export_name = "nexus_export"
        
        # Export based on format
        if export_format == 'GLTF':
            export_path = os.path.join(export_dir, f"{export_name}.glb")
            bpy.ops.export_scene.gltf(
                filepath=export_path,
                use_selection=True,
                export_format='GLB'
            )
        elif export_format == 'FBX':
            export_path = os.path.join(export_dir, f"{export_name}.fbx")
            bpy.ops.export_scene.fbx(
                filepath=export_path,
                use_selection=True
            )
        elif export_format == 'USD':
            export_path = os.path.join(export_dir, f"{export_name}.usd")
            bpy.ops.wm.usd_export(
                filepath=export_path,
                selected_objects_only=True
            )
        elif export_format == 'OBJ':
            export_path = os.path.join(export_dir, f"{export_name}.obj")
            bpy.ops.wm.obj_export(
                filepath=export_path,
                export_selected_objects=True
            )
        
        self.report({'INFO'}, f"Exported to {export_path}")
        return {'FINISHED'}


class NEXUS_OT_add_studio_lighting(Operator):
    """Add professional studio lighting setup"""
    bl_idname = "nexus.add_studio_lighting"
    bl_label = "Add Studio Lighting"
    bl_options = {'REGISTER', 'UNDO'}
    
    def execute(self, context):
        # Create collection for lights
        if "NEXUS_Lights" not in bpy.data.collections:
            light_collection = bpy.data.collections.new("NEXUS_Lights")
            context.scene.collection.children.link(light_collection)
        else:
            light_collection = bpy.data.collections["NEXUS_Lights"]
        
        # Key light
        key_data = bpy.data.lights.new(name="NEXUS_Key", type='AREA')
        key_data.energy = 1000
        key_data.size = 2
        key_obj = bpy.data.objects.new("NEXUS_Key", key_data)
        key_obj.location = (4, -4, 5)
        key_obj.rotation_euler = (0.8, 0, 0.8)
        light_collection.objects.link(key_obj)
        
        # Fill light
        fill_data = bpy.data.lights.new(name="NEXUS_Fill", type='AREA')
        fill_data.energy = 400
        fill_data.size = 3
        fill_obj = bpy.data.objects.new("NEXUS_Fill", fill_data)
        fill_obj.location = (-5, -3, 3)
        fill_obj.rotation_euler = (1.0, 0, -0.8)
        light_collection.objects.link(fill_obj)
        
        # Rim light
        rim_data = bpy.data.lights.new(name="NEXUS_Rim", type='AREA')
        rim_data.energy = 600
        rim_data.size = 1.5
        rim_obj = bpy.data.objects.new("NEXUS_Rim", rim_data)
        rim_obj.location = (0, 5, 4)
        rim_obj.rotation_euler = (-2.0, 0, 3.14)
        light_collection.objects.link(rim_obj)
        
        self.report({'INFO'}, "Studio lighting added")
        return {'FINISHED'}


class NEXUS_OT_add_hdri(Operator):
    """Add HDRI environment lighting"""
    bl_idname = "nexus.add_hdri"
    bl_label = "Add HDRI"
    bl_options = {'REGISTER', 'UNDO'}
    
    filepath: StringProperty(subtype='FILE_PATH')
    
    def invoke(self, context, event):
        context.window_manager.fileselect_add(self)
        return {'RUNNING_MODAL'}
    
    def execute(self, context):
        if not self.filepath or not os.path.exists(self.filepath):
            self.report({'ERROR'}, "Invalid HDRI file path")
            return {'CANCELLED'}
        
        # Enable world nodes
        world = context.scene.world
        if not world:
            world = bpy.data.worlds.new("NEXUS_World")
            context.scene.world = world
        
        world.use_nodes = True
        nodes = world.node_tree.nodes
        links = world.node_tree.links
        
        # Clear existing nodes
        nodes.clear()
        
        # Create nodes
        env_tex = nodes.new('ShaderNodeTexEnvironment')
        env_tex.location = (-300, 0)
        env_tex.image = bpy.data.images.load(self.filepath)
        
        mapping = nodes.new('ShaderNodeMapping')
        mapping.location = (-500, 0)
        
        tex_coord = nodes.new('ShaderNodeTexCoord')
        tex_coord.location = (-700, 0)
        
        background = nodes.new('ShaderNodeBackground')
        background.location = (0, 0)
        
        output = nodes.new('ShaderNodeOutputWorld')
        output.location = (200, 0)
        
        # Connect nodes
        links.new(tex_coord.outputs['Generated'], mapping.inputs['Vector'])
        links.new(mapping.outputs['Vector'], env_tex.inputs['Vector'])
        links.new(env_tex.outputs['Color'], background.inputs['Color'])
        links.new(background.outputs['Background'], output.inputs['Surface'])
        
        self.report({'INFO'}, f"HDRI loaded: {os.path.basename(self.filepath)}")
        return {'FINISHED'}


# ============================================================
# PANELS
# ============================================================

class NEXUS_PT_main_panel(Panel):
    """Main NEXUS-PRIME panel"""
    bl_label = "NEXUS-PRIME"
    bl_idname = "NEXUS_PT_main"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'NEXUS'
    
    def draw(self, context):
        layout = self.layout
        settings = context.scene.nexus_settings
        
        # Header
        box = layout.box()
        row = box.row()
        row.label(text="AI-Powered Blender Assistant", icon='GHOST_ENABLED')
        
        # Project Setup
        layout.label(text="Project Setup:", icon='SCENE_DATA')
        layout.prop(settings, "project_type")
        layout.prop(settings, "render_engine")
        layout.operator("nexus.setup_scene", icon='SETTINGS')
        
        layout.separator()


class NEXUS_PT_materials_panel(Panel):
    """Materials panel"""
    bl_label = "Materials"
    bl_idname = "NEXUS_PT_materials"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'NEXUS'
    bl_parent_id = "NEXUS_PT_main"
    bl_options = {'DEFAULT_CLOSED'}
    
    def draw(self, context):
        layout = self.layout
        settings = context.scene.nexus_settings
        
        layout.prop(settings, "material_preset")
        layout.operator("nexus.apply_material", icon='MATERIAL')


class NEXUS_PT_lighting_panel(Panel):
    """Lighting panel"""
    bl_label = "Lighting"
    bl_idname = "NEXUS_PT_lighting"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'NEXUS'
    bl_parent_id = "NEXUS_PT_main"
    bl_options = {'DEFAULT_CLOSED'}
    
    def draw(self, context):
        layout = self.layout
        
        layout.operator("nexus.add_studio_lighting", icon='LIGHT_AREA')
        layout.operator("nexus.add_hdri", icon='WORLD')


class NEXUS_PT_export_panel(Panel):
    """Export panel"""
    bl_label = "Export"
    bl_idname = "NEXUS_PT_export"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'NEXUS'
    bl_parent_id = "NEXUS_PT_main"
    bl_options = {'DEFAULT_CLOSED'}
    
    def draw(self, context):
        layout = self.layout
        settings = context.scene.nexus_settings
        
        layout.prop(settings, "export_format")
        layout.operator("nexus.export_asset", icon='EXPORT')


class NEXUS_PT_render_panel(Panel):
    """Render panel"""
    bl_label = "Render"
    bl_idname = "NEXUS_PT_render"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'NEXUS'
    bl_parent_id = "NEXUS_PT_main"
    bl_options = {'DEFAULT_CLOSED'}
    
    def draw(self, context):
        layout = self.layout
        
        layout.operator("nexus.quick_render", icon='RENDER_STILL')


# ============================================================
# REGISTRATION
# ============================================================

classes = (
    NexusSceneSettings,
    NexusAddonPreferences,
    NEXUS_OT_setup_scene,
    NEXUS_OT_apply_material,
    NEXUS_OT_quick_render,
    NEXUS_OT_export_asset,
    NEXUS_OT_add_studio_lighting,
    NEXUS_OT_add_hdri,
    NEXUS_PT_main_panel,
    NEXUS_PT_materials_panel,
    NEXUS_PT_lighting_panel,
    NEXUS_PT_export_panel,
    NEXUS_PT_render_panel,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    
    bpy.types.Scene.nexus_settings = PointerProperty(type=NexusSceneSettings)
    
    print("NEXUS-PRIME Add-on registered")


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
    
    del bpy.types.Scene.nexus_settings
    
    print("NEXUS-PRIME Add-on unregistered")


if __name__ == "__main__":
    register()
