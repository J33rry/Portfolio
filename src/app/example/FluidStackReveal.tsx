"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
    vertexShader,
    fluidFragmentShader,
    maskFragmentShader,
} from "./shader";

/**
 * FluidStackReveal
 *
 * Stacks two real, interactive DOM layers on top of each other. A mouse/touch
 * trail (same fluid sim as the image version) punches a soft-edged hole
 * through the top layer as a CSS mask, revealing the bottom layer underneath.
 *
 * Both layers stay live DOM — buttons, videos, forms, hover states all keep
 * working. Because CSS masks only affect rendering (not hit-testing), the
 * top layer's wrapper is set to pointer-events: none, and only its actual
 * interactive elements opt back in with pointer-events: auto, so clicks pass
 * through the revealed "hole" to the bottom layer.
 *
 * <FluidStackReveal
 *   top={<TopComponent />}
 *   bottom={<BottomComponent />}
 * />
 *
 * Inside TopComponent, any element that should stay clickable needs:
 *   style={{ pointerEvents: "auto" }}   (or className="pointer-events-auto")
 */
interface FluidStackRevealProps {
    top: React.ReactNode;
    bottom: React.ReactNode;
    decay?: number;
    maskResolution?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function FluidStackReveal({
    top,
    bottom,
    decay = 0.97,
    maskResolution = 700, // longest side of the offscreen mask canvas, in px
    className,
    style,
}: FluidStackRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const topLayerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const topLayer = topLayerRef.current;
        if (!container || !topLayer) return;
        const containerEl = container;
        const topLayerEl = topLayer;

        let animationId: number;

        // Offscreen canvas used purely as a rendering surface for the mask.
        // It never gets appended to the DOM — WebGL doesn't require that.
        const maskCanvas = document.createElement("canvas");
        const renderer = new THREE.WebGLRenderer({
            canvas: maskCanvas,
            antialias: false,
            alpha: true,
            preserveDrawingBuffer: true, // required so toDataURL() sees the drawn frame
        });
        renderer.setPixelRatio(1);

        const getSize = () => ({
            width: containerEl.clientWidth || 1,
            height: containerEl.clientHeight || 1,
        });

        function computeMaskSize() {
            const { width, height } = getSize();
            const scale = maskResolution / Math.max(width, height);
            return {
                w: Math.max(1, Math.round(width * scale)),
                h: Math.max(1, Math.round(height * scale)),
            };
        }

        let { w: maskW, h: maskH } = computeMaskSize();
        maskCanvas.width = maskW;
        maskCanvas.height = maskH;
        renderer.setSize(maskW, maskH, false);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const mouse = new THREE.Vector2(0.5, 0.5);
        const prevMouse = new THREE.Vector2(0.5, 0.5);
        let isMoving = false;
        let lastMoveTime = 0;

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
                uMouse: { value: mouse },
                uPrevMouse: { value: prevMouse },
                uResolution: { value: new THREE.Vector2(maskW, maskH) },
                uDecay: { value: decay },
                uIsMoving: { value: false },
            },
            vertexShader,
            fragmentShader: fluidFragmentShader,
        });

        const maskMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uFluid: { value: null },
                uDpr: { value: window.devicePixelRatio || 1 },
            },
            vertexShader,
            fragmentShader: maskFragmentShader,
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

        function updatePointer(clientX: number, clientY: number) {
            const rect = containerEl.getBoundingClientRect();
            if (
                clientX >= rect.left &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom
            ) {
                prevMouse.copy(mouse);
                mouse.x = (clientX - rect.left) / rect.width;
                mouse.y = 1 - (clientY - rect.top) / rect.height;
                isMoving = true;
                lastMoveTime = performance.now();
            } else {
                isMoving = false;
            }
        }

        function onMouseMove(event: MouseEvent) {
            updatePointer(event.clientX, event.clientY);
        }

        function onTouchMove(event: TouchEvent) {
            if (event.touches.length > 0) {
                // Don't preventDefault here — the bottom layer may contain
                // scrollable or interactive content that needs normal touch behavior.
                updatePointer(
                    event.touches[0].clientX,
                    event.touches[0].clientY,
                );
            }
        }

        function onResize() {
            const next = computeMaskSize();
            maskW = next.w;
            maskH = next.h;
            maskCanvas.width = maskW;
            maskCanvas.height = maskH;
            renderer.setSize(maskW, maskH, false);
            trailsMaterial.uniforms.uResolution.value.set(maskW, maskH);
            pingPongTargets.forEach((t) => t.setSize(maskW, maskH));
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove, { passive: true });

        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(containerEl);

        function animate() {
            animationId = requestAnimationFrame(animate);

            if (isMoving && performance.now() - lastMoveTime > 50) {
                isMoving = false;
            }

            const prevTarget = pingPongTargets[currentTarget];
            currentTarget = (currentTarget + 1) % 2;
            const currentRenderTarget = pingPongTargets[currentTarget];

            trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;
            trailsMaterial.uniforms.uMouse.value.copy(mouse);
            trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
            trailsMaterial.uniforms.uIsMoving.value = isMoving;

            renderer.setRenderTarget(currentRenderTarget);
            renderer.render(simScene, camera);

            maskMaterial.uniforms.uFluid.value = currentRenderTarget.texture;

            renderer.setRenderTarget(null);
            renderer.render(scene, camera);

            // Hand the freshly-rendered frame to CSS as the top layer's mask.
            const dataUrl = maskCanvas.toDataURL("image/png");
            const maskValue = `url(${dataUrl})`;
            topLayerEl.style.maskImage = maskValue;
            topLayerEl.style.webkitMaskImage = maskValue;
        }

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            resizeObserver.disconnect();

            pingPongTargets.forEach((t) => t.dispose());
            trailsMaterial.dispose();
            maskMaterial.dispose();
            planeGeometry.dispose();
            renderer.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decay, maskResolution]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                ...style,
            }}
        >
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                {bottom}
            </div>

            <div
                ref={topLayerRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    maskSize: "100% 100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "100% 100%",
                    WebkitMaskRepeat: "no-repeat",
                }}
            >
                {top}
            </div>
        </div>
    );
}
