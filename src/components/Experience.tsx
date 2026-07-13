import React from "react";
import { EarphonesAsset } from "./SVGAssets";

interface ExperienceProps {
  layer: "dark" | "red";
}

export default function Experience({ layer }: ExperienceProps) {
  if (layer === "red") {
    return (
      <section className="experience">
        <div className="section__header">
          <span className="section__label">03 / SURVIVING</span>
          <h2 className="section__title">Places That Tolerate Me</h2>
        </div>
        <div className="experience__list">
          <div className="experience__item">
            <div className="experience__meta">
              <span className="experience__period">2025 – Present</span>
            </div>
            <div className="experience__info">
              <h3 className="experience__role">Professional Copy-Paster</h3>
              <span className="experience__company">
                Justoo &bull; Under Director, NIT Delhi
              </span>
              <p className="experience__desc">
                &ldquo;Leading development&rdquo; means I&apos;m the one who
                stays up at 3 AM fixing merge conflicts. The &ldquo;Gateway
                Pattern&rdquo; was born from not knowing how to deploy more
                than one server. Everything is held together by environment
                variables and hope.
              </p>
            </div>
          </div>
          <div className="experience__item">
            <div className="experience__meta">
              <span className="experience__period">2025 – Present</span>
            </div>
            <div className="experience__info">
              <h3 className="experience__role">Free Labor With a Title</h3>
              <span className="experience__company">
                UpVision Tech Club &bull; NIT Delhi
              </span>
              <p className="experience__desc">
                Organised a hackathon. My main contribution was ordering food
                and making sure the WiFi didn&apos;t die. I put
                &ldquo;Executive&rdquo; on my resume and nobody has questioned
                it yet. The 200+ participants had no idea who I was.
              </p>
            </div>
          </div>
        </div>
        <EarphonesAsset speed={-0.2} />
      </section>
    );
  }

  return (
    <section className="experience" id="experience">
      <div className="section__header">
        <span className="section__label js-anim--lines--sim">
          03 / EXPERIENCE
        </span>
        <h2 className="section__title js-anim--chars">Where I&apos;ve Worked</h2>
      </div>
      <div className="experience__list">
        <div className="experience__item js-anim--lines--sim">
          <div className="experience__meta">
            <span className="experience__period">2025 – Present</span>
          </div>
          <div className="experience__info">
            <h3 className="experience__role">Software Developer</h3>
            <span className="experience__company">
              Justoo &bull; Under Director, NIT Delhi
            </span>
            <p className="experience__desc">
              Co-teaming with a team of 4 in development of an institute-wide
              campus delivery platform. Architecting microservice Gateway
              Pattern with Express.js, built the React Native customer app and
              4 Next.js admin dashboards with JWT + httpOnly cookie auth.
            </p>
          </div>
        </div>
        <div className="experience__item js-anim--lines--sim">
          <div className="experience__meta">
            <span className="experience__period">2025 – Present</span>
          </div>
          <div className="experience__info">
            <h3 className="experience__role">Executive</h3>
            <span className="experience__company">
              UpVision Tech Club &bull; NIT Delhi
            </span>
            <p className="experience__desc">
              Organised HackIndia Spark 6 — a 24-hour hackathon — managing
              end-to-end logistics, participant coordination, judging panels,
              and on-ground execution for 200+ participants.
            </p>
          </div>
        </div>
      </div>
      <EarphonesAsset speed={-0.2} />
    </section>
  );
}
