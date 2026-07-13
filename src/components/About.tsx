import React from "react";
import { MouseAsset, CoffeeAsset } from "./SVGAssets";

interface AboutProps {
  layer: "dark" | "red";
}

export default function About({ layer }: AboutProps) {
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
            I&apos;m a student who spends 80% of my time reading CHATGPT and
            20% creating new bugs to debug later. My code works on my
            machine, and honestly, that&apos;s all that matters. I&apos;ve
            mass-produced more &apos;TODO: fix later&apos; comments than
            actual features. The minor in AI/ML just means I know how to call
            an API and pretend I understand transformers.
          </p>
          <div className="about__details">
            <div className="about__detail">
              <span className="about__detail-label">Location</span>
              <span className="about__detail-value">My Bed, Mostly</span>
            </div>
            <div className="about__detail">
              <span className="about__detail-label">Education</span>
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
          I&apos;m a full-stack and mobile developer pursuing B.Tech in
          Electrical Engineering with a minor in AI/ML at the National
          Institute of Technology, Delhi. I specialize in building
          scalable, containerized applications and multi-service
          architectures. From campus delivery platforms to competitive
          programming trackers, I transform complex problems into elegant,
          production-ready solutions that actually ship.
        </p>
        <div className="about__details">
          <div className="about__detail">
            <span className="about__detail-label">Location</span>
            <span className="about__detail-value">New Delhi, India</span>
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
      <MouseAsset speed={-0.15} />
      <CoffeeAsset speed={0.2} />
    </section>
  );
}
