# Phazur Labs Academy - Design System

> Inspired by Coursera's UX/UI patterns for familiarity and usability

---

## Design Philosophy

1. **Content-First** - Let courses and learning content be the hero
2. **Clean & Professional** - White space, subtle shadows, minimal decoration
3. **Information Dense** - Show relevant data upfront (ratings, duration, level)
4. **Trust Signals** - Partner logos, ratings, enrollment counts
5. **Personalization** - Guide users based on their goals

---

## Color Palette

```css
/* Primary */
--primary: #0056D2;        /* Coursera Blue */
--primary-hover: #004BB5;
--primary-light: #E8F0FE;

/* Neutral */
--background: #FFFFFF;
--foreground: #1F1F1F;
--muted: #636363;
--muted-light: #8C8C8C;
--border: #E5E5E5;
--border-light: #F5F5F5;

/* Accent */
--success: #067D62;        /* Green for completion */
--warning: #E87722;        /* Orange for badges */
--info: #0056D2;           /* Blue for info */

/* Background Variants */
--surface: #FFFFFF;
--surface-secondary: #F8F9FA;
--surface-tertiary: #F0F2F5;
```

---

## Typography

```css
/* Font Family */
font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px - Badges, metadata */
--text-sm: 0.875rem;   /* 14px - Body small, labels */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Section headers */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero headings */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Component Patterns

### Navigation (Header)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Logo]    For Individuals | For Business | For Universities            │
│           ──────────────────────────────────────────────────            │
│           [Search...                                    ]    Sign In   │
│           Browse ▼    Courses    Certifications               Join Free│
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Simple logo (icon + text)
- Audience toggle: Individuals / Business / Universities
- Prominent search bar
- Browse dropdown with categories
- Sign In (text) / Join Free (button)

---

### Course Card

```
┌────────────────────────────────────────┐
│ [Course Image - 16:9]                  │
│ ┌──────┐                               │
│ │Logo  │                               │
│ └──────┘                               │
├────────────────────────────────────────┤
│ [Free Trial] [AI skills]               │
│                                        │
│ Course Title Here That Can             │
│ Wrap to Two Lines Maximum              │
│                                        │
│ Skills: React, Node.js, +3 more        │
│                                        │
│ ★ 4.8 (12K reviews)                    │
│ Beginner · Course · 1-3 Months         │
└────────────────────────────────────────┘
```

**Data Points:**
- Image with partner logo overlay
- Badges (Free Trial, AI skills, Bestseller)
- Title (2 lines max)
- Skills preview
- Rating + review count
- Level · Type · Duration

---

### Course Detail Hero

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Partner Logo] [Partner Logo]                                          │
│                                                                         │
│ Course Title Here                                        ┌─────────────┐│
│                                                          │ Enroll Now  ││
│ [Instructor Avatars] Instructor Names                    │             ││
│                                                          │ Starts Jan  ││
│ ★ 4.9 (31K reviews) · Beginner · 3 weeks · 10 hrs/week  │ Financial   ││
│                                                          │ Aid Avail.  ││
│ ────────────────────────────────────────────────         └─────────────┘│
│ About | Outcomes | Modules | Reviews                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Filter Sidebar (Catalog)

```
┌──────────────────────┐
│ Filters              │
├──────────────────────┤
│ Subject              │
│ ○ Development        │
│ ○ Data Science       │
│ ○ Business           │
│ ○ AI & ML            │
├──────────────────────┤
│ Level                │
│ □ Beginner           │
│ □ Intermediate       │
│ □ Advanced           │
├──────────────────────┤
│ Duration             │
│ □ < 1 Month          │
│ □ 1-3 Months         │
│ □ 3-6 Months         │
├──────────────────────┤
│ Language             │
│ □ English            │
│ □ Spanish            │
└──────────────────────┘
```

---

## Page Layouts

### Homepage Structure

1. **Hero** - Personalization prompt ("What brings you to Coursera?")
2. **Category Pills** - Quick browse by topic
3. **Featured Courses** - Horizontal carousel
4. **Learning Paths** - Career-focused tracks
5. **Partners** - University/company logos
6. **Testimonials** - Learner success stories
7. **Stats** - Social proof numbers
8. **CTA** - Final call to action
9. **Footer** - Links, legal, social

### Catalog Structure

1. **Search Header** - Search bar + result count
2. **Two-Column Layout**
   - Left: Filter sidebar (sticky)
   - Right: Course grid (3 columns)
3. **Pagination** - Load more / page numbers

### Course Detail Structure

1. **Breadcrumb** - Navigation path
2. **Hero Section** - Title, instructors, stats, CTA card
3. **Sticky Nav** - About | Outcomes | Modules | Reviews
4. **About Section** - Description, skills, what you'll learn
5. **Modules Section** - Collapsible curriculum
6. **Instructor Section** - Bio cards
7. **Reviews Section** - Rating breakdown, testimonials
8. **Related Courses** - Recommendations

---

## Interaction Patterns

### Hover States
- Cards: Subtle shadow elevation
- Links: Color change to primary
- Buttons: Slight darken

### Loading States
- Skeleton loaders matching content shape
- Pulse animation

### Empty States
- Friendly illustration
- Clear action CTA

---

## Responsive Breakpoints

```css
--mobile: 640px;
--tablet: 768px;
--laptop: 1024px;
--desktop: 1280px;
--wide: 1536px;
```

### Mobile Adaptations
- Hamburger menu
- Single column cards
- Bottom sheet filters
- Sticky bottom CTA

---

## Accessibility

- Minimum contrast ratio: 4.5:1
- Focus indicators on all interactive elements
- Skip navigation links
- ARIA labels on icons
- Keyboard navigation support

---

*Reference: coursera.org (January 2026)*
