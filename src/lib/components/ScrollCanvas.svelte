<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    // Svelte 5 Runes
    let currentFrame = $state(1);
    let loadingProgress = $state(0);
    let isLoaded = $state(false);
    let canvasElement: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null = null;

    // Configuration
    const FRAME_COUNT = 233;
    const FRAME_PATH = "/sequence/ezgif-frame-";
    const images: HTMLImageElement[] = [];

    // Preload all images
    function preloadImages(): Promise<void> {
        return new Promise((resolve) => {
            let loadedCount = 0;

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, "0");
                img.src = `${FRAME_PATH}${frameNumber}.jpg`;

                img.onload = () => {
                    loadedCount++;
                    loadingProgress = Math.round(
                        (loadedCount / FRAME_COUNT) * 100,
                    );

                    if (loadedCount === FRAME_COUNT) {
                        isLoaded = true;
                        resolve();
                    }
                };

                images[i - 1] = img;
            }
        });
    }

    // Draw frame on canvas
    function drawFrame(frameIndex: number) {
        if (!context || !canvasElement) return;

        const img = images[frameIndex];
        if (!img) return;

        // Clear canvas
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Calculate scaling to cover the canvas while maintaining aspect ratio
        const canvasAspect = canvasElement.width / canvasElement.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            // Canvas is wider - fit to width
            drawWidth = canvasElement.width;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasElement.height - drawHeight) / 2;
        } else {
            // Canvas is taller - fit to height
            drawHeight = canvasElement.height;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvasElement.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Resize canvas to fill the entire viewport
    function resizeCanvas() {
        if (!canvasElement) return;

        // Set canvas to full viewport size
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        // Redraw current frame after resize
        drawFrame(currentFrame - 1);
    }

    onMount(() => {
        context = canvasElement.getContext("2d", { alpha: false });

        // Set initial canvas size
        resizeCanvas();

        // Handle window resize
        window.addEventListener("resize", resizeCanvas);

        // Preload images then setup GSAP
        preloadImages().then(() => {
            // Draw initial frame
            drawFrame(0);

            // Setup GSAP ScrollTrigger with Lenis integration
            ScrollTrigger.scrollerProxy(document.body, {
                scrollTop(value) {
                    if (arguments.length && (window as any).lenis) {
                        (window as any).lenis.scrollTo(value, {
                            immediate: true,
                        });
                    }
                    return (window as any).lenis
                        ? (window as any).lenis.scroll
                        : 0;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                },
            });

            // Update ScrollTrigger on Lenis scroll
            if ((window as any).lenis) {
                (window as any).lenis.on("scroll", () => {
                    ScrollTrigger.update();
                });
            }

            // Create scroll animation
            gsap.to(
                {},
                {
                    scrollTrigger: {
                        trigger: canvasElement.parentElement?.parentElement, // The h-[400vh] container
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.5,
                        onUpdate: (self) => {
                            const frameIndex = Math.min(
                                FRAME_COUNT - 1,
                                Math.floor(self.progress * FRAME_COUNT),
                            );
                            currentFrame = frameIndex + 1;
                            drawFrame(frameIndex);
                        },
                    },
                },
            );
        });

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    });
</script>

<!-- Loading Screen -->
{#if !isLoaded}
    <div
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark"
        style="opacity: {1 - loadingProgress / 100}"
    >
        <div class="text-center">
            <h2 class="text-2xl font-light tracking-tight text-white/90 mb-8">
                Loading Experience
            </h2>
            <div class="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                    style="width: {loadingProgress}%"
                ></div>
            </div>
            <p class="text-white/50 text-sm mt-4 font-mono">
                {loadingProgress}%
            </p>
        </div>
    </div>
{/if}

<!-- Scroll Container with Sticky Canvas -->
<div class="relative h-[400vh]">
    <div class="sticky top-0 h-screen w-full">
        <canvas
            bind:this={canvasElement}
            class="w-full h-full"
            style="will-change: transform;"
        ></canvas>
    </div>
</div>
