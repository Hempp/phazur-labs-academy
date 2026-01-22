
import bpy

scene = bpy.context.scene
scene.render.filepath = "/Users/seg/street-art-gallery/renders/walkthrough_final/"
scene.frame_start = 1
scene.frame_end = 300
scene.render.image_settings.file_format = 'FFMPEG'

bpy.ops.render.render(animation=True)
print(f"Animation rendered to: /Users/seg/street-art-gallery/renders/walkthrough_final")
