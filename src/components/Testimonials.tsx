import React from "react";

interface TestimonialsProps {
  layer: "dark" | "red";
}

export default function Testimonials({ layer }: TestimonialsProps) {
  if (layer === "red") {
    return (
      <section className="testimonials">
        <div className="section__header">
          <span className="section__label">04 / BRUTAL HONESTY</span>
          <h2 className="section__title">What They Actually Think</h2>
        </div>
        <div className="testimonials__grid">
          <blockquote className="testimonial">
            <p className="testimonial__text">
              &ldquo;He writes code at 3 AM and calls it &apos;passion&apos;. We
              call it poor time management. His Git history is a crime scene.&rdquo;
            </p>
            <cite className="testimonial__cite">— His Sleep Schedule</cite>
          </blockquote>
          <blockquote className="testimonial">
            <p className="testimonial__text">
              &ldquo;I&apos;ve never seen someone Google error messages so
              efficiently. Copy-paste speed is genuinely world-class. Truly
              inspiring.&rdquo;
            </p>
            <cite className="testimonial__cite">— Stack Overflow</cite>
          </blockquote>
          <blockquote className="testimonial">
            <p className="testimonial__text">
              &ldquo;90% chance he doesn&apos;t pick up the phone. 100% chance
              he saw your message. Will reply &apos;sorry, was busy&apos; three
              days later.&rdquo;
            </p>
            <cite className="testimonial__cite">— His Phone</cite>
          </blockquote>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="section__header">
        <span className="section__label js-anim--lines--sim">
          04 / KIND WORDS
        </span>
        <h2 className="section__title js-anim--chars">What People Say</h2>
      </div>
      <div className="testimonials__grid">
        <blockquote className="testimonial js-anim--lines--sim">
          <p className="testimonial__text">
            &ldquo;Anil consistently delivers clean, well-structured code. His
            attention to detail is remarkable.&rdquo;
          </p>
          <cite className="testimonial__cite">— Developer, Justoo</cite>
        </blockquote>
        <blockquote className="testimonial js-anim--lines--sim">
          <p className="testimonial__text">
            &ldquo;His ability to architect complex multi-service systems is
            impressive. A real genuine problem solver.&rdquo;
          </p>
          <cite className="testimonial__cite">— Developer, Justoo</cite>
        </blockquote>
        <blockquote className="testimonial js-anim--lines--sim">
          <p className="testimonial__text">
            &ldquo;A reliable team player who never says no to a challenge. Anil
            is seriously the best and he never complains.&rdquo;
          </p>
          <cite className="testimonial__cite">— Member, UpVision</cite>
        </blockquote>
      </div>
    </section>
  );
}
