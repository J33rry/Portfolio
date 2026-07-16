import React from "react";

interface ContactProps {
    layer: "dark" | "red";
}

export default function Contact({ layer }: ContactProps) {
    if (layer === "red") {
        return (
            <section className="contact">
                <div className="section__header">
                    <span className="section__label">04 / GOOD LUCK</span>
                    <h2 className="section__title">Don&apos;t Contact Me</h2>
                </div>
                <div className="contact__body">
                    <a
                        href="mailto:anilm7017@gmail.com"
                        className="contact__email js-cursor-snap js-anim--lines--sim"
                    >
                        anilm7017@gmail.com (I probably won&apos;t reply)
                    </a>
                    <div className="contact__links">
                        <a
                            href="https://github.com/J33rry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact__link js-cursor-snap"
                        >
                            GitHub (Empty green squares)
                        </a>
                        <a
                            href="https://linkedin.com/in/j33rry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact__link js-cursor-snap"
                        >
                            LinkedIn (Last updated: never)
                        </a>
                        <a
                            href="/Anil_SDE_Intern.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact__link js-cursor-snap"
                        >
                            Resume (It&apos;s already outdated)
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="contact" id="contact">
            <div className="section__header">
                <span className="section__label js-anim--lines--sim">
                    04 / CONTACT
                </span>
                <h2 className="section__title js-anim--chars">
                    Let&apos;s Connect
                </h2>
            </div>
            <div className="contact__body">
                <a
                    href="mailto:anilm7017@gmail.com"
                    className="contact__email js-cursor-snap js-anim--lines--sim"
                >
                    anilm7017@gmail.com
                </a>
                <div className="contact__links">
                    <a
                        href="https://github.com/J33rry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact__link js-cursor-snap"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com/in/j33rry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact__link js-cursor-snap"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="/Anil_SDE_Intern.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact__link js-cursor-snap"
                    >
                        Resume ↗
                    </a>
                </div>
            </div>
        </section>
    );
}
