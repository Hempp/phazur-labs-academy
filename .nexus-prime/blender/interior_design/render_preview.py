#!/usr/bin/env python3
"""
NEXUS-PRIME Interior Design - Render Gallery Preview
"""

import bpy
import os

# Set render settings for preview
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128  # Lower for faster preview
bpy.context.scene.cycles.use_denoising = True

# Resolution
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.resolution_percentage = 50  # 50% for faster render

# Output
output_path = os.path.expanduser("~/.nexus-prime/blender/interior_design/output/gallery_preview.png")
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'PNG'

# Render
print("Rendering gallery preview...")
bpy.ops.render.render(write_still=True)
print(f"Preview saved to: {output_path}")
