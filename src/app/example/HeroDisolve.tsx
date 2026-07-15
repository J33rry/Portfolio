"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { vertexShader, fragmentShader } from "./shaders";
import styles from "./hero.module.css";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CONFIG = {
    color: "#ebf5df",
    spread: 0.5,
    speed: 2,
};

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
          }
        : { r: 0.89, g: 0.89, b: 0.89 };
}

interface HeroDissolveProps {
    children?: React.ReactNode;
    config?: {
        color?: string;
        spread?: number;
        speed?: number;
    };
}

export default function HeroDissolve({ children, config = {} }: HeroDissolveProps) {
    const wrapperRef = useRef(null); // tall spacer — defines scroll distance
    const heroRef = useRef(null); // sticky, viewport-height element (== ".hero" in the original)
    const canvasRef = useRef(null);

    useEffect(() => {
        const hero = heroRef.current;
        const canvas = canvasRef.current;
        if (!hero || !canvas) return;

        const settings = { ...CONFIG, ...config };

        // --- Lenis smooth scroll, synced with ScrollTrigger ---
        const lenis = new Lenis();
        let lenisRafId;
        function lenisRaf(time) {
            lenis.raf(time);
            ScrollTrigger.update();
            lenisRafId = requestAnimationFrame(lenisRaf);
        }
        lenisRafId = requestAnimationFrame(lenisRaf);
        lenis.on("scroll", ScrollTrigger.update);

        // --- Three.js setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: false,
        });

        const rgb = hexToRgb(settings.color);
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uProgress: { value: 0 },
                uResolution: {
                    value: new THREE.Vector2(
                        hero.offsetWidth,
                        hero.offsetHeight,
                    ),
                },
                uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
                uSpread: { value: settings.spread },
            },
            transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        function resize() {
            const width = hero.offsetWidth;
            const height = hero.offsetHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            material.uniforms.uResolution.value.set(width, height);
        }
        resize();
        window.addEventListener("resize", resize);

        let scrollProgress = 0;
        let animId;
        function animate() {
            material.uniforms.uProgress.value = scrollProgress;
            renderer.render(scene, camera);
            animId = requestAnimationFrame(animate);
        }
        animate();

        const handleScroll = ({ scroll }) => {
            const wrapper = wrapperRef.current;
            const wrapperTop = wrapper.offsetTop;
            const scrollableDistance =
                wrapper.offsetHeight - window.innerHeight;
            const localScroll = scroll - wrapperTop;
            scrollProgress = Math.min(
                Math.max(
                    (localScroll / scrollableDistance) * settings.speed,
                    0,
                ),
                1.1,
            );
        };
        lenis.on("scroll", handleScroll);

        // --- Cleanup: critical in React/Next since effects can re-run ---
        return () => {
            cancelAnimationFrame(lenisRafId);
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            lenis.off("scroll", handleScroll);
            lenis.off("scroll", ScrollTrigger.update);
            lenis.destroy();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [config]);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <section ref={heroRef} className={styles.hero}>
                <canvas ref={canvasRef} className={styles.canvas} />
                <div className={styles.content}>{children}</div>
            </section>
        </div>
    );
}
