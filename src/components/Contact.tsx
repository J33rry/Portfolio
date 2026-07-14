import React from "react";

interface ContactProps {
  layer: "dark" | "red";
}

export default function Contact({ layer }: ContactProps) {
  if (layer === "red") {
    return (
      <section className="contact">
        <div className="section__header">
          <span className="section__label">05 / GOOD LUCK</span>
          <h2 className="section__title">Don&apos;t Contact Me</h2>
        </div>
        <div className="contact__body">
          <span className="contact__email">
            anilm7017@gmail.com (I probably won&apos;t reply)
          </span>
          <div className="contact__links">
            <span className="contact__link">GitHub (Empty green squares)</span>
            <span className="contact__link">LinkedIn (Last updated: never)</span>
            <span className="contact__link">Resume (It&apos;s already outdated)</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact" id="contact">
      <div className="section__header">
        <span className="section__label js-anim--lines--sim">
          05 / CONTACT
        </span>
        <h2 className="section__title js-anim--chars">Let&apos;s Connect</h2>
      </div>
      <div className="contact__body">
        <a
          href="mailto:anilm7017@gmail.com"
          className="contact__email js-anim--lines--sim"
        >
          anilm7017@gmail.com
        </a>
        <div className="contact__links">
          <a
            href="https://github.com/J33rry"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__link"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/j33rry"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__link"
          >
            LinkedIn
          </a>
          <a
            href="/Anil_SDE_Intern.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__link"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </section>
  );
}
