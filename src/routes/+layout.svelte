<script lang="ts">
    import "../app.css";
    import "lenis/dist/lenis.css";
    import { onMount } from "svelte";
    import Lenis from "lenis";

    let { children } = $props();

    onMount(() => {
        // Initialize Lenis smooth scroll
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        const lenis = new Lenis({
            duration: isMobile ? 1.6 : 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            syncTouch: true,
            syncTouchLerp: 0.075,
            touchMultiplier: 1.5,
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Expose lenis to window for GSAP ScrollTrigger integration
        (window as any).lenis = lenis;

        return () => {
            lenis.destroy();
        };
    });
</script>

{@render children()}
