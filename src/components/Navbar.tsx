import React, { useState, useEffect } from "react";

interface NavbarProps {
  layer: "dark" | "red";
}

export default function Navbar({ layer }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncState = () => {
      const hasClass = document.body.classList.contains("nav-open");
      setIsOpen(hasClass);
    };

    // Listen for custom toggle events to sync red/dark navbar instances
    window.addEventListener("nav-toggle", syncState);
    return () => window.removeEventListener("nav-toggle", syncState);
  }, []);

  const handleToggle = () => {
    if (document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
    } else {
      document.body.classList.add("nav-open");
    }
    window.dispatchEvent(new Event("nav-toggle"));
  };

  const handleLinkClick = () => {
    document.body.classList.remove("nav-open");
    window.dispatchEvent(new Event("nav-toggle"));
  };

  if (layer === "red") {
    return (
      <nav className="nav">
        <span className="nav__logo">ANIL.BUG</span>
        
        <button 
          className="nav__toggle" 
          onClick={handleToggle}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="nav__toggle-bar nav__toggle-bar--1" />
          <span className="nav__toggle-bar nav__toggle-bar--2" />
        </button>

        <div className="nav__links">
          <span className="nav__link" onClick={handleLinkClick}>Excuses</span>
          <span className="nav__link" onClick={handleLinkClick}>Chaos</span>
          <span className="nav__link" onClick={handleLinkClick}>Survived</span>
          <span className="nav__link" onClick={handleLinkClick}>Don&apos;t</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav" id="nav">
      <a href="#" className="nav__logo" onClick={handleLinkClick}>
        ANIL.DEV
      </a>

      <button 
        className="nav__toggle" 
        onClick={handleToggle}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="nav__toggle-bar nav__toggle-bar--1" />
        <span className="nav__toggle-bar nav__toggle-bar--2" />
      </button>

      <div className="nav__links">
        <a href="#about" className="nav__link" onClick={handleLinkClick}>
          About
        </a>
        <a href="#work" className="nav__link" onClick={handleLinkClick}>
          Work
        </a>
        <a href="#experience" className="nav__link" onClick={handleLinkClick}>
          Experience
        </a>
        <a href="#contact" className="nav__link" onClick={handleLinkClick}>
          Contact
        </a>
      </div>
    </nav>
  );
}
