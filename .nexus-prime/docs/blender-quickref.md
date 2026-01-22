# NEXUS-PRIME Blender Master Team - Quick Reference

> Complete 3D production pipeline with 7 guru-level specialists

---

## Commands

### Team Deployment
| Command | Description |
|---------|-------------|
| `/deploy-blender` | Deploy full Blender Master Team |
| `/blender` | Quick access menu |

### Agent-Specific
| Command | Agent | Focus |
|---------|-------|-------|
| `/blender-model` | MESH-MASTER | 3D modeling, topology |
| `/blender-material` | SHADER-WIZARD | PBR materials, shaders |
| `/blender-animate` | ANIM-GURU | Keyframe animation |
| `/blender-rig` | RIG-MASTER | Character rigging |
| `/blender-sim` | SIM-GURU | Physics simulation |
| `/blender-nodes` | NODE-ARCHITECT | Geometry nodes |
| `/blender-render` | RENDER-MASTER | Rendering, lighting |

### Operations
| Command | Description |
|---------|-------------|
| `/blender-new [type]` | Create new project |
| `/blender-run [script]` | Execute script |
| `/blender-generate [type]` | Generate space |
| `/blender-export [format]` | Export scene |
| `/blender-render-preview` | Quick preview |
| `/blender-render-final` | Final render |

---

## Team Agents

### MESH-MASTER (BLN-001)
**3D Modeling Expert**
- Hard surface & organic modeling
- Topology optimization
- Geometry Nodes integration
- Retopology workflows

### SHADER-WIZARD (BLN-002)
**Materials & Shaders Expert**
- PBR material creation
- Procedural texturing
- Node graph optimization
- Material libraries

### ANIM-GURU (BLN-003)
**Animation Director**
- Character animation
- Motion graphics
- NLA editor workflows
- Timing & spacing

### RIG-MASTER (BLN-004)
**Rigging Expert**
- Character rigs
- Facial systems
- Mechanical rigs
- Constraint systems

### SIM-GURU (BLN-005)
**Physics & VFX Expert**
- Cloth simulation
- Fluid dynamics
- Rigid/soft body
- Particle systems

### NODE-ARCHITECT (BLN-006)
**Procedural Systems Expert**
- Geometry nodes
- Procedural generation
- Asset scattering
- Parametric tools

### RENDER-MASTER (BLN-007)
**Lead Visualizer**
- Cycles/Eevee mastery
- Lighting design
- Post-processing
- VR export

---

## Project Types

| Type | Key Agents | Output |
|------|-----------|--------|
| `arch-viz` | RENDER-MASTER, SHADER-WIZARD | Still renders, VR tours |
| `character` | MESH-MASTER, RIG-MASTER, ANIM-GURU | Animated characters |
| `product` | MESH-MASTER, SHADER-WIZARD | Product renders |
| `motion` | ANIM-GURU, NODE-ARCHITECT | Motion graphics |
| `vfx` | SIM-GURU, NODE-ARCHITECT | VFX elements |
| `game` | MESH-MASTER, SHADER-WIZARD | Game-ready assets |

---

## Blender Scripts

### Location
```
~/.nexus-prime/blender/scripts/
```

### Available Scripts
| Script | Description |
|--------|-------------|
| `scene_setup.py` | Project setup presets |
| `material_library.py` | PBR material library |
| `batch_render.py` | Batch rendering |
| `commercial_space_generator.py` | Interior design generator |

### Usage in Blender
```python
# Scene setup
exec(open('~/.nexus-prime/blender/scripts/scene_setup.py').read())
setup_scene('arch-viz')

# Material library
exec(open('~/.nexus-prime/blender/scripts/material_library.py').read())
create_material('Gold', 'metals', 'gold')

# Generate space
exec(open('~/.nexus-prime/blender/interior_design/commercial_space_generator.py').read())
generate_commercial_space('gallery', 20, 15, 4)
```

---

## Material Library

### Categories
- **metals**: gold, silver, copper, brass, steel, chrome
- **wood**: oak, walnut, maple, pine, ebony, teak
- **stone**: marble, granite, concrete, brick, slate
- **fabric**: cotton, linen, velvet, leather, silk
- **glass**: clear, frosted, tinted, mirror
- **plastic**: abs, acrylic, rubber, silicone

### Quick Functions
```python
metal('MyGold', 'gold')
wood('FloorWood', 'oak')
stone('WallMaterial', 'concrete')
glass('WindowGlass', 'clear')
```

---

## Render Presets

| Preset | Samples | Resolution | Use Case |
|--------|---------|------------|----------|
| `preview` | 32-64 | 1280x720 | Quick checks |
| `production` | 256 | 1920x1080 | Client work |
| `final` | 1024 | 3840x2160 | Final delivery |
| `animation` | 128 | 1920x1080 | Sequences |

---

## MCP Server

### Installation
```bash
cd ~/.nexus-prime/mcp/blender-server
npm install
```

### Environment
```bash
export BLENDER_PATH="/Applications/Blender.app/Contents/MacOS/Blender"
export NEXUS_BLENDER_SCRIPTS="~/.nexus-prime/blender"
```

### Available Tools
- `blender_new_scene` - Create new scene
- `blender_create_primitive` - Add primitives
- `blender_create_material` - Create PBR material
- `blender_render_image` - Render to file
- `blender_generate_space` - Generate interior
- `blender_execute_python` - Run custom code

---

## Blender Add-on

### Installation
1. Open Blender → Edit → Preferences → Add-ons
2. Install: `~/.nexus-prime/plugins/blender/nexus_prime_addon/__init__.py`
3. Enable "NEXUS-PRIME Integration"

### Panel Location
View3D → Sidebar → NEXUS

### Features
- Space generator UI
- Render presets
- Material creation
- Scene analysis

---

## Export Formats

| Format | Use Case | Settings |
|--------|----------|----------|
| GLTF/GLB | Web, VR, real-time | Draco compression |
| FBX | Game engines, interchange | Apply modifiers |
| USD | Film, Houdini | Full quality |
| OBJ | Legacy, 3D printing | Triangulate |

---

## File Locations

```
~/.nexus-prime/
├── agents/           # Agent definitions
│   ├── MESH-MASTER.yaml
│   ├── SHADER-WIZARD.yaml
│   └── ...
├── blender/
│   ├── scripts/      # Python scripts
│   ├── materials/    # Material library
│   ├── presets/      # Render presets
│   └── output/       # Render output
├── commands/blender/ # Slash commands
├── hooks/blender/    # Automation hooks
├── mcp/blender-server/ # MCP integration
├── plugins/blender/  # Blender add-on
├── settings/blender/ # Configuration
└── skills/
    └── team-blender-master.yaml
```

---

## Tips & Best Practices

1. **Start with setup** - Use `/blender-new [type]` to initialize projects
2. **Use presets** - Apply render presets for consistent quality
3. **Material library** - Build reusable materials with the library
4. **Batch processing** - Use batch_render.py for multiple files
5. **VR export** - Optimize with GLTF Draco compression
6. **Scene cleanup** - Run `/blender-clean` to remove unused data

---

*NEXUS-PRIME Blender Master Team v1.0*
*"From vertex to final frame"*
