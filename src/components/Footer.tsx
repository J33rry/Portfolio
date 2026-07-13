import React from "react";

interface FooterProps {
  layer: "dark" | "red";
}

export default function Footer({ layer }: FooterProps) {
  if (layer === "red") {
    return (
      <footer className="footer">
        <span className="footer__copy">
          &copy; 2025 Anil Kumar Meena. No rights were observed.
        </span>
        <span className="footer__credit">Barely Built by Anil</span>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <span className="footer__copy">
        &copy; 2025 Anil Kumar Meena. All rights reserved.
      </span>
      <span className="footer__credit">Designed &amp; Built by Anil</span>
    </footer>
  );
}
