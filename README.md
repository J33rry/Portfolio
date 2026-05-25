# 🎭 Dual-Layer Interactive Portfolio

A highly interactive, visually striking portfolio website built with raw HTML, CSS, and vanilla JavaScript. This project features a unique **dual-layer architecture**: a polished, professional outer layer, and a satirical, "honest" inner red layer that users can reveal by exploring the site.

## ✨ Key Features

- **Dual-Layer Masking Effect**: A custom cursor acts as a spotlight, revealing a hidden red layer underneath the professional facade.
- **Magnetic Snapping Cursor**: The custom cursor intelligently morphs and snaps to interactive elements (buttons, nav links) creating a fluid, tactile user experience.
- **3D Parallax Elements**: Features custom floating SVG assets (coffee, keyboard, mouse, earphones) that tumble and rotate in 2.5D space based on scroll velocity.
- **Keyboard Shortcuts**: Users can instantly toggle the hidden truth layer by holding `Ctrl + Shift`.
- **Smooth Scrolling & Animations**: Powered by [Lenis](https://lenis.darkroom.engineering/) for buttery-smooth scrolling and [GSAP](https://gsap.com/) for complex, performant animations.

## 🚀 Getting Started

Since this is a fully static front-end project (no build tools required), running it locally is incredibly straightforward.

### Prerequisites

You just need a local web server to serve the HTML file (to avoid CORS issues with local assets or ES modules if you expand the project later). Node.js users can use `serve`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/J33rry/Portfolio.git
   cd Portfolio
   ```

2. **Serve the project:**
   If you have `npx` installed, simply run:
   ```bash
   npx serve .
   ```
   *Alternatively, you can use the Live Server extension in VS Code or Python's built-in http server (`python3 -m http.server`).*

3. **View the site:**
   Open your browser and navigate to `http://localhost:3000`.

## 🎮 Usage

- **Scroll** down to see the 3D parallax elements tumble as you move through sections.
- **Hover** over navigation links or the GitHub repository cards to see the magnetic cursor snap and highlight the text.
- **Reveal the Truth**: 
  - Click and hold the circular "Reveal Truth" button at the bottom right.
  - OR, hold **`Ctrl + Shift`** on your keyboard to instantly expand the mask and read the satirical version of the portfolio.

## 🛠 Tech Stack

- **HTML5 & CSS3**: Pure, semantic markup and modern CSS properties (including `@property` for mask radius animations).
- **Vanilla JavaScript**: Lightweight DOM manipulation and interaction logic.
- **[GSAP (GreenSock)](https://gsap.com/)**: Used for the animation ticker, lerping mouse coordinates, and scroll-triggered parallax effects.
- **[Lenis](https://lenis.darkroom.engineering/)**: Used for the smooth scroll hijacking and easing.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! If you want to add new 3D floating assets, tweak the physics, or improve the accessibility of the dual layers, feel free to dive in.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🆘 Support

If you encounter any issues while setting up or customizing the portfolio, feel free to open an issue on the GitHub repository.

---

> *Designed and barely built by Anil.*
