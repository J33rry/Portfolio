import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface SkillItem {
    name: string;
    label: string;
    icon: React.ReactNode;
}

interface SkillsOrbitProps {
    layer: "dark" | "red";
}

// Professional icons
const professionalSkills: SkillItem[] = [
    {
        name: "React",
        label: "React",
        icon: (
            <svg
                viewBox="-11.5 -10.2 23 20.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
            >
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                <circle r="2" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "NextJS",
        label: "Next.js",
        icon: (
            <svg viewBox="0 0 180 180" fill="none">
                <circle
                    cx="90"
                    cy="90"
                    r="85"
                    stroke="currentColor"
                    strokeWidth="8"
                />
                <path
                    d="M140 140L79.4 60H68v60h11.2V78.7L132.8 140H140z"
                    fill="currentColor"
                />
                <path d="M117 60h11v60h-11z" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "TypeScript",
        label: "TypeScript",
        icon: (
            <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
            >
                <rect x="5" y="5" width="90" height="90" rx="10" />
                <text
                    x="50"
                    y="72"
                    fill="currentColor"
                    fontSize="32"
                    fontWeight="bold"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="-1"
                >
                    TS
                </text>
            </svg>
        ),
    },
    {
        name: "NodeJS",
        label: "Node.js",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
    {
        name: "PostgreSQL",
        label: "PostgreSQL",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
            </svg>
        ),
    },
    {
        name: "Docker",
        label: "Docker",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <rect x="3" y="3" width="5" height="4" rx="1" />
                <rect x="9" y="3" width="5" height="4" rx="1" />
                <rect x="15" y="3" width="5" height="4" rx="1" />
                <rect x="3" y="9" width="5" height="4" rx="1" />
                <rect x="9" y="9" width="5" height="4" rx="1" />
                <rect x="15" y="9" width="5" height="4" rx="1" />
                <path d="M4 15h16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3z" />
            </svg>
        ),
    },
    {
        name: "ReactNative",
        label: "React Native",
        icon: (
            <svg
                viewBox="-11.5 -10.2 23 20.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
            >
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                <circle r="2" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "GSAP",
        label: "GSAP",
        icon: (
            <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
            >
                <circle cx="50" cy="50" r="40" />
                <text
                    x="50"
                    y="60"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="30"
                    fontWeight="bold"
                    fontFamily="system-ui, sans-serif"
                >
                    G
                </text>
            </svg>
        ),
    },
];

// Satirical icons
const satiricalSkills: SkillItem[] = [
    {
        name: "console.log",
        label: "console.log",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M6 8l3 3-3 3" />
                <path d="M11 14h6" />
                <path d="M2 17h20" />
            </svg>
        ),
    },
    {
        name: "ChatGPT",
        label: "ChatGPT",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="8" cy="16" r="1.5" fill="currentColor" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                <path d="M9 2v4M15 2v4" />
                <path d="M12 6v5" />
                <path d="M2 15h1M21 15h1" />
            </svg>
        ),
    },
    {
        name: "CtrlZ",
        label: "Ctrl+Z",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
        ),
    },
    {
        name: "npmForce",
        label: "npm --force",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <circle cx="11" cy="13" r="7" />
                <path d="M16 5l3-3" />
                <path d="M19 2a1 1 0 0 1 2 2" />
                <path d="M11 5V3" />
                <path d="M5 11H3" />
            </svg>
        ),
    },
    {
        name: "gitPushF",
        label: "git push -f",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M6 9v6" />
                <path d="M9 6h5a4 4 0 0 1 4 4v5" />
                <path d="M18 12v1" />
                <line x1="12" y1="11" x2="12" y2="16" strokeWidth="2" />
                <circle cx="12" cy="8" r="0.8" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "todoFix",
        label: "TODO: fix",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12l2 2 4-4" />
                <circle
                    cx="18"
                    cy="6"
                    r="2.5"
                    fill="currentColor"
                    stroke="none"
                />
                <text
                    x="18"
                    y="8"
                    fill="var(--bg, #fff)"
                    fontSize="6"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                >
                    !
                </text>
            </svg>
        ),
    },
    {
        name: "Google",
        label: "Google",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
                <text
                    x="11"
                    y="14"
                    fill="currentColor"
                    stroke="none"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="bold"
                >
                    G
                </text>
            </svg>
        ),
    },
    {
        name: "Pray",
        label: "Pray",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M10 20l2-8 2 8" />
                <path d="M6 16l4-4" />
                <path d="M18 16l-4-4" />
                <path d="M12 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                <path d="M12 8v4" />
            </svg>
        ),
    },
];

export default function SkillsOrbit({ layer }: SkillsOrbitProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const [radii, setRadii] = useState({ x: 260, y: 130 });
    const rotationObj = useRef({ value: 0 });
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const skills = layer === "red" ? satiricalSkills : professionalSkills;

    // Handle responsive resizing of the orbital radii
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setRadii({ x: 125, y: 65 });
            } else if (width < 768) {
                setRadii({ x: 185, y: 95 });
            } else if (width < 1024) {
                setRadii({ x: 230, y: 115 });
            } else {
                setRadii({ x: 275, y: 135 });
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Animate the rotation using GSAP
    useEffect(() => {
        const tween = gsap.to(rotationObj.current, {
            value: 360,
            duration: 25,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                const currentRot = rotationObj.current.value;
                itemsRef.current.forEach((item, index) => {
                    if (!item) return;

                    // Compute the orbital angle for this item
                    const baseAngle = (index / skills.length) * Math.PI * 2;
                    const angle = baseAngle + (currentRot * Math.PI) / 180;

                    // Ellipse coordinates
                    const x = Math.cos(angle) * radii.x;
                    const y = Math.sin(angle) * radii.y;

                    item.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

                    // Counter-rotate the icon container so the icon remains upright
                    const iconWrapper = item.querySelector(
                        ".skills-orbit__icon-wrapper",
                    ) as HTMLElement;
                    if (iconWrapper) {
                        iconWrapper.style.transform = `rotate(${-currentRot}deg)`;
                    }

                    // Dynamically align the label based on its current position on the ellipse
                    // We flip label side when it's on the left side of the ellipse
                    const isLeft = Math.cos(angle) < -0.15;
                    const label = item.querySelector(
                        ".skills-orbit__label-wrapper",
                    ) as HTMLElement;
                    if (label) {
                        if (isLeft) {
                            label.style.order = "-1";
                            label.style.marginRight = "10px";
                            label.style.marginLeft = "0";
                        } else {
                            label.style.order = "1";
                            label.style.marginLeft = "10px";
                            label.style.marginRight = "0";
                        }
                    }
                });
            },
        });

        tweenRef.current = tween;

        return () => {
            tween.kill();
        };
    }, [skills.length, radii.x, radii.y]);

    const inlineStyles = {
        "--radius-x": `${radii.x}px`,
        "--radius-y": `${radii.y}px`,
    } as React.CSSProperties;

    return (
        <div
            ref={containerRef}
            className="skills-orbit__wrapper"
            style={inlineStyles}
        >
            {/* Center Hub */}
            <div className="skills-orbit__hub">
                <span className="skills-orbit__hub-icon">&lt;/&gt;</span>
            </div>

            {/* Orbit Paths */}
            <div className="skills-orbit__line skills-orbit__line--inner" />
            <div className="skills-orbit__line skills-orbit__line--middle" />
            <div className="skills-orbit__line skills-orbit__line--outer" />

            {/* Orbiting Tech Items */}
            {skills.map((skill, index) => (
                <div
                    key={skill.name}
                    ref={(el) => {
                        if (el) itemsRef.current[index] = el;
                    }}
                    className="skills-orbit__item"
                >
                    <div className="skills-orbit__icon-wrapper">
                        {skill.icon}
                    </div>
                    <div className="skills-orbit__label-wrapper">
                        <span className="skills-orbit__label">
                            {skill.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
