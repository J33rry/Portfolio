/* ============================================================
   ANIL.DEV PORTFOLIO — THREE-SCENE.JS
   3D wireframe planets + particle field
   ============================================================ */

import * as THREE from 'three';

(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // ── Renderer ──────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Scene & Camera ────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 8;

  // ── Colors (match dark layer palette) ─────────────────
  const beige  = new THREE.Color('#c9b99a');
  const cream  = new THREE.Color('#e8e0d0');
  const subtle = new THREE.Color('#3a3830');

  // ── Wireframe Planet 1 (large, right side) ────────────
  const geo1 = new THREE.IcosahedronGeometry(2.5, 1);
  const mat1 = new THREE.MeshBasicMaterial({
    color: beige,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const planet1 = new THREE.Mesh(geo1, mat1);
  planet1.position.set(5, 1.5, -4);
  scene.add(planet1);

  // ── Wireframe Planet 2 (smaller, left side) ───────────
  const geo2 = new THREE.IcosahedronGeometry(1.8, 2);
  const mat2 = new THREE.MeshBasicMaterial({
    color: cream,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });
  const planet2 = new THREE.Mesh(geo2, mat2);
  planet2.position.set(-6, -3, -7);
  scene.add(planet2);

  // ── Wireframe Ring (around planet 1) ──────────────────
  const ringGeo = new THREE.TorusGeometry(3.8, 0.02, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: beige,
    transparent: true,
    opacity: 0.08,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(planet1.position);
  ring.rotation.x = Math.PI * 0.45;
  ring.rotation.z = Math.PI * 0.1;
  scene.add(ring);

  // ── Particle Field ────────────────────────────────────
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    sizes[i] = Math.random() * 1.5 + 0.5;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    size: 0.03,
    color: cream,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Mouse & Scroll Tracking ───────────────────────────
  let mouseNX = 0, mouseNY = 0; // normalized -1 to 1
  let scrollProgress = 0;

  window.addEventListener('mousemove', (e) => {
    mouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });

  // ── Smooth camera targets ─────────────────────────────
  let camTargetX = 0, camTargetY = 0;

  // ── Animation Loop ────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // Rotate planets
    planet1.rotation.x = time * 0.08;
    planet1.rotation.y = time * 0.12;

    planet2.rotation.x = -time * 0.1;
    planet2.rotation.y = time * 0.06;

    // Rotate ring
    ring.rotation.z = Math.PI * 0.1 + time * 0.03;

    // Drift particles
    particles.rotation.y = time * 0.015;
    particles.rotation.x = Math.sin(time * 0.05) * 0.02;

    // Camera parallax (mouse + scroll)
    camTargetX = mouseNX * 0.4;
    camTargetY = -mouseNY * 0.3 - scrollProgress * 3;

    camera.position.x += (camTargetX - camera.position.x) * 0.04;
    camera.position.y += (camTargetY - camera.position.y) * 0.04;
    camera.lookAt(0, -scrollProgress * 1.5, 0);

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize Handling ───────────────────────────────────
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize);

  // ── Reduce motion: stop animation ─────────────────────
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    renderer.setAnimationLoop(null);
    // Render one frame
    renderer.render(scene, camera);
  }
})();
