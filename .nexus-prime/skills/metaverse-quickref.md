# Metaverse Development Team - Quick Reference

## Activation Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| `/metaverse` | Team | Activate full metaverse team |
| `/vertex` | VERTEX | 3D modeling & rendering |
| `/forge` | FORGE | Game engine & world building |
| `/nexus-vr` | NEXUS-VR | VR/AR/MR experiences |
| `/chain` | CHAIN | Blockchain & Web3 |
| `/avatar` | AVATAR | AI avatars & NPCs |
| `/cosmos` | COSMOS | World architecture |

## Technology Stack (MetaProLane)

### 3D & Graphics
- **Blender** - 3D modeling, animation, rendering
- **Unity** - Game engine, real-time 3D
- **Unreal Engine** - High-fidelity graphics
- **Three.js** - Web 3D

### VR/AR/MR
- **WebXR** - Browser-based VR/AR
- **Meta Quest SDK** - Quest headsets
- **ARKit/ARCore** - Mobile AR
- **OpenXR** - Cross-platform VR

### Blockchain/Web3
- **Ethereum** - Smart contracts
- **Polygon** - Low-fee L2
- **Solana** - Fast blockchain
- **IPFS** - Decentralized storage

### AI
- **LLMs** - NPC dialogue
- **Procedural generation** - Content creation
- **Motion synthesis** - Animation

## Quick Workflows

### Create Metaverse Scene
```
1. /vertex create [scene_type]    # Create 3D scene
2. /vertex render                  # Render preview
3. /forge import                   # Import to engine
4. /nexus-vr deploy               # Add VR support
5. /chain deploy                   # Add blockchain
```

### Create NFT Collection
```
1. /vertex create avatar           # Design base avatar
2. /avatar generate-traits         # Create variations
3. /chain mint                     # Deploy & mint NFTs
```

### Build Casino World
```
1. /vertex create casino --style hood
2. /vertex animate dice
3. /forge network photon           # Add multiplayer
4. /chain deploy casino-contract   # Crypto betting
5. /nexus-vr deploy quest          # VR support
```

## Material Library

| Material | Function | Use Case |
|----------|----------|----------|
| `neon_mat(color, strength)` | Glowing emission | Signs, edges, wireframes |
| `holo_mat(color)` | Transparent + glow | Avatars, dice, UI |
| `glass_mat(color, alpha)` | Translucent surface | Platforms, buildings |
| `basic_mat(color)` | Simple PBR | Floors, walls, furniture |

## Output Formats

| Type | Format | Usage |
|------|--------|-------|
| 3D Models | GLTF/GLB | Web, Unity |
| 3D Models | FBX | Unity, Unreal |
| Video | MP4 (H.264) | Preview, marketing |
| NFT Metadata | JSON | ERC-721/1155 |
| VR Experience | WebXR | Browser VR |

## Current Project: Hood Casino

**Location:** `/tmp/hood_casino_*.py`

**Features:**
- 3 craps tables in corner
- 19 holographic avatars
- Neon grid floor
- Barrel fires
- Animated dice rolls
- Video flythrough

**Rendered Videos:**
- `~/Desktop/hood_casino_tour.mp4` - 6s tour
- `~/Desktop/hood_casino_dice_roll.mp4` - 8s dice animation

## Next Steps to Build Out

1. **Export to Unity/Unreal** - Convert Blender scene
2. **Add Multiplayer** - Photon/Mirror networking
3. **Integrate Crypto** - Wallet connection, betting
4. **Deploy VR** - Quest/WebXR support
5. **Add AI NPCs** - Dealer, security, crowd
6. **Mint NFTs** - Avatar collection, chips
