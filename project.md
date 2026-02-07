Act as a Senior Frontend Engineer and UI/UX Architect. Build a professional, high-performance portfolio using SvelteKit (with Svelte 5 Runes), Tailwind CSS, and GSAP.

### DESIGN DNA:
- Theme: "Cyber-Industrial" / "Deep Modern." Dark mode only (#0A0A0A background).
- Accents: Yulu Green (#9DC44D) and Electric Cyan.
- Feel: High-end engineering, heavy on "spatial depth" and glassmorphism.

### SECTION 1: THE LEAN CANVAS (Scroll-Driven Intro)
- Layout: Full-screen canvas with centered, massive typography.
- Behavior: Use GSAP ScrollTrigger to orchestrate 3 distinct phases within 150vh of scroll:
    1. Phase 1 (The Hook): "PREETHAM" in bold, high-contrast font. Subtext: "SDE-2 @ YULU".
    2. Phase 2 (The Specialty): Text morphs to "SCALING DASHBOARDS". Subtext: "Architecting real-time telemetry & full-stack systems for urban mobility."
    3. Phase 3 (The Tech): Text morphs to "ENGINEERED WITH SVELTE 5 & AWS". Subtext: "Focused on 99.9% reliability and sub-second performance."
- Transition: On scroll completion, the canvas text dissolves, and the background "crystallizes" into the next section.

### SECTION 2: THE BENTO-GRID SKILLS
- Layout: 3-column responsive Bento Grid with varying cell sizes (rounded-3xl, glassmorphism).
- Cells to Build:
    - Cell [2x2]: "Dashboard Engineering" - A mini-live chart or data-visualization widget (using SVG/Canvas) representing real-time telemetry.
    - Cell [1x1]: "Frontend" - Svelte 5, React, Next.js (Animated icons).
    - Cell [1x1]: "Backend" - Node.js, Go, Python (Animated icons).
    - Cell [2x1]: "Infra & Scale" - AWS, Docker, PostgreSQL (highlighting database optimization).
    - Cell [1x1]: "Status" - "Available in Bengaluru" with a pulsing Yulu-green dot.

### SECTION 3: PROJECT SHOWCASE (Morphing Island Style)
- Concept: A sleek list of projects. On click/hover, the card "morphs" (shared element transition) to reveal deep technical details.
- Projects:
    1. "Yulu Fleet Telemetry": Focused on high-scale data dashboards.
    2. "Relational Matchmaker": A full-stack matrimony engine with complex SQL logic.
    3. "Fin-Flow": A banking-grade transaction system with ACID compliance.

### TECHNICAL SPECS:
- Use Svelte 5 'Runes' ($state, $derived, $effect) for all reactive logic.
- Implement 'Lenis' or GSAP ScrollSmoother for premium inertia scrolling.
- Use Tailwind's 'backdrop-blur' and subtle borders for a high-end UI finish.
- Add a fixed 'System Console' footer that logs: "> System: Rendering Preetham.io [v2.026]".