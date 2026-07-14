// app/page.jsx (App Router example)
"use client";

import Image from "next/image";
import FluidStackReveal from "./FluidStackReveal";

function TopLayer() {
    return (
        <section className="hero">
            <div className="hero__noise" aria-hidden="true" />

            <div className="hero__decor" aria-hidden="true">
                <span className="hero__decor-coord hero__decor-coord--tl">
                    ERR:404
                </span>
                <span className="hero__decor-coord hero__decor-coord--br">
                    NaN° LOL
                </span>
                <div className="hero__decor-bracket hero__decor-bracket--tl" />
                <div className="hero__decor-bracket hero__decor-bracket--br" />
                <div className="hero__decor-circle hero__decor-circle--sm" />
                <div className="hero__decor-circle hero__decor-circle--lg" />
                <div className="hero__decor-line hero__decor-line--h" />
                <div className="hero__decor-line hero__decor-line--v" />
                <div className="hero__decor-dot hero__decor-dot--1" />
                <div className="hero__decor-dot hero__decor-dot--2" />
                <div className="hero__decor-dot hero__decor-dot--3" />
            </div>

            <div className="hero__inner">
                <div className="hero__content">
                    <h1 className="hero__title" aria-hidden="true">
                        <span className="hero__line">
                            <span className="hero__line-inner">Breaking</span>
                        </span>
                        <span className="hero__line">
                            <span className="hero__line-inner">
                                <span className="hero__line-accent">
                                    Production
                                </span>
                            </span>
                        </span>
                        <span className="hero__line">
                            <span className="hero__line-inner">Daily</span>
                        </span>
                    </h1>

                    <p className="hero__subtitle">
                        Hiding bugs since 2023. ChatGPT&apos;s most loyal
                        customer. Professional console.log() engineer and Stack
                        Overflow researcher.
                    </p>

                    <div className="hero__ctas">
                        <span className="hero__cta hero__cta--primary">
                            See Damage
                            <span className="hero__cta-arrow">→</span>
                        </span>
                        <span className="hero__cta hero__cta--secondary">
                            Don&apos;t Contact
                        </span>
                    </div>

                    <div className="hero__socials">
                        <span className="hero__social">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </span>
                        <span className="hero__social">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </span>
                        <span className="hero__social">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </span>
                        <span className="hero__social">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="2"
                                    y="4"
                                    width="20"
                                    height="16"
                                    rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </span>
                    </div>

                    <div className="hero__tech-stack">
                        <span className="hero__tech-pill">console.log</span>
                        <span className="hero__tech-pill">ChatGPT</span>
                        <span className="hero__tech-pill">Ctrl+Z</span>
                        <span className="hero__tech-pill">npm --force</span>
                        <span className="hero__tech-pill">git push -f</span>
                        <span className="hero__tech-pill">TODO: fix</span>
                        <span className="hero__tech-pill">Google</span>
                        <span className="hero__tech-pill">Pray</span>
                    </div>
                </div>

                <div className="hero__portrait-side">
                    <div className="hero__float-card hero__float-card--tl">
                        <span className="hero__float-number">∞</span>
                        <span className="hero__float-label">Bugs Created</span>
                    </div>
                    <div className="hero__float-card hero__float-card--tr hero__float-card--available">
                        <span
                            className="hero__available-dot"
                            style={{ background: "#ef4444" }}
                        />
                        <span className="hero__float-label">Do Not Hire</span>
                    </div>
                    <div className="hero__float-card hero__float-card--bl">
                        <span className="hero__float-number">0</span>
                        <span className="hero__float-label">Tests Written</span>
                    </div>
                    <div className="hero__float-card hero__float-card--br">
                        <span className="hero__float-number">99%</span>
                        <span className="hero__float-label">AI Generated</span>
                    </div>

                    <div className="hero__image-wrapper">
                        <svg
                            className="hero__geo-lines"
                            viewBox="0 0 500 600"
                            fill="none"
                            aria-hidden="true"
                        >
                            <line
                                x1="50"
                                y1="80"
                                x2="250"
                                y2="30"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.3"
                            />
                            <line
                                x1="250"
                                y1="30"
                                x2="450"
                                y2="120"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.25"
                            />
                            <line
                                x1="450"
                                y1="120"
                                x2="400"
                                y2="350"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.2"
                            />
                            <line
                                x1="400"
                                y1="350"
                                x2="480"
                                y2="500"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.15"
                            />
                            <line
                                x1="50"
                                y1="80"
                                x2="30"
                                y2="300"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.2"
                            />
                            <line
                                x1="30"
                                y1="300"
                                x2="100"
                                y2="520"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.15"
                            />
                            <line
                                x1="250"
                                y1="30"
                                x2="200"
                                y2="250"
                                stroke="var(--accent)"
                                strokeWidth="0.4"
                                opacity="0.12"
                            />
                            <line
                                x1="200"
                                y1="250"
                                x2="400"
                                y2="350"
                                stroke="var(--accent)"
                                strokeWidth="0.4"
                                opacity="0.1"
                            />
                            <line
                                x1="30"
                                y1="300"
                                x2="200"
                                y2="250"
                                stroke="var(--accent)"
                                strokeWidth="0.4"
                                opacity="0.08"
                            />
                            <circle
                                cx="50"
                                cy="80"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.5"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="250"
                                cy="30"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.4"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="450"
                                cy="120"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.4"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="400"
                                cy="350"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="480"
                                cy="500"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.3"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="30"
                                cy="300"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="100"
                                cy="520"
                                r="1.5"
                                fill="var(--accent)"
                                opacity="0.25"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="200"
                                cy="250"
                                r="1.5"
                                fill="var(--accent)"
                                opacity="0.25"
                                className="hero__geo-dot"
                            />
                        </svg>
                        <Image
                            src="/hidden.png"
                            alt="Cat — the real developer"
                            width={480}
                            height={580}
                            className="hero__image"
                        />
                    </div>
                </div>
            </div>

            <div className="hero__footer">
                <span className="hero__scroll-label">Scroll to regret</span>
                <div className="hero__scroll-line" />
            </div>
        </section>
    );
}

function BottomLayer() {
    return (
        <section className="hero" id="hero">
            <div className="hero__noise" aria-hidden="true" />

            <div className="hero__decor" aria-hidden="true">
                <span className="hero__decor-coord hero__decor-coord--tl">
                    28.6139° N
                </span>
                <span className="hero__decor-coord hero__decor-coord--br">
                    77.2090° E
                </span>
                <div className="hero__decor-bracket hero__decor-bracket--tl" />
                <div className="hero__decor-bracket hero__decor-bracket--br" />
                <div className="hero__decor-circle hero__decor-circle--sm" />
                <div className="hero__decor-circle hero__decor-circle--lg" />
                <div className="hero__decor-line hero__decor-line--h" />
                <div className="hero__decor-line hero__decor-line--v" />
                <div className="hero__decor-dot hero__decor-dot--1" />
                <div className="hero__decor-dot hero__decor-dot--2" />
                <div className="hero__decor-dot hero__decor-dot--3" />
            </div>

            <div className="hero__inner">
                <div className="hero__content">
                    <h1 className="hero__title js-cursor-extend">
                        <span className="hero__line">
                            <span className="hero__line-inner js-anim--chars">
                                Building
                            </span>
                        </span>
                        <span className="hero__line">
                            <span className="hero__line-inner js-anim--chars">
                                <span className="hero__line-accent">
                                    Digital
                                </span>
                            </span>
                        </span>
                        <span className="hero__line">
                            <span className="hero__line-inner js-anim--chars">
                                Experiences
                            </span>
                        </span>
                    </h1>

                    <p className="hero__subtitle js-anim--lines--sim">
                        I build scalable web and mobile applications,
                        high-performance backend systems, and delightful digital
                        experiences using modern technologies.
                    </p>

                    <div className="hero__ctas js-anim--lines--sim">
                        <a
                            href="#work"
                            className="hero__cta hero__cta--primary js-cursor-snap"
                        >
                            View Projects
                            <span className="hero__cta-arrow">→</span>
                        </a>
                        <a
                            href="#contact"
                            className="hero__cta hero__cta--secondary js-cursor-snap"
                        >
                            Get in Touch
                        </a>
                    </div>

                    <div className="hero__socials js-anim--lines--sim">
                        <a
                            href="https://github.com/J33rry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social js-cursor-snap"
                            aria-label="GitHub"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a
                            href="https://linkedin.com/in/j33rry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social js-cursor-snap"
                            aria-label="LinkedIn"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social js-cursor-snap"
                            aria-label="X (Twitter)"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a
                            href="mailto:anilm7017@gmail.com"
                            className="hero__social js-cursor-snap"
                            aria-label="Email"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="2"
                                    y="4"
                                    width="20"
                                    height="16"
                                    rx="2"
                                />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </a>
                    </div>

                    <div className="hero__tech-stack js-anim--lines--sim">
                        <span className="hero__tech-pill">React</span>
                        <span className="hero__tech-pill">Next.js</span>
                        <span className="hero__tech-pill">TypeScript</span>
                        <span className="hero__tech-pill">Node.js</span>
                        <span className="hero__tech-pill">PostgreSQL</span>
                        <span className="hero__tech-pill">Docker</span>
                        <span className="hero__tech-pill">React Native</span>
                        <span className="hero__tech-pill">GSAP</span>
                    </div>
                </div>

                <div className="hero__portrait-side">
                    <div
                        className="hero__float-card hero__float-card--tl"
                        data-parallax-speed="-0.08"
                    >
                        <span className="hero__float-number">3+</span>
                        <span className="hero__float-label">
                            Years Experience
                        </span>
                    </div>
                    <div
                        className="hero__float-card hero__float-card--tr hero__float-card--available"
                        data-parallax-speed="0.06"
                    >
                        <span className="hero__available-dot" />
                        <span className="hero__float-label">
                            Available for Work
                        </span>
                    </div>
                    <div
                        className="hero__float-card hero__float-card--bl"
                        data-parallax-speed="0.1"
                    >
                        <span className="hero__float-number">25+</span>
                        <span className="hero__float-label">Projects</span>
                    </div>
                    <div
                        className="hero__float-card hero__float-card--br"
                        data-parallax-speed="-0.05"
                    >
                        <span className="hero__float-number">∞</span>
                        <span className="hero__float-label">Open Source</span>
                    </div>

                    <div className="hero__image-wrapper">
                        <svg
                            className="hero__geo-lines"
                            viewBox="0 0 500 600"
                            fill="none"
                            aria-hidden="true"
                        >
                            <line
                                x1="50"
                                y1="80"
                                x2="250"
                                y2="30"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.2"
                            />
                            <line
                                x1="250"
                                y1="30"
                                x2="450"
                                y2="120"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.18"
                            />
                            <line
                                x1="450"
                                y1="120"
                                x2="400"
                                y2="350"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.15"
                            />
                            <line
                                x1="400"
                                y1="350"
                                x2="480"
                                y2="500"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.12"
                            />
                            <line
                                x1="50"
                                y1="80"
                                x2="30"
                                y2="300"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.15"
                            />
                            <line
                                x1="30"
                                y1="300"
                                x2="100"
                                y2="520"
                                stroke="var(--accent)"
                                strokeWidth="0.8"
                                opacity="0.1"
                            />
                            <line
                                x1="250"
                                y1="30"
                                x2="200"
                                y2="250"
                                stroke="var(--accent)"
                                strokeWidth="0.4"
                                opacity="0.1"
                            />
                            <line
                                x1="200"
                                y1="250"
                                x2="400"
                                y2="350"
                                stroke="var(--accent)"
                                strokeWidth="0.4"
                                opacity="0.08"
                            />
                            <line
                                x1="30"
                                y1="300"
                                x2="200"
                                y2="250"
                                stroke="var(--accent)"
                                strokeWidth="0.4"
                                opacity="0.06"
                            />
                            <circle
                                cx="50"
                                cy="80"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.4"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="250"
                                cy="30"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="450"
                                cy="120"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="400"
                                cy="350"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.3"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="480"
                                cy="500"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.25"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="30"
                                cy="300"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="100"
                                cy="520"
                                r="1.5"
                                fill="var(--accent)"
                                opacity="0.2"
                                className="hero__geo-dot"
                            />
                            <circle
                                cx="200"
                                cy="250"
                                r="1.5"
                                fill="var(--accent)"
                                opacity="0.2"
                                className="hero__geo-dot"
                            />
                        </svg>
                        <Image
                            src="/main.png"
                            alt="Anil Kumar Meena — low-poly portrait"
                            width={480}
                            height={580}
                            className="hero__image"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className="hero__footer js-anim--lines--sim">
                <span className="hero__scroll-label">Scroll to explore</span>
                <div className="hero__scroll-line" />
            </div>
        </section>
    );
}

export default function Page() {
    return (
        <main style={{ width: "100vw", height: "100vh" }}>
            <FluidStackReveal top={<TopLayer />} bottom={<BottomLayer />} />
        </main>
    );
}
