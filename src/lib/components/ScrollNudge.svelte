<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";

    // Svelte 5 runes for reactive state
    let isVisible = $state(false);
    let containerRef: HTMLDivElement | null = $state(null);
    let textRef: HTMLSpanElement | null = $state(null);
    let pillRef: HTMLDivElement | null = $state(null);

    // Animation timeline reference
    let breathingTimeline: gsap.core.Timeline | null = null;
    let patienceTimer: ReturnType<typeof setTimeout> | null = null;
    let hasUserScrolled = false;

    onMount(() => {
        // The "Patience" Timer - only trigger if user hasn't scrolled
        patienceTimer = setTimeout(() => {
            // Only show if user is still at the top
            if (window.scrollY === 0 && !hasUserScrolled) {
                showNudge();
            }
        }, 3000);

        // Monitor scroll to cancel patience timer
        const handleEarlyScroll = () => {
            if (window.scrollY > 0) {
                hasUserScrolled = true;
                if (patienceTimer) {
                    clearTimeout(patienceTimer);
                    patienceTimer = null;
                }
            }
        };

        // Monitor scroll to dismiss visible nudge
        const handleScrollDismiss = () => {
            if (window.scrollY > 0 && isVisible) {
                dismissNudge();
            }
        };

        // Combined scroll handler
        const handleScroll = () => {
            handleEarlyScroll();
            handleScrollDismiss();
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            // Cleanup
            if (patienceTimer) clearTimeout(patienceTimer);
            if (breathingTimeline) breathingTimeline.kill();
            window.removeEventListener("scroll", handleScroll);
        };
    });

    function showNudge() {
        isVisible = true;

        // Wait for next tick to ensure DOM is ready
        requestAnimationFrame(() => {
            if (!containerRef || !pillRef) return;

            // Entrance animation - The gentle tap
            gsap.fromTo(
                containerRef,
                {
                    opacity: 0,
                    y: 10,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        // Start the breathing animation once entrance is complete
                        startBreathingAnimation();
                    },
                },
            );
        });
    }

    function startBreathingAnimation() {
        if (!pillRef || !textRef) return;

        // The Loop - Subtle breathing/bobbing animation for both text and pill
        breathingTimeline = gsap.timeline({
            repeat: -1,
            yoyo: true,
        });

        // Animate both elements together for a cohesive floating effect
        breathingTimeline.to([textRef, pillRef], {
            y: -5,
            duration: 1.2,
            ease: "sine.inOut",
        });
    }

    function dismissNudge() {
        if (!containerRef) return;

        // Kill the breathing animation
        if (breathingTimeline) {
            breathingTimeline.kill();
            breathingTimeline = null;
        }

        // Exit animation - Instant reaction
        gsap.to(containerRef, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                isVisible = false;
            },
        });
    }
</script>

{#if isVisible}
    <div
        bind:this={containerRef}
        class="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none select-none"
        style="opacity: 0;"
    >
        <!-- Vibrant text label with Yulu blue -->
        <span
            bind:this={textRef}
            class="text-[#00DCF6] text-xs md:text-sm font-mono tracking-widest uppercase font-semibold"
            style="text-shadow: 0 0 10px rgba(0, 220, 246, 0.5);"
        >
            scroll
        </span>

        <!-- Vibrant vertical pill with Yulu blue gradient -->
        <div
            bind:this={pillRef}
            class="w-[3px] h-12 md:h-14 rounded-full"
            style="background: linear-gradient(to bottom, rgba(0, 220, 246, 0.3), rgba(0, 220, 246, 0.8), rgba(0, 220, 246, 0.3)); box-shadow: 0 0 15px rgba(0, 220, 246, 0.6);"
        ></div>

        <!-- Enhanced glow effect with Yulu blue -->
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl -z-10"
            style="background: radial-gradient(circle, rgba(0, 220, 246, 0.3) 0%, rgba(0, 220, 246, 0) 70%);"
        ></div>
    </div>
{/if}

<style>
    /* Additional styling for ultra-smooth rendering */
    div {
        will-change: transform, opacity;
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
