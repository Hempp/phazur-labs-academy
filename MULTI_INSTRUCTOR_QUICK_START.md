# 🎭 Multi-Instructor System - Quick Start

## ✅ What's Ready

You now have **6 AI instructor personas** ready to create course videos!

Each instructor has their own:
- ✅ Unique teaching style
- ✅ Subject matter expertise
- ✅ Voice profile
- ✅ Professional persona

---

## 👥 Your Instructor Team

| Instructor | Expertise | Best For | Style |
|------------|-----------|----------|-------|
| **Dr. Sarah Chen** | React & Frontend | React, JavaScript courses | Energetic, enthusiastic |
| **Marcus Williams** | TypeScript & Backend | TypeScript, Node.js courses | Authoritative, professional |
| **Elena Rodriguez** | Full Stack & DevOps | Full-stack, DevOps courses | Dynamic, practical |
| **Dr. James Park** | Computer Science | Algorithms, CS fundamentals | Academic, thorough |
| **Aisha Kumar** | UI/UX & Design | Design, accessibility courses | Creative, friendly |
| **Alex Thompson** | Security & Testing | Security, quality courses | Serious, detailed |

---

## 🚀 Usage Commands

### List All Instructors
```bash
python3 scripts/multi-instructor-generator.py --list
```

### Setup Guide for Specific Instructor
```bash
python3 scripts/multi-instructor-generator.py --setup sarah-chen
```

### Generate Video with Specific Instructor
```bash
# Specify instructor explicitly
python3 scripts/multi-instructor-generator.py \
  --instructor sarah-chen \
  --lesson lesson-react-1-1

# Auto-select based on course
python3 scripts/multi-instructor-generator.py \
  --course react \
  --lesson lesson-react-1-1
```

### Generate Test Video
```bash
python3 scripts/multi-instructor-generator.py \
  --instructor marcus-williams \
  --lesson lesson-ts-1-1 \
  --test
```

---

## 📋 Setup Process (For Each Instructor)

### Option 1: DIY (Free, 30 min per instructor)

1. **Record Voice Sample**
```bash
# Will prompt for which instructor
npm run record:voice
```

2. **Get Free AI Photo**
- Visit: https://thispersondoesnotexist.com/
- Refresh until you find a good match for the persona
- Save as: `assets/instructors/[instructor-id]/photo.jpg`

3. **Verify Setup**
```bash
python3 scripts/multi-instructor-generator.py --setup sarah-chen
```

### Option 2: AI + Freelancer ($20-30 per instructor)

1. **Voice**: Hire on Fiverr ($5-20)
   - Search: "voice recording 60 seconds"
   - Provide script from setup guide
   - Save to: `assets/instructors/[instructor-id]/voice-sample.wav`

2. **Photo**: Use AI-generated (free)
   - Visit: https://thispersondoesnotexist.com/
   - Or use Midjourney/DALL-E for specific look

### Option 3: Professional ($200-300 per instructor)

1. **Voice**: Professional voice actor ($50-150)
2. **Photo**: Professional headshot ($150-200)

---

## 🎬 Quick Start Workflow

### Day 1: Setup First Instructor (Dr. Sarah Chen for React)

```bash
cd ~/projects/phazur-labs-academy

# 1. Create directories
mkdir -p assets/instructors/sarah-chen

# 2. Record voice (or hire on Fiverr)
npm run record:voice
# Follow prompts, save to: assets/instructors/sarah-chen/voice-sample.wav

# 3. Get photo
# Download from thispersondoesnotexist.com
# Save to: assets/instructors/sarah-chen/photo.jpg

# 4. Verify
python3 scripts/multi-instructor-generator.py --setup sarah-chen

# 5. Generate test video
python3 scripts/multi-instructor-generator.py \
  --instructor sarah-chen \
  --lesson lesson-react-1-1 \
  --test

# 6. Review
open public/courses/lesson-react-1-1.mp4
```

### Day 2: Setup Second Instructor (Marcus Williams for TypeScript)

```bash
# Same process for marcus-williams
mkdir -p assets/instructors/marcus-williams
# Record voice + add photo
# Generate test video for TypeScript lesson
```

### Week 1: Setup All 6 Instructors

Pace yourself:
- **Days 1-2**: Sarah Chen + Marcus Williams (most important)
- **Days 3-4**: Elena Rodriguez + James Park
- **Days 5-6**: Aisha Kumar + Alex Thompson

---

## 🎯 Course Assignment

The system **auto-selects** the right instructor based on course content:

| Course Topic | Auto-Selected Instructor |
|--------------|-------------------------|
| React, JavaScript | Dr. Sarah Chen |
| TypeScript, Node.js | Marcus Williams |
| Full-stack, DevOps | Elena Rodriguez |
| Algorithms, Data Structures | Dr. James Park |
| UI/UX, Design | Aisha Kumar |
| Security, Testing | Alex Thompson |

**Example:**
```bash
# These automatically select the right instructor
python3 scripts/multi-instructor-generator.py --course react --lesson lesson-react-1-1
# → Uses Dr. Sarah Chen

python3 scripts/multi-instructor-generator.py --course typescript --lesson lesson-ts-1-1
# → Uses Marcus Williams
```

---

## 📊 Voice Recording Scripts

Each instructor has a unique script designed for their persona. Get them with:

```bash
python3 scripts/multi-instructor-generator.py --setup [instructor-id]
```

**Example for Dr. Sarah Chen:**
> "Welcome to React development! I'm Dr. Sarah Chen, and I'm passionate about building beautiful, performant user interfaces. Throughout my career at top tech companies, I've seen patterns that work and patterns that don't. Today, we'll explore the techniques that make the difference between good code and great code."

---

## 💰 Cost Comparison

### Setup All 6 Instructors

| Approach | Time | Cost | Quality |
|----------|------|------|---------|
| **DIY (Free)** | 3 hours | $0 | Good |
| **AI + Fiverr** | 1 hour | $120-180 | Great |
| **Professional** | 2 weeks | $1,200-1,800 | Excellent |

**Recommendation:** Start with DIY for 1-2 instructors, then upgrade to Fiverr voices if needed.

---

## 🎬 Production Workflow

### Generate Entire React Course with Dr. Sarah Chen

```bash
# First, ensure Sarah Chen is set up
python3 scripts/multi-instructor-generator.py --setup sarah-chen

# Then generate all React lessons
python3 scripts/multi-instructor-generator.py \
  --instructor sarah-chen \
  --course react
```

### Generate All Courses with Auto-Selected Instructors

```bash
# This uses the right instructor for each course automatically
python3 scripts/multi-instructor-generator.py --all
```

---

## 🐛 Troubleshooting

### "Missing assets for [instructor]"
```bash
# Run setup guide to see what's needed
python3 scripts/multi-instructor-generator.py --setup [instructor-id]
```

### "Unknown instructor"
```bash
# List available instructors
python3 scripts/multi-instructor-generator.py --list
```

### Voice sounds wrong
```bash
# Re-record with better equipment or hire professional
npm run record:voice
```

---

## ✅ Success Checklist

- [ ] Listed all 6 instructors
- [ ] Set up Dr. Sarah Chen (React)
- [ ] Generated test video with Sarah Chen
- [ ] Set up Marcus Williams (TypeScript)
- [ ] Generated test video with Marcus Williams
- [ ] Reviewed quality of both instructors
- [ ] Set up remaining 4 instructors (optional)
- [ ] Ready for batch production!

---

## 🎉 What's Next?

### Today
1. ✅ Review instructor profiles
2. ✅ Decide which instructors to create first
3. ✅ Setup 1-2 instructors (start with Sarah Chen)

### This Week
1. Setup remaining instructors
2. Generate test videos with each
3. Refine voice/photo if needed

### Next Week
1. Batch generate all courses
2. Each course uses appropriate instructor
3. Upload to CDN
4. Launch! 🚀

---

## 📚 Related Documentation

- [INSTRUCTOR_PROFILES.md](INSTRUCTOR_PROFILES.md) - Detailed instructor profiles
- [DEMO_INSTRUCTIONS.md](DEMO_INSTRUCTIONS.md) - Step-by-step demo
- [PRODUCTION_VIDEO_GUIDE.md](PRODUCTION_VIDEO_GUIDE.md) - Production workflow

---

**You now have a professional multi-instructor video academy system!** 🎓

Each course will have its own expert instructor, just like a real academy.
