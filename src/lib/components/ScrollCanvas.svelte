<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    // Svelte 5 Runes
    let currentFrame = $state(1);
    let loadingProgress = $state(0);
    let isLoaded = $state(false);
    let showSkip = $state(false);

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
            let hasResolved = false;

            const safetyTimeout = setTimeout(() => {
                if (!hasResolved) {
                    console.warn(
                        "ScrollCanvas: Preloading safety timeout triggered.",
                    );
                    isLoaded = true;
                    hasResolved = true;
                    resolve();
                }
            }, 5000);

            const handleImageLoad = () => {
                loadedCount++;
                loadingProgress = Math.round((loadedCount / FRAME_COUNT) * 100);

                if (loadedCount === FRAME_COUNT && !hasResolved) {
                    clearTimeout(safetyTimeout);
                    isLoaded = true;
                    hasResolved = true;
                    resolve();
                }
            };

            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, "0");
                img.src = `${FRAME_PATH}${frameNumber}.jpg`;

                img.onload = handleImageLoad;
                img.onerror = handleImageLoad;

                images[i - 1] = img;
            }
        });
    }

    function drawFrame(frameIndex: number) {
        if (!context || !canvasElement) return;
        const img = images[frameIndex];
        if (!img) return;

        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const canvasAspect = canvasElement.width / canvasElement.height;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvasElement.width;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasElement.height - drawHeight) / 2;
        } else {
            drawHeight = canvasElement.height;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvasElement.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    function resizeCanvas() {
        if (!canvasElement) return;
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        drawFrame(currentFrame - 1);
    }

    onMount(() => {
        context = canvasElement.getContext("2d", { alpha: false });
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Lock scroll while loading
        const lenis = (window as any).lenis;
        if (lenis) lenis.stop();
        document.body.style.overflow = "hidden";

        const skipTimer = setTimeout(() => {
            showSkip = true;
        }, 3000);

        preloadImages();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            clearTimeout(skipTimer);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });

    // Svelte 5 Effect to handle GSAP initialization once loaded
    $effect(() => {
        if (isLoaded && canvasElement) {
            console.log("ScrollCanvas: Assets ready, initializing GSAP...");
            drawFrame(0);

            // Unlock scroll now that loading is complete
            document.body.style.overflow = "";
            const lenis = (window as any).lenis;
            if (lenis) {
                ScrollTrigger.scrollerProxy(document.body, {
                    scrollTop(value: number) {
                        if (arguments.length && lenis) {
                            lenis.scrollTo(value, { immediate: true });
                        }
                        return lenis.scroll;
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

                lenis.on("scroll", () => ScrollTrigger.update());
                lenis.start();
            }

            const triggerElement = canvasElement.parentElement?.parentElement;
            if (triggerElement) {
                gsap.to(
                    {},
                    {
                        scrollTrigger: {
                            trigger: triggerElement,
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
            }
        }
    });
</script>

{#if !isLoaded}
    <div
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]"
        style="position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh; opacity: {1 -
            loadingProgress / 100}; transition: opacity 0.5s ease-out;"
    >
        <div class="text-center px-4 max-w-md">
            <h2
                class="text-3xl font-black tracking-tighter text-white mb-2 uppercase italic"
            >
                Initializing System
            </h2>
            <p
                class="text-[#00DCF6]/60 text-xs font-mono mb-8 tracking-[0.2em]"
            >
                SYNCING_NEURAL_INTERFACE...
            </p>

            <div
                class="relative w-64 sm:w-80 h-1.5 bg-white/5 rounded-full overflow-hidden mb-4"
            >
                <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00DCF6] to-blue-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,220,246,0.5)]"
                    style="width: {loadingProgress}%"
                ></div>
            </div>

            <div
                class="flex justify-between items-center text-[10px] font-mono text-white/40 w-64 sm:w-80"
            >
                <span>PROGRESS: {loadingProgress}%</span>
                <span
                    >STATUS: {loadingProgress < 100 ? "PENDING" : "READY"}</span
                >
            </div>

            {#if showSkip || loadingProgress > 20}
                <button
                    onclick={() => {
                        isLoaded = true;
                    }}
                    class="mt-12 px-6 py-2 border border-[#00DCF6]/30 bg-[#00DCF6]/10 text-[#00DCF6] text-xs font-mono uppercase tracking-widest hover:bg-[#00DCF6]/20 transition-all duration-300"
                >
                    {loadingProgress < 100
                        ? "Skip Loading"
                        : "Enter Experience"}
                </button>
            {/if}

            {#if loadingProgress === 0}
                <p
                    class="mt-8 text-[10px] text-white/20 font-mono animate-pulse"
                >
                    If loading doesn't start, please refresh.
                </p>
            {/if}
        </div>
    </div>
{/if}

<div class="relative h-[400vh]">
    <div class="sticky top-0 h-screen w-full">
        <canvas
            bind:this={canvasElement}
            class="w-full h-full"
            style="will-change: transform;"
        ></canvas>
    </div>
</div>
