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

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const maskerRef = useRef<HTMLDivElement>(null);
    const revealBtnRef = useRef<HTMLButtonElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // ── State variables in closure ───────────────────────
            let mouseX = -200,
                mouseY = -200;
            let cursorX = -200,
                cursorY = -200;
            let isRevealing = false;
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
                masker.style.setProperty("--mask-inner", "0px");
                masker.style.setProperty("--mask-outer", "0px");
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

                // Update mask position (convert viewport → page coords)
                const pageY = cursorY + window.scrollY;
                masker.style.setProperty("--x", cursorX + "px");
                masker.style.setProperty("--y", pageY + "px");

                // Lerp mask size (for smooth transitions)
                if (!isRevealing) {
                    maskSize.inner +=
                        (targetMask.inner - maskSize.inner) * 0.15;
                    maskSize.outer +=
                        (targetMask.outer - maskSize.outer) * 0.15;
                    masker.style.setProperty(
                        "--mask-inner",
                        maskSize.inner + "px",
                    );
                    masker.style.setProperty(
                        "--mask-outer",
                        maskSize.outer + "px",
                    );
                }
            };

            const handleMouseMove = (e: MouseEvent) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };

            if (!isTouchDevice) {
                document.addEventListener("mousemove", handleMouseMove);
                gsap.ticker.add(cursorTicker);
            }

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
                const pageCenterY = centerY + window.scrollY;

                masker.style.setProperty("--x", centerX + "px");
                masker.style.setProperty("--y", pageCenterY + "px");

                if (revealTween) revealTween.kill();
                revealTween = gsap.to(maskSize, {
                    inner: expandSize,
                    outer: expandSize,
                    duration: 0.9,
                    ease: "power3.out",
                    onUpdate: () => {
                        masker.style.setProperty(
                            "--mask-inner",
                            maskSize.inner + "px",
                        );
                        masker.style.setProperty(
                            "--mask-outer",
                            maskSize.outer + "px",
                        );
                    },
                });
            };

            const stopReveal = () => {
                if (revealTween) revealTween.kill();
                revealTween = gsap.to(maskSize, {
                    inner: MASK.default.inner,
                    outer: MASK.default.outer,
                    duration: 0.5,
                    ease: "power2.in",
                    onUpdate: () => {
                        masker?.style.setProperty(
                            "--mask-inner",
                            maskSize.inner + "px",
                        );
                        masker?.style.setProperty(
                            "--mask-outer",
                            maskSize.outer + "px",
                        );
                    },
                    onComplete: () => {
                        isRevealing = false;
                        targetMask.inner = MASK.default.inner;
                        targetMask.outer = MASK.default.outer;
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
            const charTargets = document.querySelectorAll(
                ".layer__dark .js-anim--chars",
            );
            const splitInstances: SplitType[] = [];

            charTargets.forEach((el, idx) => {
                const split = new SplitType(el as HTMLElement, {
                    types: "chars",
                });
                splitInstances.push(split);

                gsap.set(split.chars, { y: "110%" });

                const isHero = el.closest(".hero");
                if (isHero) {
                    gsap.to(split.chars, {
                        y: "0%",
                        duration: 1,
                        ease: "power4.out",
                        stagger: 0.03,
                        delay: 0.3 + idx * 0.15,
                    });
                } else {
                    gsap.to(split.chars, {
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
                }
            });

            // ── Line Reveal Animations ──────────────────────────
            const lineTargets = document.querySelectorAll(
                ".layer__dark .js-anim--lines--sim",
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

                            setTimeout(() => {
                                entry.target.classList.add("is-visible");
                            }, index * 100);

                            lineObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
            );

            lineTargets.forEach((el) => lineObserver.observe(el));

            // ── Scroll Paragraph Mask ───────────────────────────
            const paragraphs = document.querySelectorAll(
                ".layer__dark .js-scroll-paragraph-mask",
            );
            paragraphs.forEach((p) => {
                const split = new SplitType(p as HTMLElement, {
                    types: "words",
                });
                splitInstances.push(split);

                split.words?.forEach((word) => {
                    word.classList.add("word");
                });

                gsap.to(split.words, {
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
            });

            // ── Parallax Floating Elements ──────────────────────
            const floats = document.querySelectorAll(
                ".layer__dark [data-parallax-speed]",
            );
            floats.forEach((el) => {
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
            });

            // ── Hero Floating Animation ──────────────────────────
            const heroImageWrappers = document.querySelectorAll(
                ".hero__image-wrapper",
            );
            heroImageWrappers.forEach((wrapper) => {
                gsap.to(wrapper, {
                    y: "12px",
                    duration: 3.5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                });
            });

            const floatCards = document.querySelectorAll(".hero__float-card");
            floatCards.forEach((card, idx) => {
                gsap.to(card, {
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
                    const darkH = darkChild.offsetHeight;
                    redChild.style.minHeight = darkH + "px";
                }
            };

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    syncLayerHeights();
                    ScrollTrigger.refresh();
                });
            } else {
                setTimeout(() => {
                    syncLayerHeights();
                    ScrollTrigger.refresh();
                }, 500);
            }

            window.addEventListener("resize", syncLayerHeights);

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
                const projects = document.querySelectorAll(
                    ".layer__dark .project[data-tilt]",
                );
                projects.forEach((project) => {
                    project.addEventListener("mousemove", (e) => {
                        const ev = e as MouseEvent;
                        const rect = project.getBoundingClientRect();
                        const x = (ev.clientX - rect.left) / rect.width - 0.5;
                        const y = (ev.clientY - rect.top) / rect.height - 0.5;
                        gsap.to(project, {
                            rotateY: x * 8,
                            rotateX: -y * 5,
                            x: x * 15,
                            duration: 0.4,
                            ease: "power2.out",
                            transformPerspective: 800,
                        });
                    });

                    project.addEventListener("mouseleave", () => {
                        gsap.to(project, {
                            rotateY: 0,
                            rotateX: 0,
                            x: 0,
                            duration: 0.6,
                            ease: "elastic.out(1, 0.5)",
                        });
                    });
                });
            }

            // ── Clean Up ─────────────────────────────────────────
            return () => {
                if (!isTouchDevice) {
                    document.removeEventListener("mousemove", handleMouseMove);
                    gsap.ticker.remove(cursorTicker);
                }
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
                window.removeEventListener("resize", syncLayerHeights);
                lineObserver.disconnect();
                splitInstances.forEach((inst) => inst.revert());
                if (lenis) {
                    lenis.destroy();
                }
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

                    <Hero layer="dark" />

                    {/* Marquee */}
                    <div className="marquee">
                        <div className="marquee__track">
                            <span className="marquee__content">
                                REACT NATIVE&nbsp; •&nbsp; NEXT.JS&nbsp; •&nbsp;
                                NODE.JS&nbsp; •&nbsp; DOCKER&nbsp; •&nbsp;
                                POSTGRESQL&nbsp; •&nbsp; MONGODB&nbsp; •&nbsp;
                                FIREBASE&nbsp; •&nbsp; EXPRESS&nbsp; •&nbsp;
                                GSAP&nbsp; •&nbsp; THREE.JS&nbsp; •&nbsp;
                                TURBOREPO&nbsp; •&nbsp; DRIZZLE ORM&nbsp;
                                •&nbsp;
                            </span>
                            <span
                                className="marquee__content"
                                aria-hidden="true"
                            >
                                REACT NATIVE&nbsp; •&nbsp; NEXT.JS&nbsp; •&nbsp;
                                NODE.JS&nbsp; •&nbsp; DOCKER&nbsp; •&nbsp;
                                POSTGRESQL&nbsp; •&nbsp; MONGODB&nbsp; •&nbsp;
                                FIREBASE&nbsp; •&nbsp; EXPRESS&nbsp; •&nbsp;
                                GSAP&nbsp; •&nbsp; THREE.JS&nbsp; •&nbsp;
                                TURBOREPO&nbsp; •&nbsp; DRIZZLE ORM&nbsp;
                                •&nbsp;
                            </span>
                        </div>
                    </div>
                    <About layer="dark" />
                    <Projects layer="dark" />
                    <Experience layer="dark" />
                    <Stats layer="dark" />
                    <Testimonials layer="dark" />
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
                    <Hero layer="red" />

                    {/* Marquee */}
                    <div className="marquee">
                        <div className="marquee__track">
                            <span className="marquee__content">
                                CONSOLE.LOG&nbsp; •&nbsp; CHATGPT&nbsp; •&nbsp;
                                NPM INSTALL --FORCE&nbsp;•&nbsp; GEMINI&nbsp;
                                •&nbsp; GIT PUSH -F&nbsp; •&nbsp;
                                CTRL+Z&nbsp;•&nbsp; CLAUDE&nbsp; •&nbsp; IT
                                WORKS ON MY MACHINE&nbsp; •&nbsp; TODO: FIX
                                LATER&nbsp; •&nbsp; MASS GOOGLE&nbsp; •&nbsp;
                                MASS PRAY&nbsp; •&nbsp;
                            </span>
                            <span className="marquee__content">
                                CONSOLE.LOG&nbsp; •&nbsp; CHATGPT&nbsp; •&nbsp;
                                NPM INSTALL --FORCE&nbsp;•&nbsp; GEMINI&nbsp;
                                •&nbsp; GIT PUSH -F&nbsp; •&nbsp;
                                CTRL+Z&nbsp;•&nbsp; CLAUDE&nbsp; •&nbsp; IT
                                WORKS ON MY MACHINE&nbsp; •&nbsp; TODO: FIX
                                LATER&nbsp; •&nbsp; MASS GOOGLE&nbsp; •&nbsp;
                                MASS PRAY&nbsp; •&nbsp;
                            </span>
                        </div>
                    </div>

                    <About layer="red" />
                    <Projects layer="red" />
                    <Experience layer="red" />
                    <Stats layer="red" />
                    <Testimonials layer="red" />
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
