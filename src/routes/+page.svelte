<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { ScrollToPlugin } from "gsap/ScrollToPlugin";
    import SplitType from "split-type";
    import ScrollCanvas from "$lib/components/ScrollCanvas.svelte";

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Svelte 5 Runes for Back-to-Top Button
    let showBackToTop = $state(false);
    let scrollPercentage = $state(0);
    let isHovering = $state(false);

    // Back-to-Top Logic
    const scrollToTop = () => {
        gsap.to(window, {
            scrollTo: { y: 0, autoKill: true },
            duration: 1.5,
            ease: "expo.out",
        });
    };

    const animateEntrance = (node: HTMLElement) => {
        gsap.fromTo(
            node,
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" },
        );

        return {
            destroy() {
                gsap.killTweensOf(node);
            },
        };
    };

    onMount(() => {
        // Split text into characters for kinetic typography - 3 phases
        const phase1Title = document.querySelector("#phase-1-title");
        const phase2Title = document.querySelector("#phase-2-title");
        const phase3Title = document.querySelector("#phase-3-title");

        let splitPhase1: SplitType | null = null;
        let splitPhase2: SplitType | null = null;
        let splitPhase3: SplitType | null = null;

        if (phase1Title) {
            splitPhase1 = new SplitType(phase1Title as HTMLElement, {
                types: "chars,words",
            });
        }
        if (phase2Title) {
            splitPhase2 = new SplitType(phase2Title as HTMLElement, {
                types: "chars,words",
            });
        }
        if (phase3Title) {
            splitPhase3 = new SplitType(phase3Title as HTMLElement, {
                types: "chars,words",
            });
        }

        // Animate text sections based on scroll position - 3 phases
        const phases = [
            {
                id: "#phase-1",
                startPercent: 0,
                endPercent: 33.33,
                split: splitPhase1,
            },
            {
                id: "#phase-2",
                startPercent: 33.33,
                endPercent: 66.66,
                split: splitPhase2,
            },
            {
                id: "#phase-3",
                startPercent: 66.66,
                endPercent: 100,
                split: splitPhase3,
            },
        ];

        const container = document.querySelector(".text-overlay-container");
        if (!container) return;

        phases.forEach((phase) => {
            const element = document.querySelector(phase.id);
            if (!element) return;

            // Set initial state - all phases start invisible
            gsap.set(element, { opacity: 0, y: 50 });

            // Kinetic typography animation for characters
            if (phase.split && phase.split.chars) {
                gsap.set(phase.split.chars, {
                    opacity: 0,
                    y: 100,
                    rotationX: -90,
                    transformOrigin: "50% 50%",
                });
            }

            // Create individual ScrollTrigger for each phase
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress * 100; // 0-100
                    const { startPercent, endPercent } = phase;

                    // Calculate fade ranges
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
                        if (phase.split && phase.split.chars) {
                            phase.split.chars.forEach(
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
                        if (phase.split && phase.split.chars) {
                            gsap.set(phase.split.chars, {
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
                        if (phase.split && phase.split.chars) {
                            phase.split.chars.forEach(
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

        // Timeline Scroll Interactions
        const timelineSection = document.querySelector("#timeline-section");
        const activeTrack = document.querySelector("#active-track");
        const timelineItems = document.querySelectorAll(".timeline-item");

        if (timelineSection && activeTrack) {
            // Set initial states for all timeline items
            timelineItems.forEach((item, index) => {
                const card = item.querySelector(".timeline-card");
                const node = item.querySelector(".timeline-node > div");
                const pingAnimation = node?.querySelector(".animate-ping");

                // Set initial state (all inactive except first)
                if (index === 0) {
                    gsap.set(card, { opacity: 1, filter: "blur(0px)" });
                    gsap.set(node, { backgroundColor: "#00DCF6", scale: 1.2 });
                    if (pingAnimation) {
                        gsap.set(pingAnimation, { opacity: 0.75 });
                    }
                } else {
                    gsap.set(card, { opacity: 0.3, filter: "blur(2px)" });
                    gsap.set(node, {
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        scale: 1,
                    });
                    if (pingAnimation) {
                        gsap.set(pingAnimation, { opacity: 0 });
                    }
                }
            });

            // Animate the active track (Yulu Green line)
            gsap.to(activeTrack, {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: timelineSection,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                },
            });

            // Animate each timeline item
            timelineItems.forEach((item, index) => {
                const card = item.querySelector(".timeline-card");
                const node = item.querySelector(".timeline-node > div");
                const pingAnimation = node?.querySelector(".animate-ping");

                ScrollTrigger.create({
                    trigger: item,
                    start: "top center+=100",
                    end: "bottom center-=100",
                    onEnter: () => {
                        // Activate card
                        gsap.to(card, {
                            opacity: 1,
                            filter: "blur(0px)",
                            duration: 0.5,
                        });
                        // Activate node
                        gsap.to(node, {
                            backgroundColor: "#00DCF6",
                            scale: 1.2,
                            duration: 0.3,
                        });
                        // Show ping animation
                        if (pingAnimation) {
                            gsap.to(pingAnimation, {
                                opacity: 0.75,
                                duration: 0.3,
                            });
                        }
                        // Make title bold
                        const title = card?.querySelector("h3");
                        if (title) {
                            title.style.fontWeight = "900";
                        }
                    },
                    onLeave: () => {
                        // Deactivate card
                        gsap.to(card, {
                            opacity: 0.3,
                            filter: "blur(2px)",
                            duration: 0.5,
                        });
                        // Deactivate node
                        gsap.to(node, {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            scale: 1,
                            duration: 0.3,
                        });
                        // Hide ping animation
                        if (pingAnimation) {
                            gsap.to(pingAnimation, {
                                opacity: 0,
                                duration: 0.3,
                            });
                        }
                        // Make title normal weight
                        const title = card?.querySelector("h3");
                        if (title) {
                            title.style.fontWeight = "700";
                        }
                    },
                    onEnterBack: () => {
                        // Activate card
                        gsap.to(card, {
                            opacity: 1,
                            filter: "blur(0px)",
                            duration: 0.5,
                        });
                        // Activate node
                        gsap.to(node, {
                            backgroundColor: "#00DCF6",
                            scale: 1.2,
                            duration: 0.3,
                        });
                        // Show ping animation
                        if (pingAnimation) {
                            gsap.to(pingAnimation, {
                                opacity: 0.75,
                                duration: 0.3,
                            });
                        }
                        // Make title bold
                        const title = card?.querySelector("h3");
                        if (title) {
                            title.style.fontWeight = "900";
                        }
                    },
                    onLeaveBack: () => {
                        // Deactivate card
                        gsap.to(card, {
                            opacity: 0.3,
                            filter: "blur(2px)",
                            duration: 0.5,
                        });
                        // Deactivate node
                        gsap.to(node, {
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            scale: 1,
                            duration: 0.3,
                        });
                        // Hide ping animation
                        if (pingAnimation) {
                            gsap.to(pingAnimation, {
                                opacity: 0,
                                duration: 0.3,
                            });
                        }
                        // Make title normal weight
                        const title = card?.querySelector("h3");
                        if (title) {
                            title.style.fontWeight = "700";
                        }
                    },
                });
            });
        }

        // Bento Grid Interactions
        const runeToggle = document.querySelector("#rune-toggle");
        const runeSnippet = document.querySelector("#rune-snippet");

        if (runeToggle && runeSnippet) {
            runeToggle.addEventListener("click", () => {
                if (runeSnippet.classList.contains("hidden")) {
                    runeSnippet.classList.remove("hidden");
                    gsap.from(runeSnippet, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                    });
                } else {
                    gsap.to(runeSnippet, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        onComplete: () => {
                            runeSnippet.classList.add("hidden");
                        },
                    });
                }
            });
        }

        // Enhanced floating animations for Bento Grid icons
        const floatingIcons = document.querySelectorAll(".floating-icon");
        floatingIcons.forEach((icon, index) => {
            gsap.to(icon, {
                y: -15,
                duration: 2 + index * 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: index * 0.3,
            });
        });

        // Project Gallery Flip Interactions
        const viewArchitectureBtns = document.querySelectorAll(
            ".view-architecture-btn",
        );
        const closeArchitectureBtns = document.querySelectorAll(
            ".close-architecture-btn",
        );

        viewArchitectureBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const container = (e.target as HTMLElement).closest(
                    ".project-flip-container",
                );
                if (container) {
                    const front = container.querySelector(
                        ".project-front",
                    ) as HTMLElement;
                    const back = container.querySelector(
                        ".project-back",
                    ) as HTMLElement;

                    gsap.to(front, {
                        opacity: 0,
                        rotateY: -90,
                        duration: 0.3,
                        onComplete: () => {
                            front.classList.add("hidden");
                            back.classList.remove("hidden");
                            gsap.fromTo(
                                back,
                                { opacity: 0, rotateY: 90 },
                                { opacity: 1, rotateY: 0, duration: 0.3 },
                            );
                        },
                    });
                }
            });
        });

        closeArchitectureBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const container = (e.target as HTMLElement).closest(
                    ".project-flip-container",
                );
                if (container) {
                    const front = container.querySelector(
                        ".project-front",
                    ) as HTMLElement;
                    const back = container.querySelector(
                        ".project-back",
                    ) as HTMLElement;

                    gsap.to(back, {
                        opacity: 0,
                        rotateY: 90,
                        duration: 0.3,
                        onComplete: () => {
                            back.classList.add("hidden");
                            front.classList.remove("hidden");
                            gsap.fromTo(
                                front,
                                { opacity: 0, rotateY: -90 },
                                { opacity: 1, rotateY: 0, duration: 0.3 },
                            );
                        },
                    });
                }
            });
        });

        // Parallax effect for project cards
        const projectCards = document.querySelectorAll(
            ".project-card-container",
        );
        projectCards.forEach((card, index) => {
            gsap.to(card, {
                y: -50 * (index + 1),
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        });

        // Engineering Principles: Staggered Scroll Entrance with 3D Tilt
        const principleCards = document.querySelectorAll(".principle-card");

        gsap.to(principleCards, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#engineering-principles",
                start: "top center+=100",
                toggleActions: "play none none none",
            },
        });

        // Set initial state for principle cards with 3D tilt
        gsap.set(principleCards, { opacity: 0, y: 50, rotateX: 15 });

        // Command Center: Terminal Typing Animation
        const terminalLines = [
            "initializing_portfolio_system...",
            "loading_projects_and_experience...",
            "all_systems_operational. ready_for_connection.",
        ];

        const typeText = (
            element: HTMLElement,
            text: string,
            speed: number = 50,
        ) => {
            return new Promise<void>((resolve) => {
                let i = 0;
                const interval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(interval);
                        resolve();
                    }
                }, speed);
            });
        };

        ScrollTrigger.create({
            trigger: "#command-center",
            start: "top bottom-=100",
            once: true,
            onEnter: async () => {
                const line1 = document.querySelector(
                    "#terminal-line-1",
                ) as HTMLElement;
                const line2 = document.querySelector(
                    "#terminal-line-2",
                ) as HTMLElement;
                const line3 = document.querySelector(
                    "#terminal-line-3",
                ) as HTMLElement;

                if (line1 && line2 && line3) {
                    await typeText(line1, terminalLines[0], 30);
                    line2.parentElement?.classList.remove("hidden");
                    await typeText(line2, terminalLines[1], 30);
                    line3.parentElement?.classList.remove("hidden");
                    await typeText(line3, terminalLines[2], 30);
                }
            },
        });

        // Developer Mode Toggle
        const devModeToggle = document.querySelector("#dev-mode-toggle");
        const devModePanel = document.querySelector(
            "#dev-mode-panel",
        ) as HTMLElement;

        if (devModeToggle && devModePanel) {
            devModeToggle.addEventListener("click", () => {
                if (devModePanel.classList.contains("hidden")) {
                    // Show panel
                    devModePanel.classList.remove("hidden");
                    gsap.fromTo(
                        devModePanel,
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, duration: 0.3 },
                    );
                } else {
                    // Hide panel
                    gsap.to(devModePanel, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        onComplete: () => {
                            devModePanel.classList.add("hidden");
                            // Reset for next time
                            gsap.set(devModePanel, { opacity: 1, y: 0 });
                        },
                    });
                }
            });
        }

        // Scroll Tracking for Back-to-Top Button
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            scrollPercentage = scrollPercent;
            showBackToTop = scrollPercent > 36; // Show after 36% scroll
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            splitPhase1?.revert();
            splitPhase2?.revert();
            splitPhase3?.revert();
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
        <!-- Phase 1: The Hook (0-33%) -->
        <section
            id="phase-1"
            class="sticky top-0 h-screen flex items-end justify-center pb-16"
        >
            <div class="text-center px-4">
                <h1
                    id="phase-1-title"
                    class="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6"
                >
                    PREETHAM
                </h1>
                <p
                    class="text-2xl md:text-3xl lg:text-4xl text-white/90 max-w-2xl mx-auto font-medium"
                >
                    SDE-2 @ YULU • FULL STACK ENGINEER
                </p>
            </div>
        </section>

        <!-- Phase 2: The Specialty (33%-66%) -->
        <section
            id="phase-2"
            class="sticky top-0 h-screen flex items-center justify-end"
        >
            <div class="text-right px-8 md:px-16 lg:px-24 max-w-2xl">
                <h2
                    id="phase-2-title"
                    class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                >
                    OPERATIONAL<br />ARCHITECTURE
                </h2>
                <p
                    class="text-base md:text-lg text-white/90 font-light leading-relaxed"
                >
                    Engineering core business platforms to synchronize complex
                    inventory flows and organizational workflows.
                </p>
            </div>
        </section>

        <!-- Phase 3: The Tech (66%-100%) -->
        <section
            id="phase-3"
            class="sticky top-0 h-screen flex items-center justify-start"
        >
            <div class="text-left px-8 md:px-16 lg:px-24 max-w-2xl">
                <h2
                    id="phase-3-title"
                    class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                >
                    OPERATIONAL<br />INTEGRITY
                </h2>
                <p
                    class="text-base md:text-lg text-white/90 font-light leading-relaxed"
                >
                    Developing high-reliability systems to ensure precision in
                    inventory management, eliminate operational friction, and
                    streamline customer support ecosystems.
                </p>
            </div>
        </section>
    </div>

    <!-- Professional Timeline Section -->
    <section
        id="timeline-section"
        class="relative z-10 bg-dark py-16 md:py-32 px-4 md:px-8"
    >
        <div class="max-w-4xl mx-auto">
            <h2
                class="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 text-center"
            >
                PROFESSIONAL TIMELINE
            </h2>
            <p
                class="text-center text-white/50 mb-12 md:mb-20 font-mono text-xs md:text-sm"
            >
                SCROLL TO EXPLORE
            </p>

            <!-- Timeline Container -->
            <div id="timeline-track" class="relative">
                <!-- Vertical Track Line -->
                <div
                    class="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10"
                >
                    <!-- Active Track (Yulu Green) -->
                    <div
                        id="active-track"
                        class="absolute top-0 left-0 w-full bg-[#00DCF6] origin-top"
                        style="height: 0%;"
                    ></div>
                </div>

                <!-- Timeline Items -->
                <div class="space-y-16 md:space-y-32">
                    <!-- Experience 1: Yulu (Current) -->
                    <div
                        class="timeline-item relative pl-12 md:pl-0"
                        data-index="0"
                    >
                        <!-- Pulsing Node -->
                        <div
                            class="timeline-node absolute left-4 md:left-1/2 top-0 -translate-x-1/2"
                        >
                            <div
                                class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#00DCF6] relative"
                            >
                                <div
                                    class="absolute inset-0 rounded-full bg-[#00DCF6] animate-ping opacity-75"
                                ></div>
                            </div>
                        </div>

                        <!-- Content Card -->
                        <div
                            class="timeline-card md:ml-[calc(50%+3rem)] bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 transition-all duration-500"
                        >
                            <div class="flex items-center gap-3 mb-2">
                                <span
                                    class="px-2 md:px-3 py-1 bg-[#00DCF6]/20 text-[#00DCF6] rounded-full text-[10px] md:text-xs font-mono font-bold"
                                >
                                    CURRENT
                                </span>
                            </div>
                            <h3
                                class="text-xl md:text-3xl font-bold text-white mb-2 font-mono"
                            >
                                Yulu | SDE-2 (Full Stack)
                            </h3>
                            <p
                                class="text-white/40 font-mono text-xs md:text-sm mb-4 md:mb-6"
                            >
                                2023 - Present
                            </p>
                            <ul
                                class="space-y-2 md:space-y-3 text-sm md:text-base text-white/70 font-light leading-relaxed"
                            >
                                <li class="flex gap-2 md:gap-3">
                                    <span
                                        class="text-[#00DCF6] mt-1 text-xs md:text-base"
                                        >▸</span
                                    >
                                    <span
                                        >Architecting internal business
                                        operation dashboards to streamline
                                        organizational workflows.</span
                                    >
                                </li>
                                <li class="flex gap-2 md:gap-3">
                                    <span
                                        class="text-[#00DCF6] mt-1 text-xs md:text-base"
                                        >▸</span
                                    >
                                    <span
                                        >Engineering high-precision inventory
                                        management systems to ensure operational
                                        integrity.</span
                                    >
                                </li>
                                <li class="flex gap-2 md:gap-3">
                                    <span
                                        class="text-[#00DCF6] mt-1 text-xs md:text-base"
                                        >▸</span
                                    >
                                    <span
                                        >Developing robust customer support
                                        ecosystems to eliminate friction and
                                        improve resolution speed.</span
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Experience 2: Previous Company -->
                    <div
                        class="timeline-item relative pl-12 md:pl-0"
                        data-index="1"
                    >
                        <!-- Pulsing Node -->
                        <div
                            class="timeline-node absolute left-4 md:left-1/2 top-0 -translate-x-1/2"
                        >
                            <div
                                class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/30 relative"
                            >
                                <div
                                    class="absolute inset-0 rounded-full bg-[#00DCF6] animate-ping opacity-0"
                                ></div>
                            </div>
                        </div>

                        <!-- Content Card -->
                        <div
                            class="timeline-card md:ml-[calc(50%+3rem)] bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 transition-all duration-500 opacity-30"
                        >
                            <h3
                                class="text-xl md:text-3xl font-bold text-white mb-2 font-mono"
                            >
                                [Previous Company] | [Your Role]
                            </h3>
                            <p
                                class="text-white/40 font-mono text-xs md:text-sm mb-4 md:mb-6"
                            >
                                20XX - 20XX
                            </p>
                            <ul
                                class="space-y-2 md:space-y-3 text-sm md:text-base text-white/70 font-light leading-relaxed"
                            >
                                <li class="flex gap-2 md:gap-3">
                                    <span class="text-[#00DCF6] mt-1">▸</span>
                                    <span
                                        >Focus on JavaScript mastery and
                                        Full-Stack feature delivery.</span
                                    >
                                </li>
                                <li class="flex gap-3">
                                    <span class="text-[#00DCF6] mt-1">▸</span>
                                    <span
                                        >[Specific technical achievement to be
                                        filled]</span
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Experience 3: Earlier Company -->
                    <div
                        class="timeline-item relative pl-12 md:pl-0"
                        data-index="2"
                    >
                        <!-- Pulsing Node -->
                        <div
                            class="timeline-node absolute left-4 md:left-1/2 top-0 -translate-x-1/2"
                        >
                            <div
                                class="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/30 relative"
                            >
                                <div
                                    class="absolute inset-0 rounded-full bg-[#00DCF6] animate-ping opacity-0"
                                ></div>
                            </div>
                        </div>

                        <!-- Content Card -->
                        <div
                            class="timeline-card md:ml-[calc(50%+3rem)] bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 transition-all duration-500 opacity-30"
                        >
                            <h3
                                class="text-xl md:text-3xl font-bold text-white mb-2 font-mono"
                            >
                                [Earlier Company/Internship] | [Role]
                            </h3>
                            <p
                                class="text-white/40 font-mono text-xs md:text-sm mb-4 md:mb-6"
                            >
                                20XX - 20XX
                            </p>
                            <ul
                                class="space-y-2 md:space-y-3 text-sm md:text-base text-white/70 font-light leading-relaxed"
                            >
                                <li class="flex gap-3">
                                    <span class="text-[#00DCF6] mt-1">▸</span>
                                    <span
                                        >[Specific technical achievement to be
                                        filled]</span
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- The Ecosystem: Bento Grid Toolkit -->
    <section
        id="bento-grid"
        class="relative z-10 bg-dark-lighter py-16 md:py-32 px-4 md:px-8"
    >
        <div class="max-w-7xl mx-auto">
            <h2
                class="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 text-center"
            >
                THE ECOSYSTEM
            </h2>
            <p
                class="text-center text-white/50 mb-12 md:mb-20 font-mono text-xs md:text-sm"
            >
                TOOLS & TECHNOLOGIES
            </p>

            <!-- Bento Grid Container -->
            <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]"
            >
                <!-- Cell 1: The Core [2x2 Large Card] -->
                <div class="bento-card md:col-span-2 md:row-span-2 group">
                    <div class="bento-content h-full">
                        <h3
                            class="text-2xl md:text-3xl font-bold text-white mb-4 font-mono"
                        >
                            JavaScript & Frameworks
                        </h3>
                        <div class="flex flex-wrap gap-6 md:gap-8 mb-6">
                            <div class="floating-icon">
                                <div
                                    class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#FF3E00]/10 border border-[#FF3E00]/30 flex items-center justify-center"
                                >
                                    <span class="text-3xl md:text-4xl">⚡</span>
                                </div>
                                <p
                                    class="text-xs md:text-sm text-white/70 mt-2 font-mono"
                                >
                                    Svelte 5
                                </p>
                            </div>
                            <div class="floating-icon">
                                <div
                                    class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#61DAFB]/10 border border-[#61DAFB]/30 flex items-center justify-center"
                                >
                                    <span class="text-3xl md:text-4xl">⚛️</span>
                                </div>
                                <p
                                    class="text-xs md:text-sm text-white/70 mt-2 font-mono"
                                >
                                    React
                                </p>
                            </div>
                            <div class="floating-icon">
                                <div
                                    class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#3178C6]/10 border border-[#3178C6]/30 flex items-center justify-center"
                                >
                                    <span class="text-3xl md:text-4xl">📘</span>
                                </div>
                                <p
                                    class="text-xs md:text-sm text-white/70 mt-2 font-mono"
                                >
                                    TypeScript
                                </p>
                            </div>
                        </div>
                        <button
                            id="rune-toggle"
                            class="px-4 py-2 bg-[#00DCF6]/20 text-[#00DCF6] rounded-lg text-sm font-mono font-bold hover:bg-[#00DCF6]/30 transition-all duration-300"
                        >
                            Toggle Svelte 5 Rune
                        </button>
                        <div
                            id="rune-snippet"
                            class="hidden mt-4 p-4 bg-black/40 rounded-lg border border-[#00DCF6]/30"
                        >
                            <pre
                                class="text-xs md:text-sm text-[#00DCF6] font-mono"><code
                                    >let count = $state(0);
let doubled = $derived(count * 2);</code
                                ></pre>
                        </div>
                    </div>
                </div>

                <!-- Cell 2: Mobile Mastery [1x1 Card] -->
                <div class="bento-card group">
                    <div class="bento-content h-full">
                        <h3
                            class="text-xl md:text-2xl font-bold text-white mb-4 font-mono"
                        >
                            Cross-Platform
                        </h3>
                        <div class="flex gap-4 mb-4">
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#61DAFB]/10 border border-[#61DAFB]/30 flex items-center justify-center"
                                >
                                    <span class="text-2xl">📱</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-xs md:text-sm text-white/50 font-mono">
                            React Native & Expo
                        </p>
                    </div>
                </div>

                <!-- Cell 3: The Engine [2x1 Wide Card] -->
                <div class="bento-card md:col-span-2 group">
                    <div class="bento-content h-full">
                        <h3
                            class="text-xl md:text-2xl font-bold text-white mb-4 font-mono"
                        >
                            Backend & Systems
                        </h3>
                        <div class="flex flex-wrap gap-4 md:gap-6 mb-4">
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#68A063]/10 border border-[#68A063]/30 flex items-center justify-center"
                                >
                                    <span class="text-xl md:text-2xl">🟢</span>
                                </div>
                                <p class="text-xs text-white/70 mt-1 font-mono">
                                    Node.js
                                </p>
                            </div>
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#336791]/10 border border-[#336791]/30 flex items-center justify-center"
                                >
                                    <span class="text-xl md:text-2xl">🐘</span>
                                </div>
                                <p class="text-xs text-white/70 mt-1 font-mono">
                                    PostgreSQL
                                </p>
                            </div>
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#FF9900]/10 border border-[#FF9900]/30 flex items-center justify-center"
                                >
                                    <span class="text-xl md:text-2xl">☁️</span>
                                </div>
                                <p class="text-xs text-white/70 mt-1 font-mono">
                                    AWS
                                </p>
                            </div>
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#2496ED]/10 border border-[#2496ED]/30 flex items-center justify-center"
                                >
                                    <span class="text-xl md:text-2xl">🐳</span>
                                </div>
                                <p class="text-xs text-white/70 mt-1 font-mono">
                                    Docker
                                </p>
                            </div>
                        </div>
                        <div
                            class="flex gap-4 text-xs md:text-sm text-white/50 font-mono"
                        >
                            <span>• System Reliability</span>
                            <span>• Atomic Updates</span>
                        </div>
                    </div>
                </div>

                <!-- Cell 4: Ops Focus [1x1 Card] -->
                <div class="bento-card group">
                    <div class="bento-content h-full">
                        <h3
                            class="text-xl md:text-2xl font-bold text-white mb-4 font-mono"
                        >
                            Internal Tools
                        </h3>
                        <div class="flex gap-3 mb-3">
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#00DCF6]/10 border border-[#00DCF6]/30 flex items-center justify-center"
                                >
                                    <span class="text-xl md:text-2xl">📦</span>
                                </div>
                            </div>
                            <div class="floating-icon">
                                <div
                                    class="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#00DCF6]/10 border border-[#00DCF6]/30 flex items-center justify-center"
                                >
                                    <span class="text-xl md:text-2xl">🎫</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-xs text-white/50 font-mono">
                            Inventory & Support
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- The Gallery: Project Case Studies -->
    <section
        id="project-gallery"
        class="relative z-10 bg-dark py-16 md:py-32 px-4 md:px-8 overflow-hidden"
    >
        <div class="max-w-7xl mx-auto">
            <h2
                class="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 text-center"
            >
                THE GALLERY
            </h2>
            <p
                class="text-center text-white/50 mb-12 md:mb-20 font-mono text-xs md:text-sm"
            >
                PROJECT CASE STUDIES
            </p>

            <!-- Project Cards Container -->
            <div class="space-y-12 md:space-y-24">
                <!-- Project 1: Inventory Control System -->
                <div class="project-card-container" data-project="1">
                    <div class="project-card group">
                        <div
                            class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
                        >
                            <!-- Technical Metadata Sidebar -->
                            <div class="lg:col-span-3 space-y-4">
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-2"
                                    >
                                        PROJECT
                                    </p>
                                    <h3
                                        class="text-xl md:text-2xl font-bold text-white font-mono"
                                    >
                                        Inventory Control
                                    </h3>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-2"
                                    >
                                        CLIENT
                                    </p>
                                    <p class="text-white/70 font-mono">Yulu</p>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-2"
                                    >
                                        YEAR
                                    </p>
                                    <p class="text-white/70 font-mono">2024</p>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-3"
                                    >
                                        TECH STACK
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        <span
                                            class="px-3 py-1 bg-[#00DCF6]/10 text-[#00DCF6] rounded-full text-xs font-mono"
                                        >
                                            Svelte 5
                                        </span>
                                        <span
                                            class="px-3 py-1 bg-[#00DCF6]/10 text-[#00DCF6] rounded-full text-xs font-mono"
                                        >
                                            Node.js
                                        </span>
                                        <span
                                            class="px-3 py-1 bg-[#00DCF6]/10 text-[#00DCF6] rounded-full text-xs font-mono"
                                        >
                                            SQL
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Project Content -->
                            <div class="lg:col-span-9">
                                <div class="project-flip-container">
                                    <!-- Front: Project Description -->
                                    <div class="project-front">
                                        <div
                                            class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 h-full"
                                        >
                                            <h4
                                                class="text-2xl md:text-4xl font-black text-white mb-4"
                                            >
                                                Architecting Operational
                                                Integrity
                                            </h4>
                                            <p
                                                class="text-base md:text-lg text-white/70 leading-relaxed mb-6"
                                            >
                                                Transitioning manual flows into
                                                automated, high-precision
                                                inventory tracking. Built a
                                                comprehensive system that
                                                ensures real-time accuracy
                                                across multiple warehouses and
                                                operational zones.
                                            </p>
                                            <button
                                                class="view-architecture-btn px-6 py-3 bg-[#00DCF6]/20 text-[#00DCF6] rounded-lg font-mono font-bold hover:bg-[#00DCF6]/30 transition-all duration-300"
                                            >
                                                View Architecture →
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Back: System Architecture -->
                                    <div class="project-back hidden">
                                        <div
                                            class="bg-black/60 backdrop-blur-xl border border-[#00DCF6]/30 rounded-2xl p-6 md:p-8 h-full"
                                        >
                                            <h4
                                                class="text-xl md:text-2xl font-bold text-[#00DCF6] mb-6 font-mono"
                                            >
                                                SYSTEM ARCHITECTURE
                                            </h4>
                                            <div
                                                class="space-y-6 font-mono text-sm md:text-base"
                                            >
                                                <div
                                                    class="flex items-center gap-4"
                                                >
                                                    <div
                                                        class="w-24 md:w-32 px-4 py-3 bg-[#00DCF6]/10 border border-[#00DCF6]/30 rounded-lg text-center"
                                                    >
                                                        <p
                                                            class="text-[#00DCF6] font-bold"
                                                        >
                                                            CLIENT
                                                        </p>
                                                        <p
                                                            class="text-white/50 text-xs mt-1"
                                                        >
                                                            Svelte 5
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="flex-1 h-[2px] bg-[#00DCF6]/30 relative"
                                                    >
                                                        <span
                                                            class="absolute right-0 top-1/2 -translate-y-1/2 text-[#00DCF6]"
                                                            >→</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="w-24 md:w-32 px-4 py-3 bg-[#00DCF6]/10 border border-[#00DCF6]/30 rounded-lg text-center"
                                                    >
                                                        <p
                                                            class="text-[#00DCF6] font-bold"
                                                        >
                                                            API
                                                        </p>
                                                        <p
                                                            class="text-white/50 text-xs mt-1"
                                                        >
                                                            Node.js
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="flex-1 h-[2px] bg-[#00DCF6]/30 relative"
                                                    >
                                                        <span
                                                            class="absolute right-0 top-1/2 -translate-y-1/2 text-[#00DCF6]"
                                                            >→</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="w-24 md:w-32 px-4 py-3 bg-[#00DCF6]/10 border border-[#00DCF6]/30 rounded-lg text-center"
                                                    >
                                                        <p
                                                            class="text-[#00DCF6] font-bold"
                                                        >
                                                            DB
                                                        </p>
                                                        <p
                                                            class="text-white/50 text-xs mt-1"
                                                        >
                                                            PostgreSQL
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="text-white/50 text-xs md:text-sm"
                                                >
                                                    <p>
                                                        • Real-time inventory
                                                        sync across zones
                                                    </p>
                                                    <p>
                                                        • Atomic transaction
                                                        handling
                                                    </p>
                                                    <p>
                                                        • Sub-second query
                                                        performance
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                class="close-architecture-btn mt-6 px-6 py-3 bg-white/10 text-white rounded-lg font-mono font-bold hover:bg-white/20 transition-all duration-300"
                                            >
                                                ← Back to Overview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project 2: Support Ecosystem -->
                <div class="project-card-container" data-project="2">
                    <div class="project-card group">
                        <div
                            class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
                        >
                            <!-- Technical Metadata Sidebar -->
                            <div class="lg:col-span-3 space-y-4">
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-2"
                                    >
                                        PROJECT
                                    </p>
                                    <h3
                                        class="text-xl md:text-2xl font-bold text-white font-mono"
                                    >
                                        Support Ecosystem
                                    </h3>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-2"
                                    >
                                        CLIENT
                                    </p>
                                    <p class="text-white/70 font-mono">Yulu</p>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-2"
                                    >
                                        YEAR
                                    </p>
                                    <p class="text-white/70 font-mono">
                                        2023-2024
                                    </p>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-white/40 font-mono mb-3"
                                    >
                                        TECH STACK
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        <span
                                            class="px-3 py-1 bg-[#00DCF6]/10 text-[#00DCF6] rounded-full text-xs font-mono"
                                        >
                                            React
                                        </span>
                                        <span
                                            class="px-3 py-1 bg-[#00DCF6]/10 text-[#00DCF6] rounded-full text-xs font-mono"
                                        >
                                            Real-time APIs
                                        </span>
                                        <span
                                            class="px-3 py-1 bg-[#00DCF6]/10 text-[#00DCF6] rounded-full text-xs font-mono"
                                        >
                                            CSS Grid
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Project Content -->
                            <div class="lg:col-span-9">
                                <div class="project-flip-container">
                                    <!-- Front: Project Description -->
                                    <div class="project-front">
                                        <div
                                            class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 h-full"
                                        >
                                            <h4
                                                class="text-2xl md:text-4xl font-black text-white mb-4"
                                            >
                                                Eliminating Agent Friction
                                            </h4>
                                            <p
                                                class="text-base md:text-lg text-white/70 leading-relaxed mb-6"
                                            >
                                                A unified dashboard reducing
                                                resolution time for customer
                                                support teams. Streamlined
                                                workflows and real-time data
                                                access empowered agents to
                                                resolve issues 40% faster.
                                            </p>
                                            <button
                                                class="view-architecture-btn px-6 py-3 bg-[#00DCF6]/20 text-[#00DCF6] rounded-lg font-mono font-bold hover:bg-[#00DCF6]/30 transition-all duration-300"
                                            >
                                                View Architecture →
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Back: System Architecture -->
                                    <div class="project-back hidden">
                                        <div
                                            class="bg-black/60 backdrop-blur-xl border border-[#00DCF6]/30 rounded-2xl p-6 md:p-8 h-full"
                                        >
                                            <h4
                                                class="text-xl md:text-2xl font-bold text-[#00DCF6] mb-6 font-mono"
                                            >
                                                SYSTEM ARCHITECTURE
                                            </h4>
                                            <div
                                                class="space-y-6 font-mono text-sm md:text-base"
                                            >
                                                <div
                                                    class="flex items-center gap-4"
                                                >
                                                    <div
                                                        class="w-24 md:w-32 px-4 py-3 bg-[#00DCF6]/10 border border-[#00DCF6]/30 rounded-lg text-center"
                                                    >
                                                        <p
                                                            class="text-[#00DCF6] font-bold"
                                                        >
                                                            CLIENT
                                                        </p>
                                                        <p
                                                            class="text-white/50 text-xs mt-1"
                                                        >
                                                            React
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="flex-1 h-[2px] bg-[#00DCF6]/30 relative"
                                                    >
                                                        <span
                                                            class="absolute right-0 top-1/2 -translate-y-1/2 text-[#00DCF6]"
                                                            >→</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="w-24 md:w-32 px-4 py-3 bg-[#00DCF6]/10 border border-[#00DCF6]/30 rounded-lg text-center"
                                                    >
                                                        <p
                                                            class="text-[#00DCF6] font-bold"
                                                        >
                                                            API
                                                        </p>
                                                        <p
                                                            class="text-white/50 text-xs mt-1"
                                                        >
                                                            WebSocket
                                                        </p>
                                                    </div>
                                                    <div
                                                        class="flex-1 h-[2px] bg-[#00DCF6]/30 relative"
                                                    >
                                                        <span
                                                            class="absolute right-0 top-1/2 -translate-y-1/2 text-[#00DCF6]"
                                                            >→</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="w-24 md:w-32 px-4 py-3 bg-[#00DCF6]/10 border border-[#00DCF6]/30 rounded-lg text-center"
                                                    >
                                                        <p
                                                            class="text-[#00DCF6] font-bold"
                                                        >
                                                            DB
                                                        </p>
                                                        <p
                                                            class="text-white/50 text-xs mt-1"
                                                        >
                                                            MongoDB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    class="text-white/50 text-xs md:text-sm"
                                                >
                                                    <p>
                                                        • Real-time ticket
                                                        updates via WebSocket
                                                    </p>
                                                    <p>
                                                        • Unified agent
                                                        dashboard with CSS Grid
                                                    </p>
                                                    <p>
                                                        • 40% reduction in
                                                        resolution time
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                class="close-architecture-btn mt-6 px-6 py-3 bg-white/10 text-white rounded-lg font-mono font-bold hover:bg-white/20 transition-all duration-300"
                                            >
                                                ← Back to Overview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Engineering Principles: The Mindset -->
    <section
        id="engineering-principles"
        class="relative z-10 bg-dark-lighter py-16 md:py-32 px-4 md:px-8"
    >
        <div class="max-w-7xl mx-auto">
            <h2
                class="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 text-center"
            >
                ENGINEERING PRINCIPLES
            </h2>
            <p
                class="text-center text-white/50 mb-12 md:mb-20 font-mono text-xs md:text-sm"
            >
                THE MINDSET
            </p>

            <!-- Principles Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <!-- Principle 1: Operational Integrity -->
                <div class="principle-card opacity-0" data-principle="1">
                    <div class="principle-content">
                        <!-- Icon -->
                        <div class="mb-6">
                            <div
                                class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#00DCF6]/10 border border-[#00DCF6]/30 flex items-center justify-center principle-icon"
                            >
                                <svg
                                    class="w-6 h-6 md:w-8 md:h-8 text-[#00DCF6]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Title -->
                        <h3
                            class="principle-title text-xl md:text-2xl font-bold text-white mb-4 font-mono"
                        >
                            Clean Over Clever
                        </h3>

                        <!-- Content -->
                        <p
                            class="text-sm md:text-base text-white/70 leading-relaxed font-light"
                        >
                            Prioritizing maintainable, readable code
                            architectures that ensure long-term operational
                            health and team velocity.
                        </p>
                    </div>
                </div>

                <!-- Principle 2: Empathetic Internal Tools -->
                <div class="principle-card opacity-0" data-principle="2">
                    <div class="principle-content">
                        <!-- Icon -->
                        <div class="mb-6">
                            <div
                                class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#00DCF6]/10 border border-[#00DCF6]/30 flex items-center justify-center principle-icon"
                            >
                                <svg
                                    class="w-6 h-6 md:w-8 md:h-8 text-[#00DCF6]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Title -->
                        <h3
                            class="principle-title text-xl md:text-2xl font-bold text-white mb-4 font-mono"
                        >
                            Component-First Scalability
                        </h3>

                        <!-- Content -->
                        <p
                            class="text-sm md:text-base text-white/70 leading-relaxed font-light"
                        >
                            Building modular, reusable UI systems that bridge
                            the gap between feature-rich public pages and
                            complex internal platforms.
                        </p>
                    </div>
                </div>

                <!-- Principle 3: Modular Scalability -->
                <div class="principle-card opacity-0" data-principle="3">
                    <div class="principle-content">
                        <!-- Icon -->
                        <div class="mb-6">
                            <div
                                class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#00DCF6]/10 border border-[#00DCF6]/30 flex items-center justify-center principle-icon"
                            >
                                <svg
                                    class="w-6 h-6 md:w-8 md:h-8 text-[#00DCF6]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Title -->
                        <h3
                            class="principle-title text-xl md:text-2xl font-bold text-white mb-4 font-mono"
                        >
                            Systemic Reliability
                        </h3>

                        <!-- Content -->
                        <p
                            class="text-sm md:text-base text-white/70 leading-relaxed font-light"
                        >
                            Engineering robust "Sources of Truth" and ensuring
                            transactional precision in high-concurrency
                            environments where data integrity is non-negotiable.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- The Command Center: Footer & Contact -->
    <footer
        id="command-center"
        class="relative z-10 bg-black border-t border-[#00DCF6]/20 py-12 md:py-16 px-4 md:px-8"
    >
        <div class="max-w-7xl mx-auto">
            <!-- Status Badge -->
            <div class="flex items-center gap-3 mb-8">
                <div class="flex items-center gap-2">
                    <div
                        class="w-2 h-2 rounded-full bg-[#00DCF6] animate-pulse"
                    ></div>
                    <span
                        class="text-[#00DCF6] font-mono text-xs md:text-sm font-bold"
                    >
                        SYSTEM: ONLINE. READY FOR NEW CHALLENGES.
                    </span>
                </div>
            </div>

            <!-- Terminal Lines -->
            <div class="space-y-2 mb-8 font-mono text-xs md:text-sm">
                <div class="terminal-line text-white/70">
                    <span class="text-[#00DCF6]">$</span>
                    <span id="terminal-line-1"></span><span class="cursor-blink"
                        >_</span
                    >
                </div>
                <div class="terminal-line text-white/70 hidden">
                    <span class="text-[#00DCF6]">$</span>
                    <span id="terminal-line-2"></span>
                </div>
                <div class="terminal-line text-white/70 hidden">
                    <span class="text-[#00DCF6]">$</span>
                    <span id="terminal-line-3"></span>
                </div>
            </div>

            <!-- Contact Links Grid -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
            >
                <!-- GitHub -->
                <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-link group"
                >
                    <div
                        class="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#00DCF6]/50 transition-all duration-300"
                    >
                        <span class="text-[#00DCF6] font-mono text-sm font-bold"
                            >[01]</span
                        >
                        <span
                            class="text-white/70 font-mono text-sm group-hover:text-white transition-colors"
                            >GITHUB</span
                        >
                    </div>
                </a>

                <!-- LinkedIn -->
                <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-link group"
                >
                    <div
                        class="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#00DCF6]/50 transition-all duration-300"
                    >
                        <span class="text-[#00DCF6] font-mono text-sm font-bold"
                            >[02]</span
                        >
                        <span
                            class="text-white/70 font-mono text-sm group-hover:text-white transition-colors"
                            >LINKEDIN</span
                        >
                    </div>
                </a>

                <!-- Email -->
                <a
                    href="mailto:your.email@example.com"
                    class="contact-link group"
                >
                    <div
                        class="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#00DCF6]/50 transition-all duration-300"
                    >
                        <span class="text-[#00DCF6] font-mono text-sm font-bold"
                            >[03]</span
                        >
                        <span
                            class="text-white/70 font-mono text-sm group-hover:text-white transition-colors"
                            >EMAIL</span
                        >
                    </div>
                </a>

                <!-- Resume -->
                <a
                    href="/resume.pdf"
                    target="_blank"
                    class="contact-link group"
                >
                    <div
                        class="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#00DCF6]/50 transition-all duration-300"
                    >
                        <span class="text-[#00DCF6] font-mono text-sm font-bold"
                            >[04]</span
                        >
                        <span
                            class="text-white/70 font-mono text-sm group-hover:text-white transition-colors"
                            >RESUME</span
                        >
                    </div>
                </a>
            </div>

            <!-- Last Updated & Developer Mode -->
            <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/10"
            >
                <div class="text-white/50 font-mono text-xs">
                    <span class="text-white/30">LAST_UPDATED:</span>
                    <span id="last-updated">2026-02-07 02:43:00 IST</span>
                </div>
                <button
                    id="dev-mode-toggle"
                    class="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#00DCF6]/50 transition-all duration-300 font-mono text-xs text-white/70 hover:text-white"
                >
                    [DEV_MODE] →
                </button>
            </div>

            <!-- Developer Mode Panel (Hidden by default) -->
            <div
                id="dev-mode-panel"
                class="hidden mb-6 p-6 bg-[#00DCF6]/5 border border-[#00DCF6]/30 rounded-lg"
            >
                <h4 class="text-[#00DCF6] font-mono text-sm font-bold mb-4">
                    SYSTEM SPECIFICATIONS
                </h4>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs text-white/70"
                >
                    <div>
                        <span class="text-white/40">BUILD:</span> Svelte 5 + GSAP
                    </div>
                    <div>
                        <span class="text-white/40">LIGHTHOUSE_SCORE:</span> 100
                    </div>
                    <div>
                        <span class="text-white/40">RENDER_TIME:</span> ~12ms
                    </div>
                    <div>
                        <span class="text-white/40">FRAMEWORK:</span> SvelteKit
                    </div>
                    <div>
                        <span class="text-white/40">ANIMATIONS:</span> GSAP + ScrollTrigger
                    </div>
                    <div>
                        <span class="text-white/40">STYLING:</span> Tailwind CSS
                    </div>
                    <div>
                        <span class="text-white/40">FONTS:</span> Geist Mono + Geist
                        Sans
                    </div>
                    <div>
                        <span class="text-white/40">DEPLOYMENT:</span> Vercel
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div class="text-center">
                <p class="text-white/40 font-mono text-xs">
                    Handcrafted by Preetham © 2026. All systems nominal.
                </p>
            </div>
        </div>
    </footer>
</main>

<!-- Smart Sticky Return: Vertical Pill Button -->
{#if showBackToTop}
    <div
        id="smart-sticky-return"
        class="fixed bottom-10 right-10 z-50 pointer-events-auto"
        use:animateEntrance
        onmouseenter={() => (isHovering = true)}
        onmouseleave={() => (isHovering = false)}
        role="application"
    >
        <button
            class="group relative flex flex-col items-center justify-center rounded-full border border-[#00DCF6] bg-[#1a1a1a]/20 backdrop-blur-md transition-all duration-300 hover:border-[#00DCF6] hover:bg-[#00DCF6] w-12 h-24 shadow-[0_0_15px_rgba(0,220,246,0.3)] hover:shadow-[0_0_25px_rgba(0,220,246,0.6)]"
            onclick={scrollToTop}
            aria-label="Return to Top"
        >
            <!-- Top Section: Arrow -->
            <div
                class="flex-1 flex items-center justify-center w-full border-b border-[#00DCF6]/30 group-hover:border-black/20 transition-colors"
            >
                <span
                    class="font-mono text-[10px] text-[#00DCF6] group-hover:text-black font-bold transition-colors"
                >
                    [ ^ ]
                </span>
            </div>

            <!-- Bottom Section: Percent -->
            <div class="flex-1 flex items-center justify-center w-full">
                <span
                    class="font-mono text-[10px] text-[#00DCF6] group-hover:text-black font-bold transition-colors"
                >
                    {Math.round(scrollPercentage)}%
                </span>
            </div>

            <!-- Tooltip (Absolute) -->
            <div
                class="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
            >
                <span
                    class="bg-black/80 backdrop-blur-sm text-[#00DCF6] text-[10px] font-mono px-2 py-1 rounded border border-[#00DCF6]/30"
                >
                    RETURN_TO_TOP
                </span>
            </div>
        </button>
    </div>
{/if}

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

    /* Bento Grid Styles */
    .bento-card {
        position: relative;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1.5rem;
        padding: 1.5rem;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }

    .bento-card::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 1.5rem;
        padding: 2px;
        background: linear-gradient(
            135deg,
            rgba(0, 220, 246, 0),
            rgba(0, 220, 246, 0.3)
        );
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    .bento-card:hover {
        background: rgba(0, 220, 246, 0.05);
        border-color: rgba(0, 220, 246, 0.3);
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 220, 246, 0.1);
    }

    .bento-card:hover::before {
        opacity: 1;
    }

    .bento-content {
        position: relative;
        z-index: 1;
    }

    .floating-icon {
        animation: float 3s ease-in-out infinite;
    }

    .floating-icon:nth-child(2) {
        animation-delay: 0.5s;
    }

    .floating-icon:nth-child(3) {
        animation-delay: 1s;
    }

    .floating-icon:nth-child(4) {
        animation-delay: 1.5s;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    /* Project Gallery Styles */
    .project-card {
        position: relative;
        transition: transform 0.3s ease;
    }

    .project-flip-container {
        position: relative;
        perspective: 1000px;
    }

    .project-front,
    .project-back {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    /* Engineering Principles Styles */
    .principle-card {
        position: relative;
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        padding: 2rem;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
    }

    .principle-card:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(0, 220, 246, 0.5);
        box-shadow: 0 0 30px rgba(0, 220, 246, 0.15);
        transform: translateY(-4px);
    }

    .principle-icon {
        transition: all 0.3s ease;
    }

    .principle-card:hover .principle-icon {
        background: rgba(0, 220, 246, 0.15);
        border-color: rgba(0, 220, 246, 0.5);
        animation: iconPulse 1.5s ease-in-out infinite;
    }

    @keyframes iconPulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    .principle-title {
        transition: letter-spacing 0.3s ease;
    }

    .principle-card:hover .principle-title {
        letter-spacing: 0.05em;
    }

    /* Command Center / Footer Styles */
    .cursor-blink {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        0%,
        50% {
            opacity: 1;
        }
        51%,
        100% {
            opacity: 0;
        }
    }

    /* Back to Top Button Styles */
    .back-to-top-button {
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .back-to-top-button:hover {
        transform: translateY(-2px);
        filter: drop-shadow(0 0 20px rgba(0, 220, 246, 0.4));
    }

    .back-to-top-button:active {
        transform: translateY(0);
    }

    /* Glitch effect on hover */
    .back-to-top-button:hover span {
        animation: textGlitch 0.3s ease;
    }

    @keyframes textGlitch {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-2px);
        }
        75% {
            transform: translateX(2px);
        }
    }
</style>
