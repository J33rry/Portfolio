import React from "react";
import ProjectCard from "./ProjectCard";
import { KeyboardAsset } from "./SVGAssets";

interface ProjectsProps {
  layer: "dark" | "red";
}

export default function Projects({ layer }: ProjectsProps) {
  const projectsData =
    layer === "red"
      ? [
          {
            number: "01",
            title: "Justoo",
            type: "“Startup” Nobody Asked For",
            desc: "I was only a small part of a large team. They probably have no idea I exist. The “Gateway Pattern” is just a fancy way of saying one Express server pretending to be four. 90% of dev time was spent fixing CORS errors.",
            tags: ["CORS Errors", "npm install --force", "Prayer", "3 AM Commits"],
            github: "https://github.com/sh-projects-13/justoo",
          },
          {
            number: "02",
            title: "Cozer",
            type: "A Scraper That Breaks Weekly",
            desc: "Built a scraper that breaks every time LeetCode changes a single div class. The “production Docker deployment on Azure” runs on the free tier and crashes every 72 hours. I restart it manually on my phone.",
            tags: ["Duct Tape", "Free Tier", "Cron That Forgets", "Copium"],
            github: "https://github.com/J33rry/Cozer-Backend",
          },
          {
            number: "03",
            title: "Demon's Bar",
            type: "Chat App #4,729,581",
            desc: "Named it Demon's Bar because deploying it was actual hell. Real-time messaging works great unless more than 3 people join. The multi-theme feature was just me procrastinating on actual functionality.",
            tags: ["Tutorial Project", "Render Free Tier", "“It Works Locally”"],
            github: "https://github.com/J33rry/Demon-s-Bar",
          },
          {
            number: "04",
            title: "SecureVault",
            type: "Irony as a Service",
            desc: "A “secure” credential manager built by someone who uses the same password everywhere. I locked myself out of the Supabase dashboard twice. The 2FA emails sometimes go to spam. The irony writes itself.",
            tags: ["Trust Issues", "Password123", "Forgot My Own"],
            github: "https://github.com/J33rry/securevault",
          },
        ]
      : [
          {
            number: "01",
            title: "Justoo",
            type: "Campus Delivery Platform",
            desc: "Co-built an institute-wide delivery platform using Turborepo monorepo with a Gateway Pattern routing traffic across 4 independent microservice backends. Developed the React Native customer app and 4 Next.js role-based dashboards.",
            tags: ["React Native", "Next.js", "Express", "PostgreSQL"],
            github: "https://github.com/sh-projects-13/justoo",
          },
          {
            number: "02",
            title: "Cozer",
            type: "CP Stats Tracker",
            desc: "Cross-platform mobile app aggregating LeetCode & Codeforces stats, daily problems, and contest schedules into a unified dashboard. Production REST API with Firebase Auth, Docker containerization on Azure App Service.",
            tags: ["React Native", "Node.js", "Firebase", "Docker"],
            github: "https://github.com/J33rry/Cozer-Backend",
          },
          {
            number: "03",
            title: "Demon's Bar",
            type: "Real-Time Chat Application",
            desc: "Full-stack chat application with Socket.io WebSockets for bidirectional real-time messaging. JWT authentication, Cloudinary media uploads, and multi-theme UI switching with DaisyUI.",
            tags: ["MERN Stack", "Socket.io", "Cloudinary"],
            github: "https://github.com/J33rry/Demon-s-Bar",
          },
          {
            number: "04",
            title: "SecureVault",
            type: "Digital Credential Manager",
            desc: "Secure digital inheritance platform with Clerk authentication, email-based 2FA via Nodemailer, and an intuitive UI for managing sensitive credential lifecycles on Supabase.",
            tags: ["Next.js", "Supabase", "Clerk"],
            github: "https://github.com/J33rry/legacy-locker",
          },
        ];

  return (
    <section className="work" id="work">
      <span className="section__watermark" aria-hidden="true">
        {layer === "red" ? "DAMAGE" : "WORK"}
      </span>
      <div className="section__header">
        <span className={layer === "red" ? "section__label" : "section__label js-anim--lines--sim"}>
          {layer === "red" ? "02 / THE DAMAGE" : "02 / PROJECTS"}
        </span>
        <h2 className={layer === "red" ? "section__title" : "section__title js-anim--chars"}>
          {layer === "red" ? "Things I've Shipped (Somehow)" : "Selected Work"}
        </h2>
      </div>
      <div className="work__list">
        {projectsData.map((project) => (
          <ProjectCard
            key={project.number}
            number={project.number}
            title={project.title}
            type={project.type}
            desc={project.desc}
            tags={project.tags}
            github={project.github}
            layer={layer}
          />
        ))}
      </div>
      <KeyboardAsset speed={0.25} />
    </section>
  );
}
