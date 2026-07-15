import React from "react";
import Image from "next/image";

interface HeroProps {
    layer: "dark" | "red";
}

export default function Hero({ layer }: HeroProps) {
    if (layer === "red") {
        return (
            <section className="hero relative min-h-screen flex items-center px-[1.5rem] sm:px-[clamp(2rem,5vw,4rem)] z-[2]">
                <div className="hero__noise absolute inset-0 bg-[url('/noise.webp')] bg-[length:100px] opacity-[0.03] pointer-events-none z-0" aria-hidden="true" />

                <div className="hero__decor hidden md:block absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                    <span className="hero__decor-coord absolute text-[0.65rem] font-medium tracking-[0.2em] text-[var(--text-subtle)] [writing-mode:vertical-rl] top-[4rem] left-[2rem] rotate-180">
                        ERR:404
                    </span>
                    <span className="hero__decor-coord absolute text-[0.65rem] font-medium tracking-[0.2em] text-[var(--text-subtle)] [writing-mode:vertical-rl] bottom-[4rem] right-[2rem]">
                        NaN° LOL
                    </span>
                    <div className="hero__decor-bracket absolute w-[20px] h-[20px] border border-[var(--accent)] opacity-30 top-[3rem] left-[4rem] border-r-0 border-b-0" />
                    <div className="hero__decor-bracket absolute w-[20px] h-[20px] border border-[var(--accent)] opacity-30 bottom-[3rem] right-[4rem] border-l-0 border-t-0" />
                    <div className="hero__decor-circle absolute rounded-full border border-[var(--glass-border)] opacity-15 w-[100px] h-[100px] top-[8%] right-[20%] border-dashed animate-[spin_40s_linear_infinite]" />
                    <div className="hero__decor-circle absolute rounded-full border border-[var(--glass-border)] opacity-15 w-[250px] h-[250px] bottom-[-5%] right-[25%] animate-[spin_60s_linear_infinite_reverse]" />
                    <div className="hero__decor-line absolute bg-[var(--glass-border)] opacity-20 w-[120px] h-[1px] top-[40%] left-[2%]" />
                    <div className="hero__decor-line absolute bg-[var(--glass-border)] opacity-20 w-[1px] h-[80px] top-[25%] right-[5%]" />
                    <div className="hero__decor-dot absolute w-[3px] h-[3px] rounded-full bg-[var(--accent)] opacity-25 top-[20%] left-[50%]" />
                    <div className="hero__decor-dot absolute w-[3px] h-[3px] rounded-full bg-[var(--accent)] opacity-25 top-[65%] right-[10%]" />
                    <div className="hero__decor-dot absolute w-[3px] h-[3px] rounded-full bg-[var(--accent)] opacity-25 bottom-[30%] left-[45%]" />
                </div>

                <div className="hero__inner w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[3rem] lg:gap-16 items-center relative z-1">
                    <div className="hero__content flex flex-col gap-6 md:gap-8 z-1">
                        <h1 className="hero__title font-[family-name:var(--font-jaapokki-enchance),var(--font-outfit),sans-serif] text-[clamp(2.5rem,10vw,4rem)] md:text-[clamp(4rem,7vw,6.5rem)] leading-[0.9] text-[var(--text)] uppercase m-0 flex flex-col items-start" aria-hidden="true">
                            <span className="hero__line overflow-hidden inline-flex">
                                <span className="hero__line-inner inline-block relative">
                                    Breaking
                                </span>
                            </span>
                            <span className="hero__line overflow-hidden inline-flex">
                                <span className="hero__line-inner inline-block relative">
                                    <span className="hero__line-accent text-[var(--accent)]">
                                        Production
                                    </span>
                                </span>
                            </span>
                            <span className="hero__line overflow-hidden inline-flex">
                                <span className="hero__line-inner inline-block relative">Daily</span>
                            </span>
                        </h1>

                        <p className="hero__subtitle font-[family-name:var(--font-kirke),var(--font-inter),sans-serif] text-[1.1rem] leading-[1.6] text-[var(--text-subtle)] font-light max-w-full md:max-w-[480px] mt-4 md:mt-2">
                            Hiding bugs since 2023. ChatGPT&apos;s most loyal
                            customer. Professional console.log() engineer and
                            Stack Overflow researcher.
                        </p>

                        <div className="hero__ctas flex flex-wrap gap-4 mt-4 md:mt-6">
                            <span className="hero__cta hero__cta--primary inline-flex items-center gap-3 px-[2.2rem] py-[1.1rem] rounded-[100px] font-semibold text-[0.8rem] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 border bg-[var(--text)] text-[var(--bg)] border-transparent hover:bg-transparent hover:border-[var(--text)] hover:text-[var(--text)]">
                                See Damage
                                <span className="hero__cta-arrow transition-transform duration-300 group-hover/cta:translate-x-[4px]">→</span>
                            </span>
                            <span className="hero__cta hero__cta--secondary inline-flex items-center gap-3 px-[2.2rem] py-[1.1rem] rounded-[100px] font-semibold text-[0.8rem] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 border bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[rgba(255,255,255,0.03)]">
                                Don&apos;t Contact
                            </span>
                        </div>

                        <div className="hero__socials flex items-center gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[var(--border)]">
                            <span className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </span>
                            <span className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </span>
                            <span className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </span>
                            <span className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
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

                        {/* <div className="hero__tech-stack">
              <span className="hero__tech-pill">console.log</span>
              <span className="hero__tech-pill">ChatGPT</span>
              <span className="hero__tech-pill">Ctrl+Z</span>
              <span className="hero__tech-pill">npm --force</span>
              <span className="hero__tech-pill">git push -f</span>
              <span className="hero__tech-pill">TODO: fix</span>
              <span className="hero__tech-pill">Google</span>
              <span className="hero__tech-pill">Pray</span>
            </div> */}
                    </div>

                    <div className="hero__portrait-side relative w-full h-[500px] md:h-[600px] flex items-center justify-center min-h-[350px]">
                        <div className="hero__float-card hero__float-card--tl hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] top-[10%] left-[-10%]">
                            <span className="hero__float-number font-[family-name:var(--font-outfit),sans-serif] text-[1.8rem] font-bold leading-none text-[var(--text)]">∞</span>
                            <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">
                                Bugs Created
                            </span>
                        </div>
                        <div className="hero__float-card hero__float-card--tr hero__float-card--available hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] top-[20%] right-[-5%] border-[var(--border)] shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                            <span
                                className="hero__available-dot absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 -mt-1 -mr-1 animate-pulse"
                                style={{ background: "#ef4444" }}
                            />
                            <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">
                                Do Not Hire
                            </span>
                        </div>
                        <div className="hero__float-card hero__float-card--bl hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] bottom-[20%] left-[-5%]">
                            <span className="hero__float-number font-[family-name:var(--font-outfit),sans-serif] text-[1.8rem] font-bold leading-none text-[var(--text)]">0</span>
                            <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">
                                Tests Written
                            </span>
                        </div>
                        <div className="hero__float-card hero__float-card--br hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] bottom-[10%] right-[5%]">
                            <span className="hero__float-number font-[family-name:var(--font-outfit),sans-serif] text-[1.8rem] font-bold leading-none text-[var(--text)]">99%</span>
                            <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">
                                AI Generated
                            </span>
                        </div>

                        <div className="hero__image-wrapper relative w-[clamp(200px,50vw,300px)] md:w-[400px] lg:w-[480px] aspect-[4/5] z-1 before:content-[''] before:absolute before:inset-0 before:rounded-[20px] before:border-[2px] before:border-[var(--border)] before:-translate-x-[20px] before:translate-y-[20px] before:-z-1 before:transition-all before:duration-500 hover:before:translate-x-0 hover:before:translate-y-0 hover:before:border-[var(--accent)] layer__red:before:-translate-x-[40px] layer__red:before:translate-y-[40px] layer__red:before:border-[var(--accent)] layer__red:before:opacity-30">
                            <svg
                                className="hero__geo-lines absolute inset-[-20%] w-[140%] h-[140%] pointer-events-none -z-1 opacity-60"
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
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="250"
                                    cy="30"
                                    r="2.5"
                                    fill="var(--accent)"
                                    opacity="0.4"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="450"
                                    cy="120"
                                    r="2.5"
                                    fill="var(--accent)"
                                    opacity="0.4"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="400"
                                    cy="350"
                                    r="2"
                                    fill="var(--accent)"
                                    opacity="0.35"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="480"
                                    cy="500"
                                    r="2"
                                    fill="var(--accent)"
                                    opacity="0.3"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="30"
                                    cy="300"
                                    r="2"
                                    fill="var(--accent)"
                                    opacity="0.35"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="100"
                                    cy="520"
                                    r="1.5"
                                    fill="var(--accent)"
                                    opacity="0.25"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                                <circle
                                    cx="200"
                                    cy="250"
                                    r="1.5"
                                    fill="var(--accent)"
                                    opacity="0.25"
                                    className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                                />
                            </svg>
                            <Image
                                src="/hidden.png"
                                alt="Cat — the real developer"
                                width={480}
                                height={580}
                                className="hero__image w-full h-full object-cover rounded-[20px] grayscale contrast-120 filter transition-all duration-500 hover:grayscale-0 hover:contrast-100 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            />
                        </div>
                    </div>
                </div>

                <div className="hero__footer absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 z-1">
                    <span className="hero__scroll-label text-[0.65rem] font-medium tracking-[0.2em] uppercase text-[var(--text-subtle)]">Scroll to regret</span>
                    <div className="hero__scroll-line w-[1px] h-[40px] bg-gradient-to-b from-[var(--text-subtle)] to-transparent" />
                </div>
            </section>
        );
    }

    return (
        <section className="hero relative min-h-screen flex items-center px-[1.5rem] sm:px-[clamp(2rem,5vw,4rem)] z-[2]" id="hero">
            <div className="hero__noise absolute inset-0 bg-[url('/noise.webp')] bg-[length:100px] opacity-[0.03] pointer-events-none z-0" aria-hidden="true" />

            <div className="hero__decor hidden md:block absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                <span className="hero__decor-coord absolute text-[0.65rem] font-medium tracking-[0.2em] text-[var(--text-subtle)] [writing-mode:vertical-rl] top-[4rem] left-[2rem] rotate-180">
                    28.6139° N
                </span>
                <span className="hero__decor-coord absolute text-[0.65rem] font-medium tracking-[0.2em] text-[var(--text-subtle)] [writing-mode:vertical-rl] bottom-[4rem] right-[2rem]">
                    77.2090° E
                </span>
                <div className="hero__decor-bracket absolute w-[20px] h-[20px] border border-[var(--accent)] opacity-30 top-[3rem] left-[4rem] border-r-0 border-b-0" />
                <div className="hero__decor-bracket absolute w-[20px] h-[20px] border border-[var(--accent)] opacity-30 bottom-[3rem] right-[4rem] border-l-0 border-t-0" />
                <div className="hero__decor-circle absolute rounded-full border border-[var(--glass-border)] opacity-15 w-[100px] h-[100px] top-[8%] right-[20%] border-dashed animate-[spin_40s_linear_infinite]" />
                <div className="hero__decor-circle absolute rounded-full border border-[var(--glass-border)] opacity-15 w-[250px] h-[250px] bottom-[-5%] right-[25%] animate-[spin_60s_linear_infinite_reverse]" />
                <div className="hero__decor-line absolute bg-[var(--glass-border)] opacity-20 w-[120px] h-[1px] top-[40%] left-[2%]" />
                <div className="hero__decor-line absolute bg-[var(--glass-border)] opacity-20 w-[1px] h-[80px] top-[25%] right-[5%]" />
                <div className="hero__decor-dot absolute w-[3px] h-[3px] rounded-full bg-[var(--accent)] opacity-25 top-[20%] left-[50%]" />
                <div className="hero__decor-dot absolute w-[3px] h-[3px] rounded-full bg-[var(--accent)] opacity-25 top-[65%] right-[10%]" />
                <div className="hero__decor-dot absolute w-[3px] h-[3px] rounded-full bg-[var(--accent)] opacity-25 bottom-[30%] left-[45%]" />
            </div>

            <div className="hero__inner w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[3rem] lg:gap-16 items-center relative z-1">
                <div className="hero__content flex flex-col gap-6 md:gap-8 z-1">
                    <h1 className="hero__title font-[family-name:var(--font-jaapokki-enchance),var(--font-outfit),sans-serif] text-[clamp(2.5rem,10vw,4rem)] md:text-[clamp(4rem,7vw,6.5rem)] leading-[0.9] text-[var(--text)] uppercase m-0 flex flex-col items-start js-cursor-extend">
                        <span className="hero__line overflow-hidden inline-flex">
                            <span className="hero__line-inner inline-block relative js-anim--chars">
                                Building
                            </span>
                        </span>
                        <span className="hero__line overflow-hidden inline-flex">
                            <span className="hero__line-inner inline-block relative js-anim--chars">
                                <span className="hero__line-accent text-[var(--accent)]">
                                    Digital
                                </span>
                            </span>
                        </span>
                        <span className="hero__line overflow-hidden inline-flex">
                            <span className="hero__line-inner inline-block relative js-anim--chars">
                                Experiences
                            </span>
                        </span>
                    </h1>

                    <p className="hero__subtitle font-[family-name:var(--font-kirke),var(--font-inter),sans-serif] text-[1.1rem] leading-[1.6] text-[var(--text-subtle)] font-light max-w-full md:max-w-[480px] mt-4 md:mt-2 js-anim--lines--sim">
                        I build scalable web and mobile applications,
                        high-performance backend systems, and delightful digital
                        experiences using modern technologies.
                    </p>

                    <div className="hero__ctas flex flex-wrap gap-4 mt-4 md:mt-6 js-anim--lines--sim">
                        <a
                            href="#work"
                            className="hero__cta hero__cta--primary inline-flex items-center gap-3 px-[2.2rem] py-[1.1rem] rounded-[100px] font-semibold text-[0.8rem] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 border bg-[var(--text)] text-[var(--bg)] border-transparent hover:bg-transparent hover:border-[var(--text)] hover:text-[var(--text)] js-cursor-snap"
                        >
                            View Projects
                            <span className="hero__cta-arrow transition-transform duration-300 group-hover/cta:translate-x-[4px]">→</span>
                        </a>
                        <a
                            href="#contact"
                            className="hero__cta hero__cta--secondary inline-flex items-center gap-3 px-[2.2rem] py-[1.1rem] rounded-[100px] font-semibold text-[0.8rem] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 border bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] js-cursor-snap"
                        >
                            Get in Touch
                        </a>
                    </div>

                    <div className="hero__socials flex items-center gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[var(--border)] js-anim--lines--sim">
                        <a
                            href="https://github.com/J33rry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1 js-cursor-snap"
                            aria-label="GitHub"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a
                            href="https://linkedin.com/in/j33rry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1 js-cursor-snap"
                            aria-label="LinkedIn"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1 js-cursor-snap"
                            aria-label="X (Twitter)"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a
                            href="mailto:anilm7017@gmail.com"
                            className="hero__social flex items-center justify-center w-[45px] h-[45px] rounded-full border border-[var(--border)] text-[var(--text-subtle)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1 js-cursor-snap"
                            aria-label="Email"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] transition-transform duration-300 group-hover/social:scale-110">
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

                    {/* <div className="hero__tech-stack js-anim--lines--sim">
            <span className="hero__tech-pill">React</span>
            <span className="hero__tech-pill">Next.js</span>
            <span className="hero__tech-pill">TypeScript</span>
            <span className="hero__tech-pill">Node.js</span>
            <span className="hero__tech-pill">PostgreSQL</span>
            <span className="hero__tech-pill">Docker</span>
            <span className="hero__tech-pill">React Native</span>
            <span className="hero__tech-pill">GSAP</span>
          </div> */}
                </div>

                <div className="hero__portrait-side relative w-full h-[500px] md:h-[600px] flex items-center justify-center min-h-[350px]">
                    <div
                        className="hero__float-card hero__float-card--tl hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] top-[10%] left-[-10%]"
                        data-parallax-speed="-0.08"
                    >
                        <span className="hero__float-number font-[family-name:var(--font-outfit),sans-serif] text-[1.8rem] font-bold leading-none text-[var(--text)]">3+</span>
                        <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">
                            Years Experience
                        </span>
                    </div>
                    <div
                        className="hero__float-card hero__float-card--tr hero__float-card--available hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] top-[20%] right-[-5%] border-[var(--border)] shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                        data-parallax-speed="0.06"
                    >
                        <span className="hero__available-dot absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 -mt-1 -mr-1 animate-pulse" />
                        <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">
                            Available for Work
                        </span>
                    </div>
                    <div
                        className="hero__float-card hero__float-card--bl hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] bottom-[20%] left-[-5%]"
                        data-parallax-speed="0.1"
                    >
                        <span className="hero__float-number font-[family-name:var(--font-outfit),sans-serif] text-[1.8rem] font-bold leading-none text-[var(--text)]">25+</span>
                        <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">Projects</span>
                    </div>
                    <div
                        className="hero__float-card hero__float-card--br hidden md:flex absolute flex-col gap-1 p-[1.2rem] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-[12px] border border-[var(--glass-border)] z-2 transition-transform duration-500 hover:-translate-y-2 hover:border-[var(--accent)] bottom-[10%] right-[5%]"
                        data-parallax-speed="-0.05"
                    >
                        <span className="hero__float-number font-[family-name:var(--font-outfit),sans-serif] text-[1.8rem] font-bold leading-none text-[var(--text)]">∞</span>
                        <span className="hero__float-label text-[0.75rem] font-medium tracking-[0.05em] uppercase text-[var(--text-subtle)]">Open Source</span>
                    </div>

                    <div className="hero__image-wrapper relative w-[clamp(200px,50vw,300px)] md:w-[400px] lg:w-[480px] aspect-[4/5] z-1 before:content-[''] before:absolute before:inset-0 before:rounded-[20px] before:border-[2px] before:border-[var(--border)] before:-translate-x-[20px] before:translate-y-[20px] before:-z-1 before:transition-all before:duration-500 hover:before:translate-x-0 hover:before:translate-y-0 hover:before:border-[var(--accent)] layer__red:before:-translate-x-[40px] layer__red:before:translate-y-[40px] layer__red:before:border-[var(--accent)] layer__red:before:opacity-30">
                        <svg
                            className="hero__geo-lines absolute inset-[-20%] w-[140%] h-[140%] pointer-events-none -z-1 opacity-60"
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
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="250"
                                cy="30"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="450"
                                cy="120"
                                r="2.5"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="400"
                                cy="350"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.3"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="480"
                                cy="500"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.25"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="30"
                                cy="300"
                                r="2"
                                fill="var(--accent)"
                                opacity="0.35"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="100"
                                cy="520"
                                r="1.5"
                                fill="var(--accent)"
                                opacity="0.2"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <circle
                                cx="200"
                                cy="250"
                                r="1.5"
                                fill="var(--accent)"
                                opacity="0.2"
                                className="hero__geo-dot transition-all duration-300 odd:animate-[pulse_4s_ease-in-out_infinite] [&:nth-child(3)]:animate-[pulse_2s_ease-in-out_infinite]"
                            />
                        </svg>
                        <Image
                            src="/main.png"
                            alt="Anil Kumar Meena — low-poly portrait"
                            width={480}
                            height={580}
                            className="hero__image w-full h-full object-cover rounded-[20px] grayscale contrast-120 filter transition-all duration-500 hover:grayscale-0 hover:contrast-100 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                            priority
                        />
                    </div>
                </div>
            </div>

            <div className="hero__footer absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 z-1 js-anim--lines--sim">
                <span className="hero__scroll-label text-[0.65rem] font-medium tracking-[0.2em] uppercase text-[var(--text-subtle)]">Scroll to explore</span>
                <div className="hero__scroll-line w-[1px] h-[40px] bg-gradient-to-b from-[var(--text-subtle)] to-transparent" />
            </div>
        </section>
    );
}
