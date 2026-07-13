import React from "react";

interface StatsProps {
  layer: "dark" | "red";
}

export default function Stats({ layer }: StatsProps) {
  if (layer === "red") {
    return (
      <section className="stats">
        <div className="stats__grid">
          <div className="stat">
            <span className="stat__number">170+</span>
            <span className="stat__label">Problems, Mostly Easy</span>
          </div>
          <div className="stat">
            <span className="stat__number">4</span>
            <span className="stat__label">Services That Barely Talk</span>
          </div>
          <div className="stat">
            <span className="stat__number">5+</span>
            <span className="stat__label">Apps On Free Tier</span>
          </div>
          <div className="stat">
            <span className="stat__number">∞</span>
            <span className="stat__label">Hours Debugging</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stats" id="stats">
      <div className="stats__grid">
        <div className="stat js-anim--lines--sim">
          <span className="stat__number">170+</span>
          <span className="stat__label">LeetCode Problems</span>
        </div>
        <div className="stat js-anim--lines--sim">
          <span className="stat__number">4</span>
          <span className="stat__label">Microservices Built</span>
        </div>
        <div className="stat js-anim--lines--sim">
          <span className="stat__number">5+</span>
          <span className="stat__label">Production Apps</span>
        </div>
        <div className="stat js-anim--lines--sim">
          <span className="stat__number">∞</span>
          <span className="stat__label">Cups of Coffee</span>
        </div>
      </div>
    </section>
  );
}
