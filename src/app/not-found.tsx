"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PROF_EXCUSES = [
    "Checking server logs...",
    "Re-indexing local paths...",
    "Retrying connection...",
    "Resolving hostname...",
    "Scanning project files..."
];

const BUG_EXCUSES = [
    "Works on my machine 🤷‍♂️",
    "It's not a bug, it's an undocumented route",
    "Blame the intern (me)",
    "Deployed on Friday, what did you expect?",
    "ChatGPT wrote this path",
    "StackOverflow post was outdated"
];

function ScrambleText({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState(text);
    const chars = "X01_-<>[]/\\{}%@#$&*+";

    useEffect(() => {
        let frame = 0;
        let intervalId: any;
        const targetText = text;
        const duration = 12;

        intervalId = setInterval(() => {
            frame++;
            if (frame >= duration) {
                setDisplayText(targetText);
                clearInterval(intervalId);
                return;
            }

            const progress = frame / duration;
            const scrambled = targetText
                .split("")
                .map((char, index) => {
                    if (char === " " || char === "." || char === "°" || char === "/" || char === "→") return char;
                    if (index < targetText.length * progress) {
                        return targetText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            setDisplayText(scrambled);
        }, 30);

        return () => clearInterval(intervalId);
    }, [text]);

    return <span>{displayText}</span>;
}

export default function NotFound() {
    const [path, setPath] = useState("/this-page");
    const [isBugMode, setIsBugMode] = useState(false);
    const [excuse, setExcuse] = useState("");
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get current client-side route pathname
    useEffect(() => {
        if (typeof window !== "undefined") {
            setPath(window.location.pathname);
            setIsTouchDevice(
                "ontouchstart" in window || navigator.maxTouchPoints > 0
            );
        }
    }, []);

    // Cycling Excuses
    useEffect(() => {
        const excuses = isBugMode ? BUG_EXCUSES : PROF_EXCUSES;
        let index = 0;
        setExcuse(excuses[0]);

        const interval = setInterval(() => {
            index = (index + 1) % excuses.length;
            setExcuse(excuses[index]);
        }, 2200);

        return () => clearInterval(interval);
    }, [isBugMode]);

    // GSAP Sequenced Entrance Animations
    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.2 });
        
        tl.to(".notfound-numeral", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
        })
        .to(".notfound-status-log", {
            opacity: 0.85,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        }, "-=0.5")
        .to(".notfound-headline-wrap", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        }, "-=0.4")
        .to(".notfound-desc", {
            opacity: 0.7,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        }, "-=0.4")
        .to(".notfound-ctas", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        }, "-=0.4")
        .to(".notfound-excuse-wrap", {
            opacity: 0.6,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
        }, "-=0.3");
    }, { dependencies: [] });

    // Custom cursor movement & hover effects
    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor || isTouchDevice) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        };

        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, [isTouchDevice]);

    // Cursor hover expansion handlers
    const handleMouseEnterCTA = () => {
        if (cursorRef.current) {
            cursorRef.current.classList.add("is-extended");
        }
    };

    const handleMouseLeaveCTA = () => {
        if (cursorRef.current) {
            cursorRef.current.classList.remove("is-extended");
        }
    };

    // Hold gesture trigger helper
    const startReveal = () => {
        setIsBugMode(true);
    };

    const stopReveal = () => {
        setIsBugMode(false);
    };

    // Keyboard Ctrl + Shift check
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
                if (e.key === "Control" || e.key === "Shift") {
                    e.preventDefault();
                    startReveal();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.ctrlKey || !e.shiftKey) {
                stopReveal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`notfound-container ${isBugMode ? "is-bug-mode" : ""}`}
            onMouseDown={startReveal}
            onMouseUp={stopReveal}
            onMouseLeave={stopReveal}
            onTouchStart={(e) => {
                e.preventDefault();
                startReveal();
            }}
            onTouchEnd={(e) => {
                e.preventDefault();
                stopReveal();
            }}
            onTouchCancel={stopReveal}
        >
            {/* Custom cursor overlay */}
            {!isTouchDevice && (
                <div className="cursor opacity-1 pointer-events-none" ref={cursorRef} />
            )}

            <div className="notfound-grid" />

            <div className="notfound-coords">
                <ScrambleText text={isBugMode ? "127.0001° N 0080.0000° E" : "28.6139° N 77.2090° E"} />
            </div>

            <div className="notfound-content">
                <div className="notfound-numeral">
                    <ScrambleText text={isBugMode ? "ERR" : "404"} />
                </div>

                <div className="notfound-status-log">
                    <ScrambleText text={`GET ${path} → 404 Not Found`} />
                </div>

                <div className="notfound-headline-wrap">
                    <h1 className="notfound-headline">
                        <ScrambleText text={isBugMode ? "ExceptionThrown" : "RouteNotResolved"} />
                    </h1>
                </div>

                <p className="notfound-desc">
                    {isBugMode 
                        ? "404: this page ghosted you harder than my last PR review." 
                        : "The page you are looking for has been moved or doesn't exist."
                    }
                </p>

                <div className="notfound-ctas">
                    <Link 
                        href="/" 
                        className="notfound-cta notfound-cta--primary"
                        onMouseEnter={handleMouseEnterCTA}
                        onMouseLeave={handleMouseLeaveCTA}
                    >
                        {isBugMode ? "Go back home (coward)" : "Back to Safety"}
                        <span className="notfound-cta-arrow">→</span>
                    </Link>
                    <Link 
                        href="/#work" 
                        className="notfound-cta notfound-cta--secondary"
                        onMouseEnter={handleMouseEnterCTA}
                        onMouseLeave={handleMouseLeaveCTA}
                    >
                        {isBugMode ? "Browse bugs" : "View Projects"}
                    </Link>
                </div>

                <div className="notfound-excuse-wrap">
                    <div className="notfound-excuse">
                        {excuse}
                    </div>
                </div>
            </div>
        </div>
    );
}
