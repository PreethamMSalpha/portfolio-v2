<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";
    import ScrollCanvas from "$lib/components/ScrollCanvas.svelte";

    gsap.registerPlugin(ScrollTrigger);

    onMount(() => {
        // Split text into characters for kinetic typography
        const heroTitle = document.querySelector("#hero-title");
        const section2Title = document.querySelector("#section-2-title");
        const section3Title = document.querySelector("#section-3-title");
        const section4Title = document.querySelector("#section-4-title");

        let splitHero: SplitType | null = null;
        let splitSection2: SplitType | null = null;
        let splitSection3: SplitType | null = null;
        let splitSection4: SplitType | null = null;

        if (heroTitle) {
            splitHero = new SplitType(heroTitle as HTMLElement, {
                types: "chars,words",
            });
        }
        if (section2Title) {
            splitSection2 = new SplitType(section2Title as HTMLElement, {
                types: "chars,words",
            });
        }
        if (section3Title) {
            splitSection3 = new SplitType(section3Title as HTMLElement, {
                types: "chars,words",
            });
        }
        if (section4Title) {
            splitSection4 = new SplitType(section4Title as HTMLElement, {
                types: "chars,words",
            });
        }

        // Animate text sections based on scroll position
        const sections = [
            {
                id: "#section-1",
                startPercent: 0,
                endPercent: 25,
                split: splitHero,
            },
            {
                id: "#section-2",
                startPercent: 25,
                endPercent: 50,
                split: splitSection2,
            },
            {
                id: "#section-3",
                startPercent: 50,
                endPercent: 75,
                split: splitSection3,
            },
            {
                id: "#section-4",
                startPercent: 75,
                endPercent: 100,
                split: splitSection4,
            },
        ];

        const container = document.querySelector(".text-overlay-container");
        if (!container) return;

        sections.forEach((section) => {
            const element = document.querySelector(section.id);
            if (!element) return;

            // Set initial state - all sections start invisible
            gsap.set(element, { opacity: 0, y: 50 });

            // Kinetic typography animation for characters
            if (section.split && section.split.chars) {
                gsap.set(section.split.chars, {
                    opacity: 0,
                    y: 100,
                    rotationX: -90,
                    transformOrigin: "50% 50%",
                });
            }

            // Create individual ScrollTrigger for each section
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress * 100; // 0-100
                    const { startPercent, endPercent } = section;

                    // Calculate fade ranges (5% fade in/out)
                    const fadeInStart = startPercent;
                    const fadeInEnd = startPercent + 8;
                    const fadeOutStart = endPercent - 8;
                    const fadeOutEnd = endPercent;

                    let opacity = 0;
                    let y = 50;

                    if (progress >= fadeInStart && progress < fadeInEnd) {
                        // Fading in
                        const fadeProgress = (progress - fadeInStart) / 8;
                        opacity = fadeProgress;
                        y = 50 * (1 - fadeProgress);

                        // Kinetic typography: Animate characters
                        if (section.split && section.split.chars) {
                            section.split.chars.forEach(
                                (char: Element, i: number) => {
                                    const charProgress = Math.max(
                                        0,
                                        Math.min(
                                            1,
                                            fadeProgress * 1.5 - i * 0.02,
                                        ),
                                    );
                                    gsap.set(char, {
                                        opacity: charProgress,
                                        y: 100 * (1 - charProgress),
                                        rotationX: -90 * (1 - charProgress),
                                        scale: 0.5 + charProgress * 0.5,
                                    });
                                },
                            );
                        }
                    } else if (
                        progress >= fadeInEnd &&
                        progress < fadeOutStart
                    ) {
                        // Fully visible
                        opacity = 1;
                        y = 0;

                        // Characters fully visible
                        if (section.split && section.split.chars) {
                            gsap.set(section.split.chars, {
                                opacity: 1,
                                y: 0,
                                rotationX: 0,
                                scale: 1,
                            });
                        }
                    } else if (
                        progress >= fadeOutStart &&
                        progress < fadeOutEnd
                    ) {
                        // Fading out
                        const fadeProgress = (progress - fadeOutStart) / 8;
                        opacity = 1 - fadeProgress;
                        y = -50 * fadeProgress;

                        // Kinetic typography: Animate characters out
                        if (section.split && section.split.chars) {
                            section.split.chars.forEach(
                                (char: Element, i: number) => {
                                    const charProgress = Math.max(
                                        0,
                                        Math.min(
                                            1,
                                            fadeProgress * 1.5 - i * 0.02,
                                        ),
                                    );
                                    gsap.set(char, {
                                        opacity: 1 - charProgress,
                                        y: -100 * charProgress,
                                        rotationX: 90 * charProgress,
                                        scale: 1 - charProgress * 0.5,
                                    });
                                },
                            );
                        }
                    }

                    gsap.set(element, { opacity, y });
                },
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            splitHero?.revert();
            splitSection2?.revert();
            splitSection3?.revert();
            splitSection4?.revert();
        };
    });
</script>

<svelte:head>
    <title>Full-Stack Developer Portfolio | Architecting the Future</title>
    <meta
        name="description"
        content="Explore a world-class portfolio showcasing full-stack development expertise with cutting-edge technologies and scalable solutions."
    />
</svelte:head>

<main class="relative">
    <!-- Canvas Background with built-in scroll container -->
    <ScrollCanvas />

    <!-- Text Content Overlay (positioned absolutely over the canvas) -->
    <div
        class="text-overlay-container absolute top-0 left-0 w-full h-[400vh] z-10 pointer-events-none"
    >
        <!-- Section 1: 0-25% - Architecting the Future -->
        <section
            id="section-1"
            class="sticky top-0 h-screen flex items-end justify-center pb-16"
        >
            <div class="text-center px-4">
                <h1
                    id="hero-title"
                    class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6"
                >
                    Hi!<br /> I'm Preetham.
                </h1>
                <p
                    class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light"
                >
                    Full-Stack Developer crafting exceptional digital
                    experiences
                </p>
            </div>
        </section>

        <!-- Section 2: 25-50% - Frontend Precision -->
        <section
            id="section-2"
            class="sticky top-0 h-screen flex items-center justify-end"
        >
            <div class="text-right px-8 md:px-16 lg:px-24 max-w-2xl">
                <h2
                    id="section-2-title"
                    class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                >
                    Frontend<br /><span class="text-gradient">Precision</span>
                </h2>
                <p
                    class="text-base md:text-lg text-white/90 font-light leading-relaxed"
                >
                    Crafting pixel-perfect interfaces with React, Svelte, and
                    Next.js. Every interaction is meticulously designed for
                    performance and delight.
                </p>
                <div class="mt-8 flex flex-wrap gap-3 justify-end">
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >React</span
                    >
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >Svelte 5</span
                    >
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >TypeScript</span
                    >
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >GSAP</span
                    >
                </div>
            </div>
        </section>

        <!-- Section 3: 50-75% - Scalable Backends -->
        <section
            id="section-3"
            class="sticky top-0 h-screen flex items-center justify-start"
        >
            <div class="text-left px-8 md:px-16 lg:px-24 max-w-2xl">
                <h2
                    id="section-3-title"
                    class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                >
                    Scalable<br /><span class="text-gradient">Backends</span>
                </h2>
                <p
                    class="text-base md:text-lg text-white/90 font-light leading-relaxed"
                >
                    Building robust server architectures with Node.js, Python,
                    and cloud-native solutions. Designed to scale from zero to
                    millions.
                </p>
                <div class="mt-8 flex flex-wrap gap-3">
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >Node.js</span
                    >
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >PostgreSQL</span
                    >
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >Docker</span
                    >
                    <span
                        class="glass-effect px-4 py-2 rounded-full text-sm text-cyan-400"
                        >AWS</span
                    >
                </div>
            </div>
        </section>

        <!-- Section 4: 75-100% - Full-Stack Mastery -->
        <section
            id="section-4"
            class="sticky top-0 h-screen flex items-center justify-center"
        >
            <div class="text-center px-4">
                <h2
                    id="section-4-title"
                    class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                >
                    Full-Stack<br /><span class="text-gradient">Mastery</span>
                </h2>
                <p
                    class="text-base md:text-lg text-white/90 font-light leading-relaxed max-w-2xl mx-auto mb-12"
                >
                    End-to-end solutions that bridge design, development, and
                    deployment. Let's build something extraordinary together.
                </p>
                <div class="flex gap-4 justify-center pointer-events-auto">
                    <a
                        href="#contact"
                        class="glass-effect px-8 py-4 rounded-full text-white/90 font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    >
                        Get in Touch
                    </a>
                    <a
                        href="#projects"
                        class="bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 rounded-full text-dark font-medium hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-105"
                    >
                        View Projects
                    </a>
                </div>
            </div>
        </section>
    </div>

    <!-- Footer Section (after scroll container) -->
    <footer class="relative z-10 bg-dark-lighter py-16 px-8">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h3 class="text-2xl font-bold text-white/95 mb-4">
                        Let's Connect
                    </h3>
                    <p class="text-white/50 font-light">
                        Available for freelance projects and full-time
                        opportunities.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-white/90 mb-4">
                        Quick Links
                    </h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="#about"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >About</a
                            >
                        </li>
                        <li>
                            <a
                                href="#projects"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >Projects</a
                            >
                        </li>
                        <li>
                            <a
                                href="#skills"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >Skills</a
                            >
                        </li>
                        <li>
                            <a
                                href="#contact"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >Contact</a
                            >
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-white/90 mb-4">
                        Social
                    </h4>
                    <ul class="space-y-2">
                        <li>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >GitHub</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >LinkedIn</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-white/50 hover:text-cyan-400 transition-colors"
                                >Twitter</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-12 pt-8 border-t border-white/10 text-center">
                <p class="text-white/40 text-sm">
                    © 2026 Full-Stack Developer Portfolio. Crafted with Svelte
                    5, GSAP & Lenis.
                </p>
            </div>
        </div>
    </footer>
</main>

<style>
    /* Ensure smooth rendering */
    main {
        will-change: transform;
    }

    section {
        will-change: opacity, transform;
        perspective: 1000px;
    }

    /* Kinetic typography styles */
    :global(.char) {
        display: inline-block;
        transform-style: preserve-3d;
        will-change: transform, opacity;
        backface-visibility: hidden;
        /* Minimal text shadow for subtle depth */
        text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.2);
    }

    :global(.word) {
        display: inline-block;
        white-space: pre;
    }

    /* Add perspective to title elements */
    h1,
    h2 {
        perspective: 1000px;
        transform-style: preserve-3d;
        /* Minimal text shadow for readability */
        text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.2);
    }

    /* Subtle shadow for paragraphs */
    section p {
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
</style>
