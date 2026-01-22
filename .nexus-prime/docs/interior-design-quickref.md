# Interior Design Master Team - Quick Reference

> Commercial Space Design Swarm | 6 Guru-Level Specialists | Blender + VR/AR

---

## Quick Start

```bash
# Activate the full team
/deploy-interior

# Or deploy individual specialists
/nexus-deploy SPATIAL-GURU     # Lead designer
/nexus-deploy RENDER-MASTER    # Blender visualization
```

---

## Team Overview

```
                    SPATIAL-GURU (Lead)
                          |
    +----------+----------+----------+----------+
    |          |          |          |          |
 ATELIER    LUMINA   FLUX-SPACE   MATERIA
 (Brand)   (Light)    (Flow)    (Materials)
    |          |          |          |
    +----------+----------+----------+
                    |
              RENDER-MASTER
             (Visualization)
```

---

## Agent Quick Reference

| Agent | Triggers | Best For |
|-------|----------|----------|
| **SPATIAL-GURU** | "interior design", "commercial space" | Overall project direction |
| **ATELIER** | "brand", "aesthetics", "styling" | Visual identity, palette |
| **LUMINA** | "lighting", "atmosphere", "mood" | Light design, fixtures |
| **FLUX-SPACE** | "layout", "flow", "circulation" | Space planning, ADA |
| **MATERIA** | "materials", "finishes", "texture" | Surfaces, PBR specs |
| **RENDER-MASTER** | "render", "blender", "visualization" | 3D, animation, VR |

---

## Space Types

| Type | Subtypes | Key Agents |
|------|----------|------------|
| **Retail** | Flagship, boutique, showroom | SPATIAL-GURU, ATELIER, LUMINA |
| **Hospitality** | Hotel, restaurant, bar, spa | SPATIAL-GURU, LUMINA, ATELIER |
| **Corporate** | HQ, innovation center | SPATIAL-GURU, FLUX-SPACE, LUMINA |
| **Gallery** | Art, museum, exhibition | SPATIAL-GURU, LUMINA, MATERIA |
| **Mixed-Use** | Food hall, lifestyle center | All agents |

---

## Workflow Phases

```
1. DISCOVERY        SPATIAL-GURU leads
   |                ATELIER + FLUX-SPACE support
   v
2. CONCEPT          All specialists work in parallel
   |                ATELIER: brand palette
   |                FLUX-SPACE: layouts
   |                LUMINA: lighting concept
   v
3. DESIGN DEV       Detailed parallel work
   |                MATERIA: materials
   |                All agents: detailed design
   v
4. VISUALIZATION    RENDER-MASTER leads
   |                Receives from all agents
   v
5. DELIVERY         SPATIAL-GURU compiles
                    Final package + VR experience
```

---

## Blender Integration

### Generate Commercial Space

```bash
# From Blender Python console or script:
exec(open("/Users/seg/.nexus-prime/blender/interior_design/commercial_space_generator.py").read())

# Then call:
generate_commercial_space(
    space_type="gallery",    # or: retail, restaurant, office, hotel_lobby, showroom
    width=20.0,              # meters
    depth=15.0,
    height=4.0
)
```

### Space Presets

| Preset | Dimensions | Features |
|--------|------------|----------|
| `gallery` | 20x15x5m | White walls, track lighting, pedestals |
| `retail` | 15x12x4m | Display fixtures, accent lighting |
| `restaurant` | 18x12x3.5m | Warm materials, pendant lights |
| `office` | 25x20x3m | Workstations, acoustic ceiling |
| `hotel_lobby` | 20x15x6m | Luxury finishes, dramatic lighting |
| `showroom` | 30x20x5m | Product displays, spotlights |

---

## Material Presets (PBR)

| Material | Base Color | Metal | Rough | Notes |
|----------|------------|-------|-------|-------|
| Polished Concrete | #808080 | 0.0 | 0.3 | Floor |
| Wood Oak | #8B7355 | 0.0 | 0.5 | Warm accents |
| White Marble | #F5F5F5 | 0.0 | 0.1 | Luxury surfaces |
| Brushed Brass | #D4AF37 | 1.0 | 0.35 | Metal accents |
| Matte White | #FFFFFF | 0.0 | 0.9 | Walls |
| Black Steel | #1A1A1A | 0.8 | 0.4 | Industrial |
| Leather Cognac | #8B4513 | 0.0 | 0.6 | Upholstery |
| Terrazzo | #E8E0D5 | 0.0 | 0.4 | Premium floors |

---

## Lighting Quick Reference

### By Space Type

| Space | Color Temp | CRI | Key Style |
|-------|------------|-----|-----------|
| Gallery | 4000K | 95+ | Track, no shadows on art |
| Retail | 3500K | 90+ | Accent + ambient layers |
| Restaurant | 2700K | 90+ | Warm, dimmable |
| Office | 4000K | 80+ | Even, task lighting |
| Hotel Lobby | 3000K | 90+ | Dramatic, layered |

### Blender Light Setup

```python
# Track lighting (gallery/retail)
create_track_lighting(
    length=10.0,
    num_lights=5,
    color_temp=4000,  # Kelvin
    power=100         # Watts
)

# Pendant lighting (hospitality)
create_pendant_lighting(
    num_pendants=3,
    drop_height=2.0,
    color_temp=2700,
    power=60
)
```

---

## VR/AR Export

### Supported Platforms

| Platform | Format | Notes |
|----------|--------|-------|
| Meta Quest 3 | GLB | Baked lighting recommended |
| Apple Vision Pro | USDZ | High-quality textures |
| WebXR | GLTF/GLB | Compressed textures |
| SteamVR | FBX | Real-time lighting OK |

### Export Checklist

- [ ] Bake lighting for mobile VR
- [ ] Compress textures (1K-2K max)
- [ ] Reduce polygon count (<500K)
- [ ] Set up teleportation points
- [ ] Add scale reference objects
- [ ] Test on target device

---

## Handoff Protocols

```
ATELIER ──[brand palette]──> MATERIA
FLUX-SPACE ──[layout]──> RENDER-MASTER
LUMINA ──[lighting specs]──> RENDER-MASTER
MATERIA ──[PBR materials]──> RENDER-MASTER
ALL ──[phase complete]──> SPATIAL-GURU
```

---

## Deliverables Checklist

### Concept Phase
- [ ] Mood boards
- [ ] Concept sketches
- [ ] Space diagrams
- [ ] Material palettes
- [ ] 3D concept renders

### Design Development
- [ ] Floor plans
- [ ] Reflected ceiling plans
- [ ] Elevations & sections
- [ ] Material boards
- [ ] Furniture layouts
- [ ] Lighting plans

### Visualization
- [ ] Photorealistic renders (4K)
- [ ] Walkthrough animation
- [ ] VR experience
- [ ] 360 panoramas

### Documentation
- [ ] Finish schedules
- [ ] Furniture specifications
- [ ] Lighting schedules
- [ ] Blender project files

---

## File Locations

```
~/.nexus-prime/
├── agents/
│   ├── SPATIAL-GURU.yaml
│   ├── ATELIER.yaml
│   ├── LUMINA.yaml
│   ├── FLUX-SPACE.yaml
│   ├── MATERIA.yaml
│   └── RENDER-MASTER.yaml
├── skills/
│   └── team-interior-design.yaml
├── blender/
│   └── interior_design/
│       └── commercial_space_generator.py
└── docs/
    └── interior-design-quickref.md  (this file)
```

---

## Common Commands

```bash
# Design a retail space
"Design a 2000 sqft flagship boutique for a luxury fashion brand"

# Visualize a restaurant
"Create photorealistic renders of an Italian fine dining restaurant"

# Generate VR walkthrough
"Build a VR experience for a modern art gallery with 50 artworks"

# Specify materials
"Develop a material palette for a sustainable corporate headquarters"

# Plan lighting
"Design the lighting for a hotel lobby with dramatic impact"
```

---

*Interior Design Master Team v1.0*
*"Six minds, one vision—spaces that transform businesses and inspire people."*
