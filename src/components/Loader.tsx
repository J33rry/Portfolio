import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface LoaderProps {
    onComplete: () => void;
}

const PROF_MESSAGES = [
    "Initializing developer environment...",
    "Compiling experience...",
    "Resolving dependencies...",
    "Optimizing performance...",
    "Establishing secure connection...",
    "Rendering portfolio layers...",
    "Fetching assets..."
];

const BUG_MESSAGES = [
    "Injecting undocumented bugs...",
    "Corrupting local storage...",
    "Deleting prod database...",
    "Ignoring ESLint warnings...",
    "Fixing bugs from 2023...",
    "Copy-pasting from StackOverflow...",
    "Locating missing semicolons...",
    "Running without tests...",
    "Ignoring team feedback..."
];

function ScrambleText({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState(text);
    const chars = "X01_-<>[]/\\{}%@#$&*+";

    useEffect(() => {
        let frame = 0;
        let intervalId: any;
        const targetText = text;
        const duration = 12; // Scramble duration in frames

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
                    if (char === " " || char === "." || char === "°") return char;
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

export default function Loader({ onComplete }: LoaderProps) {
    const [progress, setProgress] = useState(0);
    const [isBugMode, setIsBugMode] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Message rotation
    useEffect(() => {
        const messages = isBugMode ? BUG_MESSAGES : PROF_MESSAGES;
        let index = 0;
        setStatusMsg(messages[0]);

        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setStatusMsg(messages[index]);
        }, 800);

        return () => clearInterval(interval);
    }, [isBugMode]);

    // Progress counter (organic feel)
    useEffect(() => {
        let currentProgress = 0;
        let intervalId: NodeJS.Timeout;

        const updateProgress = () => {
            let increment = Math.random() * 3 + 1; // Random increment 1-4%
            
            // Slow down progress near the end to simulate compilation work
            if (currentProgress > 75 && currentProgress < 93) {
                increment = Math.random() * 1.2 + 0.3;
            } else if (currentProgress >= 93) {
                increment = 1.0;
            }

            currentProgress = Math.min(100, currentProgress + increment);
            setProgress(Math.round(currentProgress));

            if (currentProgress >= 100) {
                clearInterval(intervalId);
                
                // Keep the loader full for 300ms before fading out
                setTimeout(() => {
                    handleExit();
                }, 300);
            }
        };

        intervalId = setInterval(updateProgress, 50);

        return () => clearInterval(intervalId);
    }, []);

    const handleExit = () => {
        if (!containerRef.current) return;
        
        // Remove scroll-block from body
        document.body.style.overflow = "";

        gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.45,
            ease: "power2.inOut",
            onComplete: () => {
                onComplete();
                // Dispatch global event for hero slide-up text animation and Lenis scroll
                window.dispatchEvent(new Event("loader-complete"));
            }
        });
    };

    // Hold gesture trigger helpers
    const startReveal = () => {
        setIsBugMode(true);
    };

    const stopReveal = () => {
        setIsBugMode(false);
    };

    useEffect(() => {
        // Keyboard Ctrl + Shift
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

        // Block main page scrolling
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`loader-overlay ${isBugMode ? "is-bug-mode" : ""}`}
            onMouseDown={startReveal}
            onMouseUp={stopReveal}
            onMouseLeave={stopReveal}
            onTouchStart={(e) => {
                // Prevent browser zoom or defaults on double tap
                e.preventDefault();
                startReveal();
            }}
            onTouchEnd={(e) => {
                e.preventDefault();
                stopReveal();
            }}
            onTouchCancel={stopReveal}
        >
            <div className="loader-grid" />
            
            <div className="loader-coords">
                <ScrambleText text={isBugMode ? "127.0001° N 0080.0000° E" : "28.6139° N 77.2090° E"} />
            </div>

            <div className="loader-content">
                <div className="loader-logo">
                    <ScrambleText text={isBugMode ? "ANIL.BUG" : "ANIL.DEV"} />
                </div>

                <div className="loader-progress-wrapper">
                    <div className="loader-progress-track">
                        <div
                            className="loader-progress-bar"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="loader-stats">
                        <span>Status</span>
                        <span className="loader-percentage">{progress}%</span>
                    </div>
                </div>

                <div className="loader-status">
                    {statusMsg}
                </div>
            </div>

            <div className="loader-hint">
                Hold to reveal details
            </div>
        </div>
    );
}
