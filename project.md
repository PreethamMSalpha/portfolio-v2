# Preetham's Portfolio - Technical Documentation

## 🎯 Project Overview
A high-performance, premium portfolio website built with modern web technologies, featuring advanced scroll-based animations, kinetic typography, and a sleek dark-mode aesthetic.

---

## 🏗️ Architecture & Tech Stack

### **Core Framework**
- **SvelteKit** (v2.0.0) - Meta-framework for building the application
- **Svelte 5** (v5.0.0) - Component framework with Runes API ($state, $derived, $effect)
- **TypeScript** (v5.0.0) - Type safety and better developer experience
- **Vite** (v5.0.3) - Build tool and dev server

### **Styling**
- **Tailwind CSS** (v3.4.0) - Utility-first CSS framework
- **PostCSS** (v8.4.32) - CSS processing
- **Autoprefixer** (v10.4.16) - Vendor prefix automation

### **Animation & Interaction**
- **GSAP** (v3.12.5) - Professional-grade animation library
  - ScrollTrigger plugin - Scroll-based animations
  - ScrollToPlugin - Smooth programmatic scrolling
- **Lenis** (v1.1.19) - Premium smooth scroll library
- **SplitType** (v0.3.4) - Text splitting for kinetic typography effects

### **Custom Components**
- `ScrollCanvas.svelte` - 3D canvas background with scroll-driven animations

---

## 📐 Project Structure

```
portfolio/
├── src/
│   ├── lib/
│   │   └── components/
│   │       └── ScrollCanvas.svelte      # 3D animated canvas background
│   ├── routes/
│   │   ├── +layout.svelte               # Root layout with Lenis setup
│   │   └── +page.svelte                 # Main portfolio page
│   ├── app.css                          # Global styles
│   └── app.html                         # HTML template
├── static/                              # Static assets
├── tailwind.config.js                   # Tailwind configuration
├── svelte.config.js                     # SvelteKit configuration
├── vite.config.js                       # Vite configuration
└── package.json                         # Dependencies
```

---

## 🎨 Design System

### **Color Palette**
- **Background**: Deep Black (#0A0A0A, #1a1a1a)
- **Primary Accent**: Yulu Blue (#00DCF6)
- **Secondary Accent**: Yulu Green (#9DC44D)
- **Text**: White with varying opacity (90%, 70%, 50%, 40%, 30%)

### **Typography**
- **Primary Font**: Geist Mono (monospace)
- **Secondary Font**: Geist Sans
- **Sizes**: Responsive scaling from mobile (text-xs) to desktop (text-9xl)

### **Visual Effects**
- **Glassmorphism**: `backdrop-blur-xl`, `bg-black/90`
- **Glows**: Box shadows with color/opacity variations
- **Borders**: Subtle white/10 borders with hover states

---

## 🎬 Key Features & Sections

### **1. Hero Section - Scroll Canvas (400vh)**
**Location**: Top of page  
**Technology**: Custom ScrollCanvas component + GSAP ScrollTrigger

**Features**:
- 3D animated canvas background (400vh tall)
- Three-phase kinetic typography system:
  - **Phase 1 (0-33%)**: "PREETHAM" - SDE-2 @ YULU
  - **Phase 2 (33-66%)**: "FULL-STACK ENGINEER"
  - **Phase 3 (66-100%)**: "ARCHITECTING SCALABLE SYSTEMS"
- Character-by-character animation with 3D rotation effects
- Smooth fade-in/fade-out transitions
- Phase 1 visible on page load with entrance animation

**Implementation Details**:
- Uses `SplitType` to split text into individual characters
- GSAP ScrollTrigger with `scrub: 1` for smooth scroll-sync
- Custom easing: `rotationX`, `scale`, `opacity` animations
- Staggered character animations (0.03s delay per character)

---

### **2. Timeline Section**
**Location**: After hero section  
**Technology**: GSAP ScrollTrigger + custom scroll interactions

**Features**:
- Vertical timeline with animated track
- Interactive timeline nodes with pulsing animations
- Card activation on scroll (blur/opacity transitions)
- Professional experience showcase
- Yulu Blue accent color for active states

**Implementation Details**:
- Active track animates height from 0 to 100% on scroll
- ScrollTrigger with `onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack` callbacks
- Node color changes: white/30 → Yulu Blue (#00DCF6)
- Card blur effect: `blur(2px)` → `blur(0px)`

---

### **3. Bento Grid - Tech Ecosystem**
**Location**: Mid-page  
**Technology**: CSS Grid + GSAP floating animations

**Features**:
- Responsive 3-column grid (1-column on mobile)
- Variable cell sizes (1x1, 2x1, 2x2)
- Glassmorphism cards with hover effects
- Floating icon animations
- Interactive Svelte 5 Rune code snippet toggle

**Implementation Details**:
- Grid: `grid-cols-1 md:grid-cols-3`
- Auto-rows: `auto-rows-[200px] md:auto-rows-[250px]`
- Floating animation: `gsap.to()` with `yoyo: true`, `repeat: -1`
- Staggered delays for natural movement

---

### **4. Project Gallery**
**Location**: Mid-page  
**Technology**: GSAP flip animations + parallax scrolling

**Features**:
- Project cards with front/back flip interaction
- Architecture diagrams on card back
- Parallax scroll effect on cards
- Hover states with border color transitions
- Technology tags with color-coded borders

**Implementation Details**:
- Flip animation: `rotateY: -90` → `rotateY: 90`
- Parallax: `y: -50 * (index + 1)` with ScrollTrigger scrub
- Card states managed with `.hidden` class toggles

---

### **5. Engineering Principles**
**Location**: Lower page  
**Technology**: GSAP staggered entrance animations

**Features**:
- 3D tilted cards with scroll-triggered entrance
- Staggered reveal (0.2s delay per card)
- Icon + title + description layout
- Hover effects with border color changes

**Implementation Details**:
- Initial state: `opacity: 0, y: 50, rotateX: 15`
- Animated to: `opacity: 1, y: 0, rotateX: 0`
- Trigger: `start: "top center+=100"`

---

### **6. Command Center - Footer**
**Location**: Bottom of page  
**Technology**: GSAP typing animation + interactive panels

**Features**:
- Terminal-style typing animation
- Developer mode toggle panel
- System specifications display
- Social links grid
- Last updated timestamp

**Implementation Details**:
- Typing effect: Character-by-character with `setInterval`
- Panel toggle: Fade + slide animation (`y: -20`)
- ScrollTrigger with `once: true` for one-time typing

---

### **7. Smart Sticky Return Button**
**Location**: Fixed bottom-right (appears after 36% scroll)  
**Technology**: GSAP + Lenis smooth scroll

**Features**:
- Vertical pill shape (w-12 h-24)
- Split layout: Arrow (top) + Scroll % (bottom)
- Color scheme: Yulu Green → Yulu Blue on hover
- Tooltip on hover: "EXECUTE_RESET"
- Elastic entrance animation
- Smooth scroll-to-top with Lenis integration

**Implementation Details**:
- Visibility: `scrollPercent > 36`
- Entrance: `gsap.fromTo()` with `elastic.out(1, 0.5)`
- Scroll: Lenis `scrollTo(0)` with 2.5s duration
- Hover state: Background fills with Yulu Blue, text turns black

---

## 🔧 Key Technical Implementations

### **Smooth Scrolling Setup**
**File**: `src/routes/+layout.svelte`

```javascript
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
});

// Expose to window for GSAP integration
window.lenis = lenis;
```

### **Svelte 5 Runes Usage**
```javascript
// Reactive state
let showBackToTop = $state(false);
let scrollPercentage = $state(0);
let isHovering = $state(false);

// Derived values (if needed)
let buttonOpacity = $derived(showBackToTop ? 1 : 0);
```

### **GSAP + Lenis Integration**
```javascript
const scrollToTop = () => {
    const lenis = window.lenis;
    if (lenis) {
        lenis.scrollTo(0, {
            duration: 2.5,
            easing: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        });
    }
};
```

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18+ recommended)
- npm or pnpm

### **Installation Steps**

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Environment Setup**
No environment variables required for basic setup.

---

## 🎯 Build Requirements to Recreate

### **1. Dependencies**
```json
{
  "dependencies": {
    "gsap": "^3.12.5",
    "lenis": "^1.1.19",
    "split-type": "^0.3.4"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "svelte": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.3"
  }
}
```

### **2. Core Components to Build**
1. **ScrollCanvas.svelte** - 3D canvas background
2. **+layout.svelte** - Lenis smooth scroll initialization
3. **+page.svelte** - Main portfolio page with all sections

### **3. Animation Systems**
- Kinetic typography with SplitType
- GSAP ScrollTrigger for scroll-based animations
- Lenis for smooth scrolling
- Custom easing functions

### **4. Styling Approach**
- Tailwind utility classes
- Custom CSS for complex animations
- Glassmorphism effects
- Responsive design (mobile-first)

---

## 🚀 Performance Optimizations

- **Lazy loading**: Images and heavy components
- **GSAP killTweensOf**: Cleanup on component destroy
- **ScrollTrigger refresh**: On resize events
- **Lenis RAF**: Optimized animation frame loop
- **Tailwind purge**: Remove unused CSS in production

---

## 📱 Responsive Design

- **Mobile**: Single column layouts, reduced font sizes
- **Tablet**: 2-column grids, medium font sizes
- **Desktop**: 3-column grids, large typography
- **Breakpoints**: Tailwind defaults (sm, md, lg, xl, 2xl)

---

## 🎨 Animation Patterns

### **Entrance Animations**
- Fade + slide from bottom
- Elastic bounce effects
- Staggered reveals

### **Scroll Animations**
- Parallax effects
- Fade in/out based on scroll position
- 3D rotations and transforms

### **Hover Animations**
- Color transitions (0.3s duration)
- Border glow effects
- Scale transforms

---

## 🔮 Future Enhancements (Optional)

- [ ] Add project case studies with detailed breakdowns
- [ ] Implement dark/light mode toggle
- [ ] Add contact form with email integration
- [ ] Create blog section with MDX support
- [ ] Add analytics (Vercel Analytics or Google Analytics)
- [ ] Implement i18n for multiple languages
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)

---

## 📄 License
Private project - All rights reserved

---

## 👨‍💻 Author
**Preetham MS**  
SDE-2 @ Yulu  
Full-Stack Engineer

---

*Last Updated: 2026-02-07*
