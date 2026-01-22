#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  NEXUS-PRIME: Blender MCP Server
 *  Model Context Protocol server for Blender automation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

// Configuration
const BLENDER_PATH = process.env.BLENDER_PATH || '/Applications/Blender.app/Contents/MacOS/Blender';
const SCRIPTS_PATH = process.env.NEXUS_BLENDER_SCRIPTS || path.join(process.env.HOME, '.nexus-prime/blender');
const OUTPUT_PATH = process.env.BLENDER_OUTPUT || path.join(process.env.HOME, '.nexus-prime/blender/output');

// Create MCP server
const server = new Server(
  {
    name: 'blender-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Utility functions
async function runBlenderScript(scriptPath, args = {}) {
  const argsJson = JSON.stringify(args).replace(/"/g, '\\"');
  const command = `"${BLENDER_PATH}" --background --python "${scriptPath}" -- '${argsJson}'`;
  
  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 300000 });
    return { success: true, stdout, stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function executeBlenderPython(code) {
  const tempScript = path.join(OUTPUT_PATH, `temp_${Date.now()}.py`);
  
  try {
    await fs.mkdir(OUTPUT_PATH, { recursive: true });
    await fs.writeFile(tempScript, code);
    
    const result = await runBlenderScript(tempScript);
    
    // Cleanup
    await fs.unlink(tempScript).catch(() => {});
    
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Scene Management
      {
        name: 'blender_new_scene',
        description: 'Create a new Blender scene with optional preset',
        inputSchema: {
          type: 'object',
          properties: {
            preset: {
              type: 'string',
              enum: ['empty', 'arch-viz', 'character', 'product', 'motion'],
              description: 'Scene preset type',
            },
            name: {
              type: 'string',
              description: 'Scene name',
            },
          },
        },
      },
      {
        name: 'blender_open_file',
        description: 'Open an existing .blend file',
        inputSchema: {
          type: 'object',
          properties: {
            filepath: {
              type: 'string',
              description: 'Path to .blend file',
            },
          },
          required: ['filepath'],
        },
      },
      {
        name: 'blender_save_file',
        description: 'Save current scene to file',
        inputSchema: {
          type: 'object',
          properties: {
            filepath: {
              type: 'string',
              description: 'Output path for .blend file',
            },
          },
          required: ['filepath'],
        },
      },

      // Object Creation
      {
        name: 'blender_create_primitive',
        description: 'Create a primitive mesh object',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['cube', 'sphere', 'cylinder', 'cone', 'plane', 'torus', 'monkey'],
              description: 'Primitive type',
            },
            location: {
              type: 'array',
              items: { type: 'number' },
              description: '[x, y, z] location',
            },
            scale: {
              type: 'array',
              items: { type: 'number' },
              description: '[x, y, z] scale',
            },
            name: {
              type: 'string',
              description: 'Object name',
            },
          },
          required: ['type'],
        },
      },
      {
        name: 'blender_create_light',
        description: 'Create a light object',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['POINT', 'SUN', 'SPOT', 'AREA'],
              description: 'Light type',
            },
            location: {
              type: 'array',
              items: { type: 'number' },
              description: '[x, y, z] location',
            },
            energy: {
              type: 'number',
              description: 'Light energy/power',
            },
            color: {
              type: 'array',
              items: { type: 'number' },
              description: '[r, g, b] color (0-1)',
            },
          },
          required: ['type'],
        },
      },
      {
        name: 'blender_create_camera',
        description: 'Create a camera',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'array',
              items: { type: 'number' },
              description: '[x, y, z] location',
            },
            rotation: {
              type: 'array',
              items: { type: 'number' },
              description: '[x, y, z] rotation in degrees',
            },
            set_active: {
              type: 'boolean',
              description: 'Set as active camera',
            },
          },
        },
      },

      // Materials
      {
        name: 'blender_create_material',
        description: 'Create a PBR material',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Material name',
            },
            base_color: {
              type: 'array',
              items: { type: 'number' },
              description: '[r, g, b, a] base color',
            },
            metallic: {
              type: 'number',
              description: 'Metallic value (0-1)',
            },
            roughness: {
              type: 'number',
              description: 'Roughness value (0-1)',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'blender_apply_material',
        description: 'Apply material to object',
        inputSchema: {
          type: 'object',
          properties: {
            object_name: {
              type: 'string',
              description: 'Target object name',
            },
            material_name: {
              type: 'string',
              description: 'Material to apply',
            },
          },
          required: ['object_name', 'material_name'],
        },
      },

      // Modifiers
      {
        name: 'blender_add_modifier',
        description: 'Add modifier to object',
        inputSchema: {
          type: 'object',
          properties: {
            object_name: {
              type: 'string',
              description: 'Target object',
            },
            modifier_type: {
              type: 'string',
              enum: ['SUBSURF', 'BEVEL', 'ARRAY', 'MIRROR', 'BOOLEAN', 'SOLIDIFY', 'DECIMATE'],
              description: 'Modifier type',
            },
            settings: {
              type: 'object',
              description: 'Modifier-specific settings',
            },
          },
          required: ['object_name', 'modifier_type'],
        },
      },

      // Rendering
      {
        name: 'blender_render_image',
        description: 'Render current scene to image',
        inputSchema: {
          type: 'object',
          properties: {
            output_path: {
              type: 'string',
              description: 'Output file path',
            },
            resolution_x: {
              type: 'number',
              description: 'Width in pixels',
            },
            resolution_y: {
              type: 'number',
              description: 'Height in pixels',
            },
            engine: {
              type: 'string',
              enum: ['CYCLES', 'BLENDER_EEVEE_NEXT', 'BLENDER_WORKBENCH'],
              description: 'Render engine',
            },
            samples: {
              type: 'number',
              description: 'Render samples (Cycles)',
            },
          },
          required: ['output_path'],
        },
      },
      {
        name: 'blender_render_animation',
        description: 'Render animation sequence',
        inputSchema: {
          type: 'object',
          properties: {
            output_path: {
              type: 'string',
              description: 'Output directory',
            },
            frame_start: {
              type: 'number',
              description: 'Start frame',
            },
            frame_end: {
              type: 'number',
              description: 'End frame',
            },
            format: {
              type: 'string',
              enum: ['PNG', 'JPEG', 'FFMPEG'],
              description: 'Output format',
            },
          },
          required: ['output_path'],
        },
      },

      // Export
      {
        name: 'blender_export',
        description: 'Export scene to various formats',
        inputSchema: {
          type: 'object',
          properties: {
            filepath: {
              type: 'string',
              description: 'Output file path',
            },
            format: {
              type: 'string',
              enum: ['GLTF', 'FBX', 'OBJ', 'USD'],
              description: 'Export format',
            },
            selected_only: {
              type: 'boolean',
              description: 'Export selected objects only',
            },
          },
          required: ['filepath', 'format'],
        },
      },

      // Generators
      {
        name: 'blender_generate_space',
        description: 'Generate commercial interior space',
        inputSchema: {
          type: 'object',
          properties: {
            space_type: {
              type: 'string',
              enum: ['gallery', 'retail', 'restaurant', 'office', 'hotel_lobby', 'showroom'],
              description: 'Type of commercial space',
            },
            width: {
              type: 'number',
              description: 'Width in meters',
            },
            depth: {
              type: 'number',
              description: 'Depth in meters',
            },
            height: {
              type: 'number',
              description: 'Height in meters (optional)',
            },
          },
          required: ['space_type'],
        },
      },

      // Custom Python
      {
        name: 'blender_execute_python',
        description: 'Execute custom Blender Python code',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Python code to execute in Blender',
            },
          },
          required: ['code'],
        },
      },

      // Scene Analysis
      {
        name: 'blender_analyze_scene',
        description: 'Get scene statistics and information',
        inputSchema: {
          type: 'object',
          properties: {
            filepath: {
              type: 'string',
              description: 'Path to .blend file (optional, uses current if not provided)',
            },
          },
        },
      },

      // Script Runner
      {
        name: 'blender_run_script',
        description: 'Run a NEXUS-PRIME Blender script',
        inputSchema: {
          type: 'object',
          properties: {
            script_name: {
              type: 'string',
              description: 'Script name from library',
            },
            args: {
              type: 'object',
              description: 'Arguments to pass to script',
            },
          },
          required: ['script_name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'blender_new_scene': {
        const code = `
import bpy

# Clear scene
bpy.ops.wm.read_homefile(use_empty=True)

# Setup based on preset
preset = "${args?.preset || 'empty'}"

if preset == 'arch-viz':
    # Add ground plane
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
    # Add sun light
    bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
    bpy.context.object.data.energy = 3
    # Add camera
    bpy.ops.object.camera_add(location=(10, -10, 5))
    bpy.context.object.rotation_euler = (1.1, 0, 0.8)
    bpy.context.scene.camera = bpy.context.object

elif preset == 'product':
    # Studio setup
    bpy.ops.mesh.primitive_plane_add(size=5, location=(0, 0, 0))
    bpy.ops.object.light_add(type='AREA', location=(2, -2, 3))
    bpy.context.object.data.energy = 200
    bpy.ops.object.camera_add(location=(3, -3, 2))

print("Scene created: " + preset)
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Scene created with preset: ${args?.preset || 'empty'}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_create_primitive': {
        const loc = args?.location || [0, 0, 0];
        const scale = args?.scale || [1, 1, 1];
        const primitiveMap = {
          cube: 'primitive_cube_add',
          sphere: 'primitive_uv_sphere_add',
          cylinder: 'primitive_cylinder_add',
          cone: 'primitive_cone_add',
          plane: 'primitive_plane_add',
          torus: 'primitive_torus_add',
          monkey: 'primitive_monkey_add',
        };
        
        const code = `
import bpy
bpy.ops.mesh.${primitiveMap[args.type]}(location=(${loc.join(',')}))
obj = bpy.context.active_object
obj.scale = (${scale.join(',')})
${args?.name ? `obj.name = "${args.name}"` : ''}
print(f"Created {obj.name}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Created ${args.type}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_create_material': {
        const color = args?.base_color || [0.8, 0.8, 0.8, 1.0];
        const code = `
import bpy

mat = bpy.data.materials.new(name="${args.name}")
mat.use_nodes = True
nodes = mat.node_tree.nodes
principled = nodes.get('Principled BSDF')

if principled:
    principled.inputs['Base Color'].default_value = (${color.join(',')})
    principled.inputs['Metallic'].default_value = ${args?.metallic || 0}
    principled.inputs['Roughness'].default_value = ${args?.roughness || 0.5}

print(f"Material created: ${args.name}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Material '${args.name}' created` : `Error: ${result.error}` }],
        };
      }

      case 'blender_render_image': {
        const code = `
import bpy

scene = bpy.context.scene
scene.render.filepath = "${args.output_path}"
scene.render.resolution_x = ${args?.resolution_x || 1920}
scene.render.resolution_y = ${args?.resolution_y || 1080}
scene.render.engine = "${args?.engine || 'CYCLES'}"

if scene.render.engine == 'CYCLES':
    scene.cycles.samples = ${args?.samples || 128}

bpy.ops.render.render(write_still=True)
print(f"Rendered to: ${args.output_path}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Rendered to: ${args.output_path}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_generate_space': {
        const scriptPath = path.join(SCRIPTS_PATH, 'interior_design/commercial_space_generator.py');
        const code = `
import sys
sys.path.insert(0, "${SCRIPTS_PATH}/interior_design")
from commercial_space_generator import generate_commercial_space

result = generate_commercial_space(
    space_type="${args.space_type}",
    width=${args?.width || 15},
    depth=${args?.depth || 12},
    height=${args?.height || 'None'}
)
print(f"Generated {args.space_type} space")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Generated ${args.space_type} space (${args?.width || 15}m x ${args?.depth || 12}m)` : `Error: ${result.error}` }],
        };
      }

      case 'blender_execute_python': {
        const result = await executeBlenderPython(args.code);
        return {
          content: [{ type: 'text', text: result.success ? `Executed successfully:\n${result.stdout}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_export': {
        const exporters = {
          GLTF: `bpy.ops.export_scene.gltf(filepath="${args.filepath}", export_format='GLB')`,
          FBX: `bpy.ops.export_scene.fbx(filepath="${args.filepath}")`,
          OBJ: `bpy.ops.wm.obj_export(filepath="${args.filepath}")`,
          USD: `bpy.ops.wm.usd_export(filepath="${args.filepath}")`,
        };

        const code = `
import bpy
${exporters[args.format]}
print(f"Exported to: ${args.filepath}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Exported to: ${args.filepath}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_apply_material': {
        const code = `
import bpy

obj = bpy.data.objects.get("${args.object_name}")
mat = bpy.data.materials.get("${args.material_name}")

if obj and mat:
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    print(f"Applied {mat.name} to {obj.name}")
else:
    print(f"Error: Object or material not found")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Applied '${args.material_name}' to '${args.object_name}'` : `Error: ${result.error}` }],
        };
      }

      case 'blender_create_light': {
        const loc = args?.location || [0, 0, 5];
        const color = args?.color || [1, 1, 1];
        const code = `
import bpy

bpy.ops.object.light_add(type='${args.type}', location=(${loc.join(',')}))
light = bpy.context.active_object
light.data.energy = ${args?.energy || 100}
light.data.color = (${color.join(',')})
print(f"Created {light.name}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Created ${args.type} light` : `Error: ${result.error}` }],
        };
      }

      case 'blender_create_camera': {
        const loc = args?.location || [7, -7, 5];
        const rot = args?.rotation || [60, 0, 45];
        const code = `
import bpy
import math

bpy.ops.object.camera_add(location=(${loc.join(',')}))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(${rot[0]}), math.radians(${rot[1]}), math.radians(${rot[2]}))
${args?.set_active ? 'bpy.context.scene.camera = cam' : ''}
print(f"Created camera: {cam.name}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Created camera` : `Error: ${result.error}` }],
        };
      }

      case 'blender_add_modifier': {
        const settings = args?.settings || {};
        const settingsCode = Object.entries(settings)
          .map(([key, value]) => `mod.${key} = ${typeof value === 'string' ? `"${value}"` : value}`)
          .join('\n');

        const code = `
import bpy

obj = bpy.data.objects.get("${args.object_name}")
if obj:
    mod = obj.modifiers.new(name="${args.modifier_type}", type="${args.modifier_type}")
    ${settingsCode}
    print(f"Added {mod.name} to {obj.name}")
else:
    print("Object not found")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Added ${args.modifier_type} modifier to '${args.object_name}'` : `Error: ${result.error}` }],
        };
      }

      case 'blender_open_file': {
        const code = `
import bpy
bpy.ops.wm.open_mainfile(filepath="${args.filepath}")
print(f"Opened: ${args.filepath}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Opened: ${args.filepath}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_save_file': {
        const code = `
import bpy
bpy.ops.wm.save_as_mainfile(filepath="${args.filepath}")
print(f"Saved to: ${args.filepath}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Saved to: ${args.filepath}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_render_animation': {
        const code = `
import bpy

scene = bpy.context.scene
scene.render.filepath = "${args.output_path}/"
scene.frame_start = ${args?.frame_start || 1}
scene.frame_end = ${args?.frame_end || 250}
scene.render.image_settings.file_format = '${args?.format || 'PNG'}'

bpy.ops.render.render(animation=True)
print(f"Animation rendered to: ${args.output_path}")
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Animation rendered to: ${args.output_path}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_analyze_scene': {
        const code = `
import bpy
import json

stats = {
    'objects': len(bpy.data.objects),
    'meshes': len(bpy.data.meshes),
    'materials': len(bpy.data.materials),
    'lights': len([o for o in bpy.data.objects if o.type == 'LIGHT']),
    'cameras': len([o for o in bpy.data.objects if o.type == 'CAMERA']),
    'total_verts': sum(len(m.vertices) for m in bpy.data.meshes),
    'total_faces': sum(len(m.polygons) for m in bpy.data.meshes),
    'render_engine': bpy.context.scene.render.engine,
    'frame_range': [bpy.context.scene.frame_start, bpy.context.scene.frame_end],
}
print(json.dumps(stats, indent=2))
`;
        const result = await executeBlenderPython(code);
        return {
          content: [{ type: 'text', text: result.success ? `Scene Analysis:\n${result.stdout}` : `Error: ${result.error}` }],
        };
      }

      case 'blender_run_script': {
        const scriptPath = path.join(SCRIPTS_PATH, 'scripts', `${args.script_name}.py`);
        const result = await runBlenderScript(scriptPath, args?.args || {});
        return {
          content: [{ type: 'text', text: result.success ? `Script executed:\n${result.stdout}` : `Error: ${result.error}` }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Define available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'blender://scripts',
        name: 'Blender Scripts',
        description: 'Available Blender Python scripts',
        mimeType: 'application/json',
      },
      {
        uri: 'blender://materials',
        name: 'Material Library',
        description: 'PBR material presets',
        mimeType: 'application/json',
      },
      {
        uri: 'blender://presets',
        name: 'Render Presets',
        description: 'Render configuration presets',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    switch (uri) {
      case 'blender://scripts': {
        const scripts = await fs.readdir(SCRIPTS_PATH, { recursive: true });
        const pyScripts = scripts.filter(f => f.endsWith('.py'));
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({ scripts: pyScripts }, null, 2),
            },
          ],
        };
      }

      case 'blender://materials': {
        const materials = {
          metals: ['gold', 'silver', 'copper', 'brass', 'steel', 'chrome'],
          wood: ['oak', 'walnut', 'maple', 'pine', 'bamboo'],
          stone: ['marble', 'granite', 'concrete', 'brick', 'slate'],
          fabric: ['cotton', 'linen', 'velvet', 'leather', 'silk'],
          glass: ['clear', 'frosted', 'tinted'],
        };
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(materials, null, 2),
            },
          ],
        };
      }

      case 'blender://presets': {
        const presets = {
          render: {
            preview: { samples: 64, resolution: '1280x720' },
            production: { samples: 256, resolution: '1920x1080' },
            final: { samples: 1024, resolution: '3840x2160' },
          },
          lighting: ['studio', 'outdoor', 'indoor', 'dramatic'],
        };
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(presets, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  } catch (error) {
    throw new Error(`Failed to read resource: ${error.message}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Blender MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
