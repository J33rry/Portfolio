"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import SplitType from "split-type";
import FluidReveal, { type FluidRevealHandle } from "@/components/FluidReveal";
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
  const maskerRef = useRef<HTMLDivElement>(null);
  const revealBtnRef = useRef<HTMLButtonElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const fluidRef = useRef<FluidRevealHandle>(null);

  useGSAP(
    () => {
      // ── State variables in closure ───────────────────────
      let isRevealing = false;

      // ── Mobile / Touch Detection ────────────────────────
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      if (isTouchDevice && maskerRef.current) {
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

      // ── Reveal Button (fluid splat injection) ─────────────
      const revealBtn = revealBtnRef.current;

      const startReveal = (cx?: number, cy?: number) => {
        isRevealing = true;
        const centerX = cx !== undefined ? cx : window.innerWidth / 2;
        const centerY = cy !== undefined ? cy : window.innerHeight / 2;
        fluidRef.current?.startContinuousSplat(centerX, centerY);
      };

      const stopReveal = () => {
        isRevealing = false;
        fluidRef.current?.stopContinuousSplat();
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
      }

      // Keyboard Shortcut (Hold Ctrl + Shift)
      let ctrlShiftActive = false;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
          if (!ctrlShiftActive && (e.key === "Control" || e.key === "Shift")) {
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
        ".layer__dark .js-anim--chars"
      );
      const splitInstances: SplitType[] = [];

      charTargets.forEach((el, idx) => {
        const split = new SplitType(el as HTMLElement, { types: "chars" });
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
        ".layer__dark .js-anim--lines--sim"
      );
      const lineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const parent = entry.target.parentElement;
              const siblings =
                parent?.querySelectorAll(".js-anim--lines--sim") || [];
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
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );

      lineTargets.forEach((el) => lineObserver.observe(el));

      // ── Scroll Paragraph Mask ───────────────────────────
      const paragraphs = document.querySelectorAll(
        ".layer__dark .js-scroll-paragraph-mask"
      );
      paragraphs.forEach((p) => {
        const split = new SplitType(p as HTMLElement, { types: "words" });
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
        ".layer__dark [data-parallax-speed]"
      );
      floats.forEach((el) => {
        const speed = parseFloat(
          el.getAttribute("data-parallax-speed") || "0"
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
      const heroImageWrappers = document.querySelectorAll(".hero__image-wrapper");
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
        ".layer__dark .nav__link[href^='#']"
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
          ".layer__dark .project[data-tilt]"
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
    { dependencies: [] }
  );

  return (
    <>
      {/* ===== THREE.JS CANVAS ===== */}
      <FluidReveal ref={fluidRef} maskerRef={maskerRef} />

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
                REACT NATIVE&nbsp; •&nbsp; NEXT.JS&nbsp; •&nbsp; NODE.JS&nbsp;
                •&nbsp; DOCKER&nbsp; •&nbsp; POSTGRESQL&nbsp; •&nbsp;
                MONGODB&nbsp; •&nbsp; FIREBASE&nbsp; •&nbsp; EXPRESS&nbsp;
                •&nbsp; GSAP&nbsp; •&nbsp; THREE.JS&nbsp; •&nbsp;
                TURBOREPO&nbsp; •&nbsp; DRIZZLE ORM&nbsp; •&nbsp;
              </span>
              <span className="marquee__content" aria-hidden="true">
                REACT NATIVE&nbsp; •&nbsp; NEXT.JS&nbsp; •&nbsp; NODE.JS&nbsp;
                •&nbsp; DOCKER&nbsp; •&nbsp; POSTGRESQL&nbsp; •&nbsp;
                MONGODB&nbsp; •&nbsp; FIREBASE&nbsp; •&nbsp; EXPRESS&nbsp;
                •&nbsp; GSAP&nbsp; •&nbsp; THREE.JS&nbsp; •&nbsp;
                TURBOREPO&nbsp; •&nbsp; DRIZZLE ORM&nbsp; •&nbsp;
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
                CONSOLE.LOG&nbsp; •&nbsp; CHATGPT&nbsp; •&nbsp; NPM INSTALL
                --FORCE&nbsp;•&nbsp; GEMINI&nbsp; •&nbsp; GIT PUSH -F&nbsp;
                •&nbsp; CTRL+Z&nbsp;•&nbsp; CLAUDE&nbsp; •&nbsp; IT WORKS ON MY
                MACHINE&nbsp; •&nbsp; TODO: FIX LATER&nbsp; •&nbsp; MASS
                GOOGLE&nbsp; •&nbsp; MASS PRAY&nbsp; •&nbsp;
              </span>
              <span className="marquee__content">
                CONSOLE.LOG&nbsp; •&nbsp; CHATGPT&nbsp; •&nbsp; NPM INSTALL
                --FORCE&nbsp;•&nbsp; GEMINI&nbsp; •&nbsp; GIT PUSH -F&nbsp;
                •&nbsp; CTRL+Z&nbsp;•&nbsp; CLAUDE&nbsp; •&nbsp; IT WORKS ON MY
                MACHINE&nbsp; •&nbsp; TODO: FIX LATER&nbsp; •&nbsp; MASS
                GOOGLE&nbsp; •&nbsp; MASS PRAY&nbsp; •&nbsp;
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
              HOLD TO REVEAL • CTRL+SHIFT • HOLD TO REVEAL • CTRL+SHIFT •
            </textPath>
          </text>
        </svg>
        <span className="reveal-btn__icon">◉</span>
      </button>
    </>
  );
}
