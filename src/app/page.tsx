"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import SplitType from "split-type";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import * as THREE from "three";
import {
    vertexShader,
    aspectCorrectedFluidFragmentShader,
    aspectCorrectedMaskFragmentShader,
    dissolveFragmentShader,
} from "@/shaders/shader";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const maskerRef = useRef<HTMLDivElement>(null);
    const revealBtnRef = useRef<HTMLButtonElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);
    const dissolveDarkCanvasRef = useRef<HTMLCanvasElement>(null);
    const dissolveRedCanvasRef = useRef<HTMLCanvasElement>(null);

    useGSAP(
        () => {
            // ── State variables in closure ───────────────────────
            let mouseX = -200,
                mouseY = -200;
            let cursorX = -200,
                cursorY = -200;
            let isRevealing = false;
            const revealState = { progress: 0.0 };
            const maskSize = { inner: 50, outer: 70 };
            const targetMask = { inner: 50, outer: 70 };

            // Mask sizes for cursor states
            const MASK = {
                default: { inner: 50, outer: 70 },
                extend: { inner: 140, outer: 170 },
                contract: { inner: 6, outer: 12 },
            };

            let snapTarget: HTMLElement | null = null;
            let isSnapping = false;

            // ── Mobile / Touch Detection ────────────────────────
            const isTouchDevice =
                "ontouchstart" in window || navigator.maxTouchPoints > 0;

            const masker = maskerRef.current;
            const cursor = cursorRef.current;

            if (isTouchDevice && masker) {
                document.body.classList.add("is-touch");
            }

            // ── Lenis Smooth Scroll ─────────────────────────────
            let lenis: Lenis | null = null;
            try {
                lenis = new Lenis({
                    lerp: 0.1,
                    smoothWheel: true,
                    touchMultiplier: 1.5,
                });

                lenis.on("scroll", () => {
                    ScrollTrigger.update();
                });

                const lenisTicker = (time: number) => {
                    lenis?.raf(time * 1000);
                };

                gsap.ticker.add(lenisTicker);
                gsap.ticker.lagSmoothing(0);
            } catch (e) {
                console.warn("Lenis init failed:", e);
            }

            // ── Hero Dissolve Transition Setup ───────────────────
            const dissolveRenderers: THREE.WebGLRenderer[] = [];
            const dissolveMaterials: THREE.ShaderMaterial[] = [];
            const dissolveGeometries: THREE.PlaneGeometry[] = [];
            let dissolveScrollProgress = 0;
            let dissolveAnimId: number | null = null;

            const dissolveConfigs = [
                {
                    canvas: dissolveDarkCanvasRef.current,
                    wrapperId: "hero-dissolve-dark",
                    // color: { r: 0.5, g: 0.961, b: 0.969 }, // #f5f5f7
                    color: { r: 0.961, g: 0.961, b: 0.969 }, // #f5f5f7
                },
                {
                    canvas: dissolveRedCanvasRef.current,
                    wrapperId: "hero-dissolve-red",
                    // color: { r: 0.3, g: 0.02, b: 0.031 }, // #1a0508
                    color: { r: 0.102, g: 0.02, b: 0.031 }, // #1a0508
                },
            ];

            dissolveConfigs.forEach(({ canvas, color }) => {
                if (!canvas) return;

                const dRenderer = new THREE.WebGLRenderer({
                    canvas,
                    alpha: true,
                    antialias: false,
                });
                dRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                dissolveRenderers.push(dRenderer);

                const dScene = new THREE.Scene();
                const dCamera = new THREE.OrthographicCamera(
                    -1,
                    1,
                    1,
                    -1,
                    0,
                    1,
                );

                const dGeometry = new THREE.PlaneGeometry(2, 2);
                dissolveGeometries.push(dGeometry);

                const dMaterial = new THREE.ShaderMaterial({
                    vertexShader,
                    fragmentShader: dissolveFragmentShader,
                    uniforms: {
                        uProgress: { value: 0 },
                        uResolution: {
                            value: new THREE.Vector2(
                                canvas.offsetWidth || window.innerWidth,
                                canvas.offsetHeight || window.innerHeight,
                            ),
                        },
                        uColor: {
                            value: new THREE.Vector3(color.r, color.g, color.b),
                        },
                        uSpread: { value: 0.5 },
                    },
                    transparent: true,
                });
                dissolveMaterials.push(dMaterial);

                const dMesh = new THREE.Mesh(dGeometry, dMaterial);
                dScene.add(dMesh);

                // Size the renderer to the canvas element
                const resizeDissolve = () => {
                    const w = canvas.clientWidth || window.innerWidth;
                    const h = canvas.clientHeight || window.innerHeight;
                    dRenderer.setSize(w, h, false);
                    dMaterial.uniforms.uResolution.value.set(w, h);
                };
                resizeDissolve();
                window.addEventListener("resize", resizeDissolve);

                // Store for cleanup
                (dRenderer as any).__resizeDissolve = resizeDissolve;
                (dRenderer as any).__scene = dScene;
                (dRenderer as any).__camera = dCamera;
            });

            // Scroll-driven dissolve progress via Lenis
            if (lenis) {
                lenis.on("scroll", ({ scroll }: { scroll: number }) => {
                    dissolveConfigs.forEach(({ wrapperId }, i) => {
                        const wrapper = document.getElementById(wrapperId);
                        if (!wrapper) return;
                        const wrapperTop = wrapper.offsetTop;
                        const scrollableDistance =
                            wrapper.offsetHeight - window.innerHeight;
                        if (scrollableDistance <= 0) return;
                        const localScroll = scroll - wrapperTop;
                        const progress = Math.min(
                            Math.max((localScroll / scrollableDistance) * 2, 0),
                            1.0,
                        );
                        if (dissolveMaterials[i]) {
                            dissolveMaterials[i].uniforms.uProgress.value =
                                progress;
                        }
                    });
                });
            }

            // Render loop for dissolve canvases
            const dissolveAnimate = () => {
                dissolveRenderers.forEach((dRenderer) => {
                    const dScene = (dRenderer as any).__scene;
                    const dCamera = (dRenderer as any).__camera;
                    if (dScene && dCamera) {
                        dRenderer.render(dScene, dCamera);
                    }
                });
                dissolveAnimId = requestAnimationFrame(dissolveAnimate);
            };
            dissolveAnimate();

            // ── WebGL Fluid Mask Simulation Setup ────────────────
            const decay = 0.92;
            const maskResolution = 1000;

            const maskCanvas = document.createElement("canvas");
            const renderer = new THREE.WebGLRenderer({
                canvas: maskCanvas,
                antialias: false,
                alpha: true,
                preserveDrawingBuffer: true,
            });
            renderer.setPixelRatio(1);

            const getPageSize = () => {
                const docElement = document.documentElement;
                const body = document.body;
                return {
                    width:
                        Math.max(
                            body.scrollWidth,
                            docElement.scrollWidth,
                            body.offsetWidth,
                            docElement.offsetWidth,
                            body.clientWidth,
                            docElement.clientWidth,
                        ) || 1,
                    height:
                        Math.max(
                            body.scrollHeight,
                            docElement.scrollHeight,
                            body.offsetHeight,
                            docElement.offsetHeight,
                            body.clientHeight,
                            docElement.clientHeight,
                        ) || 1,
                };
            };

            function computeMaskSize() {
                const { width, height } = getPageSize();
                const scale = maskResolution / Math.max(width, height);
                return {
                    w: Math.max(1, Math.round(width * scale)),
                    h: Math.max(1, Math.round(height * scale)),
                    pageW: width,
                    pageH: height,
                };
            }

            let { w: maskW, h: maskH, pageW, pageH } = computeMaskSize();
            maskCanvas.width = maskW;
            maskCanvas.height = maskH;
            renderer.setSize(maskW, maskH, false);

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            const webglMouse = new THREE.Vector2(0.5, 0.5);
            const webglPrevMouse = new THREE.Vector2(0.5, 0.5);
            let webglIsMoving = false;
            let webglLastMoveTime = 0;

            const pingPongTargets = [
                new THREE.WebGLRenderTarget(maskW, maskH, {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    type: THREE.FloatType,
                }),
                new THREE.WebGLRenderTarget(maskW, maskH, {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    type: THREE.FloatType,
                }),
            ];
            let currentTarget = 0;

            const trailsMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uPrevTrails: { value: null },
                    uMouse: { value: webglMouse },
                    uPrevMouse: { value: webglPrevMouse },
                    uResolution: { value: new THREE.Vector2(maskW, maskH) },
                    uRadius: { value: 20.0 }, // radius in canvas pixels
                    uDecay: { value: decay },
                    uIsMoving: { value: false },
                },
                vertexShader,
                fragmentShader: aspectCorrectedFluidFragmentShader,
            });

            const maskMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uFluid: { value: null },
                    uDpr: {
                        value:
                            typeof window !== "undefined"
                                ? window.devicePixelRatio || 1
                                : 1,
                    },
                    uRevealProgress: { value: 0.0 },
                    uRevealCenter: { value: new THREE.Vector2(0.5, 0.5) },
                    uResolution: { value: new THREE.Vector2(maskW, maskH) },
                },
                vertexShader,
                fragmentShader: aspectCorrectedMaskFragmentShader,
                transparent: true,
            });

            const planeGeometry = new THREE.PlaneGeometry(2, 2);
            const maskMesh = new THREE.Mesh(planeGeometry, maskMaterial);
            scene.add(maskMesh);

            const simMesh = new THREE.Mesh(planeGeometry, trailsMaterial);
            const simScene = new THREE.Scene();
            simScene.add(simMesh);

            renderer.setRenderTarget(pingPongTargets[0]);
            renderer.clear();
            renderer.setRenderTarget(pingPongTargets[1]);
            renderer.clear();
            renderer.setRenderTarget(null);

            const resizeWebGL = () => {
                const next = computeMaskSize();
                maskW = next.w;
                maskH = next.h;
                pageW = next.pageW;
                pageH = next.pageH;
                maskCanvas.width = maskW;
                maskCanvas.height = maskH;
                renderer.setSize(maskW, maskH, false);
                trailsMaterial.uniforms.uResolution.value.set(maskW, maskH);
                maskMaterial.uniforms.uResolution.value.set(maskW, maskH);
                pingPongTargets.forEach((t) => t.setSize(maskW, maskH));
            };

            // ── Custom Cursor + Mask Position Ticker ────────────
            const cursorTicker = () => {
                if (!cursor || !masker) return;

                // Lerp cursor position
                if (snapTarget) {
                    const rect = snapTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    // Add a slight magnetic pull towards the mouse
                    const magneticX = centerX + (mouseX - centerX) * 0.1;
                    const magneticY = centerY + (mouseY - centerY) * 0.1;

                    cursorX += (magneticX - cursorX) * 0.3;
                    cursorY += (magneticY - cursorY) * 0.3;
                } else {
                    cursorX += (mouseX - cursorX) * 0.22;
                    cursorY += (mouseY - cursorY) * 0.22;
                }

                // Update cursor element
                cursor.style.left = cursorX + "px";
                cursor.style.top = cursorY + "px";

                // Lerp mask size (for smooth transitions)
                if (!isRevealing) {
                    maskSize.inner +=
                        (targetMask.inner - maskSize.inner) * 0.15;
                    maskSize.outer +=
                        (targetMask.outer - maskSize.outer) * 0.15;
                }

                // Check for dynamic page size changes (e.g. font loaded or layout shift)
                const { width: pW, height: pH } = getPageSize();
                if (Math.abs(pH - pageH) > 5 || Math.abs(pW - pageW) > 5) {
                    resizeWebGL();
                }

                const pageCursorX = cursorX;
                const pageCursorY = cursorY + window.scrollY;

                webglPrevMouse.copy(webglMouse);
                webglMouse.x = pageCursorX / pageW;
                webglMouse.y = 1.0 - pageCursorY / pageH;

                const deltaMove = webglMouse.distanceToSquared(webglPrevMouse);
                if (deltaMove > 0.000001) {
                    webglIsMoving = true;
                    webglLastMoveTime = performance.now();
                } else if (performance.now() - webglLastMoveTime > 50) {
                    webglIsMoving = false;
                }

                // Run WebGL fluid simulation step
                const scale = maskH / pageH;
                const prevTarget = pingPongTargets[currentTarget];
                currentTarget = (currentTarget + 1) % 2;
                const currentRenderTarget = pingPongTargets[currentTarget];

                trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;
                trailsMaterial.uniforms.uMouse.value.copy(webglMouse);
                trailsMaterial.uniforms.uPrevMouse.value.copy(webglPrevMouse);
                trailsMaterial.uniforms.uIsMoving.value = webglIsMoving;
                trailsMaterial.uniforms.uRadius.value = maskSize.outer * scale;

                renderer.setRenderTarget(currentRenderTarget);
                renderer.render(simScene, camera);

                maskMaterial.uniforms.uFluid.value =
                    currentRenderTarget.texture;
                maskMaterial.uniforms.uRevealProgress.value =
                    revealState.progress;

                renderer.setRenderTarget(null);
                renderer.render(scene, camera);

                // Hand the freshly-rendered frame to CSS as the top layer's mask
                const dataUrl = maskCanvas.toDataURL("image/png");
                const maskValue = `url(${dataUrl})`;
                masker.style.maskImage = maskValue;
                masker.style.webkitMaskImage = maskValue;
            };

            const handleMouseMove = (e: MouseEvent) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };

            const handleTouchMove = (e: TouchEvent) => {
                if (e.touches.length > 0) {
                    mouseX = e.touches[0].clientX;
                    mouseY = e.touches[0].clientY;
                }
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("touchmove", handleTouchMove, {
                passive: true,
            });
            gsap.ticker.add(cursorTicker);

            // ── Cursor States (extend / contract / snap) ─────────
            if (!isTouchDevice && cursor) {
                // Elements that extend the cursor (large text / headings)
                document
                    .querySelectorAll(".layer__dark .js-cursor-extend")
                    .forEach((el) => {
                        el.addEventListener("mouseenter", () => {
                            cursor.classList.add("is-extended");
                            cursor.classList.remove("is-contracted");
                            targetMask.inner = MASK.extend.inner;
                            targetMask.outer = MASK.extend.outer;
                        });
                        el.addEventListener("mouseleave", () => {
                            cursor.classList.remove("is-extended");
                            targetMask.inner = MASK.default.inner;
                            targetMask.outer = MASK.default.outer;
                        });
                    });

                // Elements that contract the cursor (links, buttons)
                document
                    .querySelectorAll(".layer__dark .js-cursor-contract")
                    .forEach((el) => {
                        el.addEventListener("mouseenter", () => {
                            cursor.classList.add("is-contracted");
                            cursor.classList.remove("is-extended");
                            targetMask.inner = MASK.contract.inner;
                            targetMask.outer = MASK.contract.outer;
                        });
                        el.addEventListener("mouseleave", () => {
                            cursor.classList.remove("is-contracted");
                            targetMask.inner = MASK.default.inner;
                            targetMask.outer = MASK.default.outer;
                        });
                    });

                // Elements that snap the cursor (buttons, specific links)
                document
                    .querySelectorAll(".layer__dark .js-cursor-snap")
                    .forEach((el) => {
                        el.addEventListener("mouseenter", () => {
                            isSnapping = true;
                            snapTarget = el as HTMLElement;
                            cursor.classList.add("is-snapped");

                            const rect = el.getBoundingClientRect();
                            const style = window.getComputedStyle(el);
                            cursor.style.setProperty(
                                "--snap-w",
                                rect.width + "px",
                            );
                            cursor.style.setProperty(
                                "--snap-h",
                                rect.height + "px",
                            );
                            cursor.style.setProperty(
                                "--snap-r",
                                style.borderRadius,
                            );

                            gsap.killTweensOf(el);
                        });

                        el.addEventListener("mousemove", (e) => {
                            if (!isSnapping) return;
                            const ev = e as MouseEvent;
                            const rect = el.getBoundingClientRect();
                            const centerX = rect.left + rect.width / 2;
                            const centerY = rect.top + rect.height / 2;
                            const distX = ev.clientX - centerX;
                            const distY = ev.clientY - centerY;

                            gsap.to(el, {
                                x: distX * 0.3,
                                y: distY * 0.3,
                                duration: 0.4,
                                ease: "power2.out",
                            });
                        });

                        el.addEventListener("mouseleave", () => {
                            isSnapping = false;
                            snapTarget = null;
                            cursor.classList.remove("is-snapped");

                            gsap.to(el, {
                                x: 0,
                                y: 0,
                                duration: 0.6,
                                ease: "elastic.out(1, 0.4)",
                            });
                        });
                    });
            }

            // ── Reveal Button ────────────────────────────────────
            const revealBtn = revealBtnRef.current;
            const expandSize =
                Math.max(window.innerWidth, window.innerHeight) * 1.5;
            let revealTween: gsap.core.Tween | null = null;

            const startReveal = (cx?: number, cy?: number) => {
                isRevealing = true;
                if (!masker) return;

                const centerX = cx !== undefined ? cx : window.innerWidth / 2;
                const centerY = cy !== undefined ? cy : window.innerHeight / 2;

                const { width: pW, height: pH } = getPageSize();
                const pageCenterX = centerX;
                const pageCenterY = centerY + window.scrollY;

                maskMaterial.uniforms.uRevealCenter.value.set(
                    pageCenterX / pW,
                    1.0 - pageCenterY / pH,
                );

                if (revealTween) revealTween.kill();
                revealTween = gsap.to(revealState, {
                    progress: 1.0,
                    duration: 0.9,
                    ease: "power3.out",
                    onUpdate: () => {
                        maskMaterial.uniforms.uRevealProgress.value =
                            revealState.progress;
                    },
                });
            };

            const stopReveal = () => {
                if (revealTween) revealTween.kill();
                revealTween = gsap.to(revealState, {
                    progress: 0.0,
                    duration: 0.5,
                    ease: "power2.in",
                    onUpdate: () => {
                        maskMaterial.uniforms.uRevealProgress.value =
                            revealState.progress;
                    },
                    onComplete: () => {
                        isRevealing = false;
                    },
                });
            };

            if (revealBtn) {
                revealBtn.addEventListener("mousedown", (e) => {
                    startReveal(e.clientX, e.clientY);
                });
                revealBtn.addEventListener("mouseup", stopReveal);
                revealBtn.addEventListener("mouseleave", () => {
                    if (isRevealing) stopReveal();
                });

                // Touch support
                const handleTouchStart = (e: TouchEvent) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    startReveal(touch.clientX, touch.clientY);
                };
                const handleTouchEnd = (e: TouchEvent) => {
                    e.preventDefault();
                    stopReveal();
                };

                revealBtn.addEventListener("touchstart", handleTouchStart, {
                    passive: false,
                });
                revealBtn.addEventListener("touchend", handleTouchEnd, {
                    passive: false,
                });
                revealBtn.addEventListener("touchcancel", stopReveal);

                if (!isTouchDevice && cursor) {
                    revealBtn.addEventListener("mouseenter", () => {
                        cursor.classList.add("is-extended");
                        targetMask.inner = 60;
                        targetMask.outer = 80;
                    });
                    revealBtn.addEventListener("mouseleave", () => {
                        if (!isRevealing) {
                            cursor.classList.remove("is-extended");
                            targetMask.inner = MASK.default.inner;
                            targetMask.outer = MASK.default.outer;
                        }
                    });
                }
            }

            // Keyboard Shortcut (Hold Ctrl + Shift)
            let ctrlShiftActive = false;
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
                    if (
                        !ctrlShiftActive &&
                        (e.key === "Control" || e.key === "Shift")
                    ) {
                        e.preventDefault();
                        ctrlShiftActive = true;
                        startReveal();
                    }
                }
            };

            const handleKeyUp = (e: KeyboardEvent) => {
                if (ctrlShiftActive && (!e.ctrlKey || !e.shiftKey)) {
                    ctrlShiftActive = false;
                    stopReveal();
                }
            };

            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);

            // ── Character Slide-Up Animations ───────────────────
            const darkCharTargets = document.querySelectorAll(
                ".layer__dark .js-anim--chars",
            );
            const redCharTargets = document.querySelectorAll(
                ".layer__red .js-anim--chars",
            );
            const splitInstances: SplitType[] = [];

            darkCharTargets.forEach((el, idx) => {
                const darkSplit = new SplitType(el as HTMLElement, {
                    types: "chars",
                });
                splitInstances.push(darkSplit);
                gsap.set(darkSplit.chars, { y: "110%" });

                const redEl = redCharTargets[idx];
                let redSplit: SplitType | null = null;
                if (redEl) {
                    redSplit = new SplitType(redEl as HTMLElement, {
                        types: "chars",
                    });
                    splitInstances.push(redSplit);
                    gsap.set(redSplit.chars, { y: "110%" });
                }

                const isHero = el.closest(".hero");
                if (isHero) {
                    gsap.to(darkSplit.chars, {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.03,
                        delay: 0.3 + idx * 0.15,
                    });
                    if (redSplit) {
                        gsap.to(redSplit.chars, {
                            y: "0%",
                            duration: 1,
                            ease: "power4.out",
                            stagger: 0.03,
                            delay: 0.3 + idx * 0.15,
                        });
                    }
                } else {
                    const targetsToAnim = [
                        darkSplit.chars,
                        redSplit ? redSplit.chars : null,
                    ].filter((t): t is HTMLElement[] => t !== null);

                    targetsToAnim.forEach((chars) => {
                        gsap.to(chars, {
                            y: "0%",
                            duration: 0.8,
                            ease: "power3.out",
                            stagger: 0.02,
                            scrollTrigger: {
                                trigger: el,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        });
                    });
                }
            });

            // ── Line Reveal Animations ──────────────────────────
            const darkLineTargets = document.querySelectorAll(
                ".layer__dark .js-anim--lines--sim",
            );
            const redLineTargets = document.querySelectorAll(
                ".layer__red .js-anim--lines--sim",
            );
            const lineObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const parent = entry.target.parentElement;
                            const siblings =
                                parent?.querySelectorAll(
                                    ".js-anim--lines--sim",
                                ) || [];
                            let index = 0;
                            siblings.forEach((sib, i) => {
                                if (sib === entry.target) index = i;
                            });

                            let globalIdx = -1;
                            darkLineTargets.forEach((target, i) => {
                                if (target === entry.target) globalIdx = i;
                            });

                            setTimeout(() => {
                                entry.target.classList.add("is-visible");
                                if (
                                    globalIdx !== -1 &&
                                    redLineTargets[globalIdx]
                                ) {
                                    redLineTargets[globalIdx].classList.add(
                                        "is-visible",
                                    );
                                }
                            }, index * 100);

                            lineObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
            );

            darkLineTargets.forEach((el) => lineObserver.observe(el));

            // ── Scroll Paragraph Mask ───────────────────────────
            const darkParagraphs = document.querySelectorAll(
                ".layer__dark .js-scroll-paragraph-mask",
            );
            const redParagraphs = document.querySelectorAll(
                ".layer__red .js-scroll-paragraph-mask",
            );
            darkParagraphs.forEach((p, idx) => {
                const darkSplit = new SplitType(p as HTMLElement, {
                    types: "words",
                });
                splitInstances.push(darkSplit);
                darkSplit.words?.forEach((word) => {
                    word.classList.add("word");
                });

                const redP = redParagraphs[idx];
                let redSplit: SplitType | null = null;
                if (redP) {
                    redSplit = new SplitType(redP as HTMLElement, {
                        types: "words",
                    });
                    splitInstances.push(redSplit);
                    redSplit.words?.forEach((word) => {
                        word.classList.add("word");
                    });
                }

                gsap.to(darkSplit.words, {
                    opacity: 1,
                    stagger: 0.05,
                    ease: "none",
                    scrollTrigger: {
                        trigger: p,
                        start: "top 75%",
                        end: "bottom 40%",
                        scrub: 1,
                    },
                });

                if (redSplit && redSplit.words) {
                    gsap.to(redSplit.words, {
                        opacity: 1,
                        stagger: 0.05,
                        ease: "none",
                        scrollTrigger: {
                            trigger: p,
                            start: "top 75%",
                            end: "bottom 40%",
                            scrub: 1,
                        },
                    });
                }
            });

            // ── Parallax Floating Elements ──────────────────────
            const darkFloats = document.querySelectorAll(
                ".layer__dark [data-parallax-speed]",
            );
            const redFloats = document.querySelectorAll(
                ".layer__red [data-parallax-speed]",
            );
            darkFloats.forEach((el, idx) => {
                const speed = parseFloat(
                    el.getAttribute("data-parallax-speed") || "0",
                );
                const is3D = el.hasAttribute("data-parallax-3d");

                const parentSection = el.closest("section");
                if (!parentSection) return;

                const animProps: gsap.TweenVars = {
                    yPercent: speed * 200,
                    ease: "none",
                    scrollTrigger: {
                        trigger: parentSection,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                };

                if (is3D) {
                    animProps.rotationY = speed * 360;
                    animProps.rotationX = speed * 180;
                    animProps.rotationZ = speed * 90;
                }

                gsap.to(el, animProps);

                const redFloat = redFloats[idx];
                if (redFloat) {
                    gsap.to(redFloat, animProps);
                }
            });

            // ── Hero Floating Animation ──────────────────────────
            const darkHeroImageWrappers = document.querySelectorAll(
                ".layer__dark .hero__image-wrapper",
            );
            const redHeroImageWrappers = document.querySelectorAll(
                ".layer__red .hero__image-wrapper",
            );
            darkHeroImageWrappers.forEach((wrapper, idx) => {
                const redWrapper = redHeroImageWrappers[idx];
                const wrappers = [wrapper, redWrapper].filter(Boolean);
                gsap.to(wrappers, {
                    y: "12px",
                    duration: 3.5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                });
            });

            const darkFloatCards = document.querySelectorAll(
                ".layer__dark .hero__float-card",
            );
            const redFloatCards = document.querySelectorAll(
                ".layer__red .hero__float-card",
            );
            darkFloatCards.forEach((card, idx) => {
                const redCard = redFloatCards[idx];
                const cards = [card, redCard].filter(Boolean);
                gsap.to(cards, {
                    y: idx % 2 === 0 ? "8px" : "-8px",
                    x: idx % 3 === 0 ? "5px" : "-5px",
                    duration: 3 + idx * 0.5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: idx * 0.15,
                });
            });

            // ── Section Height Sync ─────────────────────────────
            const syncLayerHeights = () => {
                const darkLayer = document.getElementById("layer-dark");
                const redLayer = document.getElementById("layer-red");
                if (!darkLayer || !redLayer) return;

                const darkChildren = darkLayer.children;
                const redChildren = redLayer.children;
                const count = Math.min(darkChildren.length, redChildren.length);

                for (let i = 0; i < count; i++) {
                    const darkChild = darkChildren[i] as HTMLElement;
                    const redChild = redChildren[i] as HTMLElement;
                    redChild.style.minHeight = "";
                    redChild.style.height = "";
                    const darkH = darkChild.offsetHeight;
                    redChild.style.height = darkH + "px";
                }
            };

            const handleResize = () => {
                syncLayerHeights();
                resizeWebGL();
            };

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    handleResize();
                    ScrollTrigger.refresh();
                });
            } else {
                setTimeout(() => {
                    handleResize();
                    ScrollTrigger.refresh();
                }, 500);
            }

            window.addEventListener("resize", handleResize);

            // ── Nav Smooth Scroll ────────────────────────────────
            const navLinks = document.querySelectorAll(
                ".layer__dark .nav__link[href^='#']",
            );
            navLinks.forEach((link) => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const href = link.getAttribute("href");
                    if (!href) return;
                    const target = document.querySelector(href);
                    if (target && lenis) {
                        lenis.scrollTo(target as HTMLElement, { offset: -80 });
                    } else if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                    }
                });
            });

            // ── 3D Tilt on Project Cards ─────────────────────────
            if (!isTouchDevice) {
                const darkProjects = document.querySelectorAll(
                    ".layer__dark .project[data-tilt]",
                );
                const redProjects = document.querySelectorAll(
                    ".layer__red .project[data-tilt]",
                );
                darkProjects.forEach((project, idx) => {
                    const redProject = redProjects[idx];
                    project.addEventListener("mousemove", (e) => {
                        const ev = e as MouseEvent;
                        const rect = project.getBoundingClientRect();
                        const x = (ev.clientX - rect.left) / rect.width - 0.5;
                        const y = (ev.clientY - rect.top) / rect.height - 0.5;

                        const animObj = {
                            rotateY: x * 8,
                            rotateX: -y * 5,
                            x: x * 15,
                            duration: 0.4,
                            ease: "power2.out",
                            transformPerspective: 800,
                        };
                        gsap.to(project, animObj);
                        if (redProject) {
                            gsap.to(redProject, animObj);
                        }
                    });

                    project.addEventListener("mouseleave", () => {
                        const resetObj = {
                            rotateY: 0,
                            rotateX: 0,
                            x: 0,
                            duration: 0.6,
                            ease: "elastic.out(1, 0.5)",
                        };
                        gsap.to(project, resetObj);
                        if (redProject) {
                            gsap.to(redProject, resetObj);
                        }
                    });
                });
            }

            // ── Clean Up ─────────────────────────────────────────
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("touchmove", handleTouchMove);
                gsap.ticker.remove(cursorTicker);
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
                window.removeEventListener("resize", handleResize);
                lineObserver.disconnect();
                splitInstances.forEach((inst) => inst.revert());
                if (lenis) {
                    lenis.destroy();
                }

                // Clean up WebGL resources
                pingPongTargets.forEach((t) => t.dispose());
                trailsMaterial.dispose();
                maskMaterial.dispose();
                planeGeometry.dispose();
                renderer.dispose();

                // Clean up dissolve resources
                if (dissolveAnimId !== null) {
                    cancelAnimationFrame(dissolveAnimId);
                }
                dissolveRenderers.forEach((dRenderer) => {
                    const resizeFn = (dRenderer as any).__resizeDissolve;
                    if (resizeFn)
                        window.removeEventListener("resize", resizeFn);
                    dRenderer.dispose();
                });
                dissolveMaterials.forEach((m) => m.dispose());
                dissolveGeometries.forEach((g) => g.dispose());
            };
        },
        { dependencies: [] },
    );

    return (
        <>
            {/* ===== CUSTOM CURSOR ===== */}
            <div className="cursor" id="cursor" ref={cursorRef} />

            {/* ===== THREE.JS CANVAS ===== */}

            {/* ===== PAGE WRAPPER ===== */}
            <main className="page" id="page" ref={pageRef}>
                {/* ════════════════════════════════════════════════════════
             DARK LAYER — Professional / Polished
             ════════════════════════════════════════════════════════ */}
                <div className="layer layer__dark" id="layer-dark">
                    {/* Background Decorations */}
                    <div className="bg-decor" aria-hidden="true">
                        <div className="bg-grid" />
                        <div className="bg-orb bg-orb--1" />
                        <div className="bg-orb bg-orb--2" />
                        <div className="bg-orb bg-orb--3" />
                        <div className="bg-glow bg-glow--hero" />
                    </div>

                    <Navbar layer="dark" />

                    <div className="hero-dissolve" id="hero-dissolve-dark">
                        <div className="hero-dissolve__sticky">
                            <Hero layer="dark" />
                            <canvas
                                className="hero-dissolve__canvas"
                                ref={dissolveDarkCanvasRef}
                            />
                        </div>
                    </div>

                    <About layer="dark" />
                    <Projects layer="dark" />
                    <Experience layer="dark" />
                    <Stats layer="dark" />
                    {/* <Testimonials layer="dark" /> */}
                    <Contact layer="dark" />
                    <Footer layer="dark" />
                </div>

                {/* ════════════════════════════════════════════════════════
             RED LAYER — Honest / Satirical
             ════════════════════════════════════════════════════════ */}
                <div
                    className="layer layer__red js-masker"
                    id="layer-red"
                    ref={maskerRef}
                    aria-hidden="true"
                >
                    {/* Background Decorations */}
                    <div className="bg-decor" aria-hidden="true">
                        <div className="bg-grid" />
                        <div className="bg-orb bg-orb--1" />
                        <div className="bg-orb bg-orb--2" />
                        <div className="bg-orb bg-orb--3" />
                        <div className="bg-glow bg-glow--hero" />
                    </div>

                    <Navbar layer="red" />

                    <div className="hero-dissolve" id="hero-dissolve-red">
                        <div className="hero-dissolve__sticky">
                            <Hero layer="red" />
                            <canvas
                                className="hero-dissolve__canvas"
                                ref={dissolveRedCanvasRef}
                            />
                        </div>
                    </div>

                    <About layer="red" />
                    <Projects layer="red" />
                    <Experience layer="red" />
                    <Stats layer="red" />
                    {/* <Testimonials layer="red" /> */}
                    <Contact layer="red" />
                    <Footer layer="red" />
                </div>
            </main>

            {/* ===== REVEAL BUTTON ===== */}
            <button
                className="reveal-btn js-cursor-snap"
                id="js-btn_clipPath"
                ref={revealBtnRef}
                aria-label="Hold to reveal the truth"
            >
                <svg viewBox="0 0 100 100" className="reveal-btn__svg">
                    <defs>
                        <path
                            id="circlePath"
                            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        />
                    </defs>
                    <text className="reveal-btn__text-el">
                        <textPath href="#circlePath">
                            HOLD TO REVEAL • CTRL+SHIFT • HOLD TO REVEAL •
                            CTRL+SHIFT •
                        </textPath>
                    </text>
                </svg>
                <span className="reveal-btn__icon">◉</span>
            </button>
        </>
    );
}
