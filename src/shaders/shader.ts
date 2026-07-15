export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Unchanged from the image version — this is the actual fluid/trail simulation.
export const fluidFragmentShader = `
  uniform sampler2D uPrevTrails;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform vec2 uResolution;
  uniform float uDecay;
  uniform bool uIsMoving;

  varying vec2 vUv;

  void main() {
    vec4 prevState = texture2D(uPrevTrails, vUv);

    float newValue = prevState.r * uDecay;

    if (uIsMoving) {
      vec2 mouseDirection = uMouse - uPrevMouse;
      float lineLength = length(mouseDirection);

      if (lineLength > 0.001) {
        vec2 mouseDir = mouseDirection / lineLength;

        vec2 toPixel = vUv - uPrevMouse;
        float projAlong = dot(toPixel, mouseDir);
        projAlong = clamp(projAlong, 0.0, lineLength);

        vec2 closestPoint = uPrevMouse + projAlong * mouseDir;
        float dist = length(vUv - closestPoint);

        float lineWidth = 0.09;
        float intensity = smoothstep(lineWidth, 0.0, dist) * 0.3;

        newValue += intensity;
      }
    }

    gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
  }
`;

// Instead of sampling two image textures and mixing them, this just turns
// the fluid value into an alpha-masked white pixel. This is the frame we
// read back with toDataURL() and hand to CSS as a mask-image.
export const maskFragmentShader = `
  uniform sampler2D uFluid;
  uniform float uDpr;

  varying vec2 vUv;

  void main() {
    float fluid = texture2D(uFluid, vUv).r;

    // Wide transition band so there's an actual gradient to antialias
    // against, instead of a near-binary cutoff that blocks up when the
    // low-res mask canvas gets stretched by CSS.
    float threshold = 0.02;
    float edgeWidth = 0.08;

    float alpha = smoothstep(threshold, threshold + edgeWidth, fluid);

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

// Works in real pixel distance (via uResolution) instead of raw UV space,
// so the trail stays circular instead of stretching on non-square
// containers. uRadius is in the same pixel units as uResolution.
export const aspectCorrectedFluidFragmentShader = `
  uniform sampler2D uPrevTrails;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform vec2 uResolution;
  uniform float uRadius;
  uniform float uDecay;
  uniform bool uIsMoving;

  varying vec2 vUv;

  void main() {
    vec4 prevState = texture2D(uPrevTrails, vUv);

    float newValue = prevState.r * uDecay;

    if (uIsMoving) {
      vec2 pixelPos = vUv * uResolution;
      vec2 mousePos = uMouse * uResolution;
      vec2 prevMousePos = uPrevMouse * uResolution;

      vec2 mouseDirection = mousePos - prevMousePos;
      float lineLength = length(mouseDirection);

      if (lineLength > 0.001) {
        vec2 mouseDir = mouseDirection / lineLength;

        vec2 toPixel = pixelPos - prevMousePos;
        float projAlong = dot(toPixel, mouseDir);
        projAlong = clamp(projAlong, 0.0, lineLength);

        vec2 closestPoint = prevMousePos + projAlong * mouseDir;
        float dist = length(pixelPos - closestPoint);

        // Soft falloff over ~40% of the radius instead of a hard cutoff
        // at uRadius — this is what actually removes the blockiness,
        // the low-res sim buffer alone can't antialias a 1px-wide edge.
        float softness = uRadius * 0.4;
        float intensity = smoothstep(uRadius, uRadius - softness, dist) * 0.3;

        newValue += intensity;
      }
    }

    gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
  }
`;

export const aspectCorrectedMaskFragmentShader = `
  uniform sampler2D uFluid;
  uniform float uDpr;
  uniform float uRevealProgress;
  uniform vec2 uRevealCenter;
  uniform vec2 uResolution;

  varying vec2 vUv;

  void main() {
    float fluid = texture2D(uFluid, vUv).r;

    float threshold = 0.02;
    float edgeWidth = 0.08;

    float alpha = smoothstep(threshold, threshold + edgeWidth, fluid);

    if (uRevealProgress > 0.0) {
      vec2 pixelPos = vUv * uResolution;
      vec2 centerPos = uRevealCenter * uResolution;
      float dist = length(pixelPos - centerPos);

      float maxDist = length(uResolution);
      float revealRadius = uRevealProgress * maxDist;

      // Wide, resolution-proportional falloff (was a fixed 20px band,
      // which reads as a hard ring once the mask canvas is upscaled).
      float revealSoftness = max(revealRadius * 0.15, 40.0);
      float revealAlpha = smoothstep(
        revealRadius,
        revealRadius - revealSoftness,
        dist
      );
      alpha = max(alpha, revealAlpha);
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

// ── Hero Dissolve Transition Shader ─────────────────────────
// FBM noise dissolve — used for the hero→about scroll transition.
export const dissolveFragmentShader = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue = fbm(centeredUv * 15.0);
    float d = dissolveEdge + noiseValue * uSpread;

    float pixelSize = 1.0 / uResolution.y;
    float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

