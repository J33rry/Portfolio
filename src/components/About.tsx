import React from "react";
import { MouseAsset, CoffeeAsset } from "./SVGAssets";
import SkillsOrbit from "./SkillsOrbit";

interface AboutProps {
    layer: "dark" | "red";
}

interface SkillCategory {
    title: string;
    skills: string[];
}

const professionalCategories: SkillCategory[] = [
    {
        title: "Languages",
        skills: ["C++", "Python", "JavaScript (ES6+)", "SQL"],
    },
    {
        title: "Frontend",
        skills: [
            "React.js",
            "Next.js 15",
            "React Native (Expo)",
            "Tailwind CSS",
            "NativeWind",
            "GSAP",
        ],
    },
    {
        title: "Backend",
        skills: [
            "Node.js",
            "Express.js",
            "Socket.io",
            "Firebase Admin SDK",
            "Puppeteer",
            "Cheerio",
            "node-cron",
        ],
    },
    {
        title: "Databases",
        skills: ["MongoDB", "PostgreSQL", "Drizzle ORM", "Supabase", "NeonDB"],
    },
    {
        title: "Cloud & DevOps",
        skills: [
            "Docker",
            "Turborepo",
            "Azure App Service",
            "Vercel",
            "Render",
            "Firebase (Auth, FCM)",
            "Clerk",
            "Git/GitHub",
        ],
    },
    {
        title: "Concepts",
        skills: ["DSA", "DBMS", "OOP", "Computer Networks", "System Design"],
    },
];

const satiricalCategories: SkillCategory[] = [
    {
        title: "Languages",
        skills: [
            "Swearing at Compiler",
            "English (Barely)",
            "Copy-Paste (Advanced)",
            "HTML (as programming language)",
        ],
    },
    {
        title: "Frontend",
        skills: [
            "flex justify-center items-center",
            "resizing browser until it works",
            "ChatGPT frontend",
            "console.log",
        ],
    },
    {
        title: "Backend",
        skills: [
            "Express.js (without error handling)",
            "localhost:3000",
            "unhandledPromiseRejection",
            "Error 500",
        ],
    },
    {
        title: "Databases",
        skills: [
            "git commit as backup",
            "SELECT * FROM users",
            "123456 password hashes",
        ],
    },
    {
        title: "Cloud & DevOps",
        skills: [
            "git push",
            '"Works on my machine"',
            "free tiers only",
            "deploy on Friday night",
        ],
    },
    {
        title: "Concepts",
        skills: [
            "Stack Overflow",
            "Trial & Error",
            "Prayer-driven dev",
            '"It\'s a feature, not a bug"',
        ],
    },
];

export default function About({ layer }: AboutProps) {
    const techStackDark = [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "React Native",
        "GSAP",
    ];
    const techStackRed = [
        "console.log",
        "ChatGPT",
        "Ctrl+Z",
        "npm --force",
        "git push -f",
        "TODO: fix",
        "Google",
        "Pray",
    ];

    const separator = "  ✦  ";

    // Repeat to ensure marquee fills screen width
    const repeatedDark = [
        ...techStackDark,
        ...techStackDark,
        ...techStackDark,
        ...techStackDark,
    ];
    const repeatedRed = [
        ...techStackRed,
        ...techStackRed,
        ...techStackRed,
        ...techStackRed,
    ];

    const darkText = repeatedDark.join(separator) + separator;
    const redText = repeatedRed.join(separator) + separator;

    if (layer === "red") {
        return (
            <section className="about">
                <span className="section__watermark" aria-hidden="true">
                    TRUTH
                </span>
                <div className="section__header">
                    <span className="section__label">01 / THE TRUTH</span>
                    <h2 className="section__title">The Real Me</h2>
                </div>
                <div className="about__body">
                    <p className="about__text">
                        I&apos;m a student who spends 80% of my time reading
                        CHATGPT and 20% creating new bugs to debug later. My
                        code works on my machine, and honestly, that&apos;s all
                        that matters. I&apos;ve mass-produced more &apos;TODO:
                        fix later&apos; comments than actual features. The minor
                        in AI/ML just means I know how to call an API and
                        pretend I understand transformers.
                    </p>
                    <div className="about__details">
                        <div className="about__detail">
                            <span className="about__detail-label">
                                Location
                            </span>
                            <span className="about__detail-value">
                                My Bed, Mostly
                            </span>
                        </div>
                        <div className="about__detail">
                            <span className="about__detail-label">
                                Education
                            </span>
                            <span className="about__detail-value">
                                Still Figuring It Out
                            </span>
                        </div>
                        <div className="about__detail">
                            <span className="about__detail-label">Focus</span>
                            <span className="about__detail-value">
                                Stack Overflow Research
                            </span>
                        </div>
                    </div>
                </div>

                <div className="about__tech-stack">
                    <div className="about__tech-stack-header">
                        <h3 className="about__tech-stack-title">Tech Stack</h3>
                        <span className="about__tech-stack-subtitle">
                            Honest Stack
                        </span>
                    </div>
                    <SkillsOrbit layer="red" />

                    {/* Categorized Skills Grid */}
                    <div className="skills-grid">
                        {satiricalCategories.map((category) => (
                            <div
                                key={category.title}
                                className="skills-category"
                            >
                                <h4 className="skills-category__title">
                                    {category.title}
                                </h4>
                                <div className="skills-category__list">
                                    {category.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="skills-tag"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* <div className="marquee about__marquee">
                    <div className="marquee__track">
                        <span className="marquee__content">{redText}</span>
                        <span className="marquee__content">{redText}</span>
                    </div>
                </div> */}

                <MouseAsset speed={-0.15} />
                <CoffeeAsset speed={0.2} />
            </section>
        );
    }

    return (
        <section className="about" id="about">
            <span className="section__watermark" aria-hidden="true">
                ABOUT
            </span>
            <div className="section__header">
                <span className="section__label js-anim--lines--sim">
                    01 / ABOUT
                </span>
                <h2 className="section__title js-anim--chars">About Me</h2>
            </div>
            <div className="about__body">
                <p className="about__text js-scroll-paragraph-mask">
                    I&apos;m a full-stack and mobile developer pursuing B.Tech
                    in Electrical Engineering with a minor in AI/ML at the
                    National Institute of Technology, Delhi. I specialize in
                    building scalable, containerized applications and
                    multi-service architectures. From campus delivery platforms
                    to competitive programming trackers, I transform complex
                    problems into elegant, production-ready solutions that
                    actually ship.
                </p>
                <div className="about__details">
                    <div className="about__detail">
                        <span className="about__detail-label">Location</span>
                        <span className="about__detail-value">
                            New Delhi, India
                        </span>
                    </div>
                    <div className="about__detail">
                        <span className="about__detail-label">Education</span>
                        <span className="about__detail-value">
                            NIT Delhi, 2023 – 2027
                        </span>
                    </div>
                    <div className="about__detail">
                        <span className="about__detail-label">Focus</span>
                        <span className="about__detail-value">
                            Full-Stack &amp; Mobile
                        </span>
                    </div>
                </div>
            </div>

            <div className="about__tech-stack">
                <div className="about__tech-stack-header">
                    <h3 className="about__tech-stack-title">Tech Stack</h3>
                    <span className="about__tech-stack-subtitle">
                        Full-Stack &amp; Mobile
                    </span>
                </div>
                <SkillsOrbit layer="dark" />

                {/* Categorized Skills Grid */}
                <div className="skills-grid">
                    {professionalCategories.map((category) => (
                        <div key={category.title} className="skills-category">
                            <h4 className="skills-category__title">
                                {category.title}
                            </h4>
                            <div className="skills-category__list">
                                {category.skills.map((skill) => (
                                    <span key={skill} className="skills-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className="marquee about__marquee">
                <div className="marquee__track">
                    <span className="marquee__content">{darkText}</span>
                    <span className="marquee__content">{darkText}</span>
                </div>
            </div> */}

            <MouseAsset speed={-0.15} />
            <CoffeeAsset speed={0.2} />
        </section>
    );
}
