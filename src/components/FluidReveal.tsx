/*
  FluidReveal.tsx — WebGL2 Navier-Stokes Fluid Simulation as CSS Mask
  
  Adapted from PavelDoGreat/WebGL-Fluid-Simulation (MIT License)
  Copyright (c) 2017 Pavel Dobryakov
  
  Runs an incompressible fluid sim on a hidden canvas, renders the density
  field as a monochrome alpha texture, and applies it as a CSS mask-image
  on the hidden "red" layer to create a liquid reveal effect.
*/

"use client";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   SIMULATION CONFIG — tuned for slow, elegant, premium interaction
   ═══════════════════════════════════════════════════════════════════════════ */

const CONFIG = {
  SIM_RESOLUTION: 64,
  DYE_RESOLUTION: 256,
  DENSITY_DISSIPATION: 0.97,
  VELOCITY_DISSIPATION: 0.98,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 20,
  SPLAT_RADIUS: 0.5,
  SPLAT_FORCE: 3000,
  MOUSE_LERP: 0.08,
  REFRACTION_STRENGTH: 0.004,
};

/* ═══════════════════════════════════════════════════════════════════════════
   GLSL SHADER SOURCES — WebGL2 / GLSL ES 3.00
   ═══════════════════════════════════════════════════════════════════════════ */

const baseVertexShader = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const clearShader = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
out vec4 fragColor;
void main () {
    fragColor = value * texture(uTexture, vUv);
}`;

const splatShader = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
out vec4 fragColor;
void main () {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture(uTarget, vUv).xyz;
    fragColor = vec4(base + splat, 1.0);
}`;

const advectionShader = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;
out vec4 fragColor;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
    vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
    #ifdef MANUAL_FILTERING
    fragColor = dissipation * bilerp(uSource, coord, dyeTexelSize);
    #else
    fragColor = dissipation * texture(uSource, coord);
    #endif
    fragColor.a = 1.0;
}`;

const divergenceShader = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main () {
    float L = texture(uVelocity, vL).x;
    float R = texture(uVelocity, vR).x;
    float T = texture(uVelocity, vT).y;
    float B = texture(uVelocity, vB).y;
    float div = 0.5 * (R - L + T - B);
    fragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const curlShader = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main () {
    float L = texture(uVelocity, vL).y;
    float R = texture(uVelocity, vR).y;
    float T = texture(uVelocity, vT).x;
    float B = texture(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const vorticityShader = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
out vec4 fragColor;
void main () {
    float L = texture(uCurl, vL).x;
    float R = texture(uCurl, vR).x;
    float T = texture(uCurl, vT).x;
    float B = texture(uCurl, vB).x;
    float C = texture(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture(uVelocity, vUv).xy;
    velocity += force * dt;
    fragColor = vec4(velocity, 0.0, 1.0);
}`;

const pressureShader = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
out vec4 fragColor;
void main () {
    float L = texture(uPressure, vL).x;
    float R = texture(uPressure, vR).x;
    float T = texture(uPressure, vT).x;
    float B = texture(uPressure, vB).x;
    float C = texture(uDivergence, vUv).x;
    float pressure = (L + R + B + T - C) * 0.25;
    fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const gradientSubtractShader = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main () {
    float L = texture(uPressure, vL).x;
    float R = texture(uPressure, vR).x;
    float T = texture(uPressure, vT).x;
    float B = texture(uPressure, vB).x;
    vec2 velocity = texture(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    fragColor = vec4(velocity, 0.0, 1.0);
}`;

const displayMaskShader = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
uniform sampler2D uDensity;
uniform sampler2D uVelocity;
uniform float refractionStrength;
out vec4 fragColor;
void main () {
    vec2 vel = texture(uVelocity, vUv).xy;
    vec2 refractedUv = clamp(vUv + vel * refractionStrength, 0.0, 1.0);
    vec3 c = texture(uDensity, refractedUv).rgb;
    float density = max(c.r, max(c.g, c.b));
    density = smoothstep(0.0, 0.4, density);
    fragColor = vec4(density, density, density, density);
}`;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface GLProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;
  bind: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC HANDLE & PROPS
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FluidRevealHandle {
  splat: (x: number, y: number, dx?: number, dy?: number) => void;
  startContinuousSplat: (x: number, y: number) => void;
  stopContinuousSplat: () => void;
}

interface FluidRevealProps {
  maskerRef: React.RefObject<HTMLDivElement | null>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const FluidReveal = forwardRef<FluidRevealHandle, FluidRevealProps>(
  function FluidReveal({ maskerRef }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const splatQueueRef = useRef<
      Array<{ x: number; y: number; dx: number; dy: number }>
    >([]);
    const continuousSplatRef = useRef<{
      active: boolean;
      x: number;
      y: number;
    }>({ active: false, x: 0, y: 0 });

    // ── Imperative Handle (for reveal button / keyboard) ────
    useImperativeHandle(ref, () => ({
      splat(x: number, y: number, dx = 0, dy = 0) {
        const texX = x / window.innerWidth;
        const texY = 1.0 - y / window.innerHeight;
        splatQueueRef.current.push({
          x: texX,
          y: texY,
          dx: dx * CONFIG.SPLAT_FORCE,
          dy: -dy * CONFIG.SPLAT_FORCE,
        });
      },
      startContinuousSplat(x: number, y: number) {
        continuousSplatRef.current = {
          active: true,
          x: x / window.innerWidth,
          y: 1.0 - y / window.innerHeight,
        };
      },
      stopContinuousSplat() {
        continuousSplatRef.current.active = false;
      },
    }));

    // ── Main Effect — entire simulation lifecycle ───────────
    useEffect(() => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      /* ─── WebGL2 Context ─────────────────────────────────── */

      const glCtx = canvasEl.getContext("webgl2", {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        powerPreference: "default",
      });

      if (!glCtx) {
        console.warn("FluidReveal: WebGL2 not available");
        return;
      }
      const gl = glCtx;

      gl.getExtension("EXT_color_buffer_float");
      const supportLinearFiltering = !!gl.getExtension(
        "OES_texture_float_linear"
      );
      const halfFloatTexType = gl.HALF_FLOAT;

      /* ─── Format Support ─────────────────────────────────── */

      function testFormat(
        iFormat: number,
        format: number
      ): boolean {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, iFormat, 4, 4, 0,
          format, halfFloatTexType, null
        );
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D, tex, 0
        );
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.deleteTexture(tex);
        gl.deleteFramebuffer(fbo);
        return ok;
      }

      function getSupportedFormat(
        iFormat: number,
        format: number
      ): { internalFormat: number; format: number } | null {
        if (testFormat(iFormat, format))
          return { internalFormat: iFormat, format };
        // Fallback chain
        if (iFormat === gl.R16F)
          return getSupportedFormat(gl.RG16F, gl.RG);
        if (iFormat === gl.RG16F)
          return getSupportedFormat(gl.RGBA16F, gl.RGBA);
        return null;
      }

      const formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA);
      const formatRG = getSupportedFormat(gl.RG16F, gl.RG);
      const formatR = getSupportedFormat(gl.R16F, gl.RED);

      if (!formatRGBA) {
        console.warn("FluidReveal: required float texture formats not supported");
        return;
      }

      /* ─── Shader Compilation ─────────────────────────────── */

      function compileShader(
        type: number,
        source: string,
        keywords?: string[]
      ): WebGLShader {
        if (keywords && keywords.length > 0) {
          const defines = keywords.map((k) => `#define ${k}\n`).join("");
          source = source.replace(
            "#version 300 es",
            `#version 300 es\n${defines}`
          );
        }
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        }
        return shader;
      }

      function createProgram(
        vSource: string,
        fSource: string,
        keywords?: string[]
      ): GLProgram {
        const vs = compileShader(gl.VERTEX_SHADER, vSource);
        const fs = compileShader(gl.FRAGMENT_SHADER, fSource, keywords);
        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error("Program link error:", gl.getProgramInfoLog(program));
        }
        const uniforms: Record<string, WebGLUniformLocation> = {};
        const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < count; i++) {
          const info = gl.getActiveUniform(program, i);
          if (info) {
            const loc = gl.getUniformLocation(program, info.name);
            if (loc) uniforms[info.name] = loc;
          }
        }
        return {
          program,
          uniforms,
          bind() {
            gl.useProgram(program);
          },
        };
      }

      /* ─── Programs ───────────────────────────────────────── */

      const filterKW = supportLinearFiltering ? [] : ["MANUAL_FILTERING"];

      const clearProg = createProgram(baseVertexShader, clearShader);
      const splatProg = createProgram(baseVertexShader, splatShader);
      const advectionProg = createProgram(
        baseVertexShader,
        advectionShader,
        filterKW
      );
      const divergenceProg = createProgram(baseVertexShader, divergenceShader);
      const curlProg = createProgram(baseVertexShader, curlShader);
      const vorticityProg = createProgram(baseVertexShader, vorticityShader);
      const pressureProg = createProgram(baseVertexShader, pressureShader);
      const gradSubProg = createProgram(
        baseVertexShader,
        gradientSubtractShader
      );
      const displayProg = createProgram(baseVertexShader, displayMaskShader);

      /* ─── Full-screen Quad (blit) ────────────────────────── */

      const quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );

      const idxBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );

      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      function blit(target: FBO | null, clear = false) {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 0.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      }

      /* ─── FBO Creation ───────────────────────────────────── */

      const texFilter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      function createFBO(
        w: number,
        h: number,
        iFormat: number,
        format: number,
        type: number,
        filter: number
      ): FBO {
        gl.activeTexture(gl.TEXTURE0);
        const texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, iFormat, w, h, 0, format, type, null
        );
        const fbo = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D, texture, 0
        );
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return {
          texture,
          fbo,
          width: w,
          height: h,
          texelSizeX: 1.0 / w,
          texelSizeY: 1.0 / h,
          attach(id: number) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
          },
        };
      }

      function createDoubleFBO(
        w: number,
        h: number,
        iFormat: number,
        format: number,
        type: number,
        filter: number
      ): DoubleFBO {
        let fbo1 = createFBO(w, h, iFormat, format, type, filter);
        let fbo2 = createFBO(w, h, iFormat, format, type, filter);
        return {
          width: w,
          height: h,
          texelSizeX: fbo1.texelSizeX,
          texelSizeY: fbo1.texelSizeY,
          get read() {
            return fbo1;
          },
          get write() {
            return fbo2;
          },
          swap() {
            const tmp = fbo1;
            fbo1 = fbo2;
            fbo2 = tmp;
          },
        };
      }

      function deleteFBO(f: FBO) {
        gl.deleteTexture(f.texture);
        gl.deleteFramebuffer(f.fbo);
      }

      function deleteDoubleFBO(d: DoubleFBO) {
        deleteFBO(d.read);
        deleteFBO(d.write);
      }

      /* ─── Resolution Helper ──────────────────────────────── */

      function getResolution(res: number) {
        const ar = window.innerWidth / window.innerHeight;
        return ar >= 1
          ? { width: res, height: Math.round(res / ar) }
          : { width: Math.round(res * ar), height: res };
      }

      /* ─── Initialize FBOs ────────────────────────────────── */

      const dyeRes = getResolution(CONFIG.DYE_RESOLUTION);
      const simRes = getResolution(CONFIG.SIM_RESOLUTION);

      canvasEl.width = dyeRes.width;
      canvasEl.height = dyeRes.height;

      const dyeFmt = formatRGBA!;
      const simFmt = formatRG || formatRGBA!;
      const sim1Fmt = formatR || formatRG || formatRGBA!;

      let dye = createDoubleFBO(
        dyeRes.width, dyeRes.height,
        dyeFmt.internalFormat, dyeFmt.format,
        halfFloatTexType, texFilter
      );
      let velocity = createDoubleFBO(
        simRes.width, simRes.height,
        simFmt.internalFormat, simFmt.format,
        halfFloatTexType, texFilter
      );
      let divergenceFBO = createFBO(
        simRes.width, simRes.height,
        sim1Fmt.internalFormat, sim1Fmt.format,
        halfFloatTexType, gl.NEAREST
      );
      let curlFBO = createFBO(
        simRes.width, simRes.height,
        sim1Fmt.internalFormat, sim1Fmt.format,
        halfFloatTexType, gl.NEAREST
      );
      let pressure = createDoubleFBO(
        simRes.width, simRes.height,
        sim1Fmt.internalFormat, sim1Fmt.format,
        halfFloatTexType, gl.NEAREST
      );

      /* ─── Splat ──────────────────────────────────────────── */

      function doSplat(
        x: number,
        y: number,
        dx: number,
        dy: number,
        color: [number, number, number]
      ) {
        splatProg.bind();
        gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(
          splatProg.uniforms.aspectRatio,
          canvasEl!.width / canvasEl!.height
        );
        gl.uniform2f(splatProg.uniforms.point, x, y);
        gl.uniform3f(splatProg.uniforms.color, dx, dy, 0.0);
        gl.uniform1f(
          splatProg.uniforms.radius,
          CONFIG.SPLAT_RADIUS / 100.0
        );
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatProg.uniforms.color, color[0], color[1], color[2]);
        blit(dye.write);
        dye.swap();
      }

      /* ─── Simulation Step ────────────────────────────────── */

      function step(dt: number) {
        gl.disable(gl.BLEND);

        // Curl
        curlProg.bind();
        gl.uniform2f(
          curlProg.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
        blit(curlFBO);

        // Vorticity confinement
        vorticityProg.bind();
        gl.uniform2f(
          vorticityProg.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          vorticityProg.uniforms.uVelocity,
          velocity.read.attach(0)
        );
        gl.uniform1i(vorticityProg.uniforms.uCurl, curlFBO.attach(1));
        gl.uniform1f(vorticityProg.uniforms.curl, CONFIG.CURL);
        gl.uniform1f(vorticityProg.uniforms.dt, dt);
        blit(velocity.write);
        velocity.swap();

        // Divergence
        divergenceProg.bind();
        gl.uniform2f(
          divergenceProg.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          divergenceProg.uniforms.uVelocity,
          velocity.read.attach(0)
        );
        blit(divergenceFBO);

        // Clear pressure
        clearProg.bind();
        gl.uniform1i(
          clearProg.uniforms.uTexture,
          pressure.read.attach(0)
        );
        gl.uniform1f(clearProg.uniforms.value, CONFIG.PRESSURE);
        blit(pressure.write);
        pressure.swap();

        // Pressure solve — Jacobi iterations
        pressureProg.bind();
        gl.uniform2f(
          pressureProg.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          pressureProg.uniforms.uDivergence,
          divergenceFBO.attach(0)
        );
        for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
          gl.uniform1i(
            pressureProg.uniforms.uPressure,
            pressure.read.attach(1)
          );
          blit(pressure.write);
          pressure.swap();
        }

        // Gradient subtract
        gradSubProg.bind();
        gl.uniform2f(
          gradSubProg.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        gl.uniform1i(
          gradSubProg.uniforms.uPressure,
          pressure.read.attach(0)
        );
        gl.uniform1i(
          gradSubProg.uniforms.uVelocity,
          velocity.read.attach(1)
        );
        blit(velocity.write);
        velocity.swap();

        // Advect velocity
        advectionProg.bind();
        gl.uniform2f(
          advectionProg.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
        if (!supportLinearFiltering) {
          gl.uniform2f(
            advectionProg.uniforms.dyeTexelSize,
            velocity.texelSizeX,
            velocity.texelSizeY
          );
        }
        gl.uniform1i(
          advectionProg.uniforms.uVelocity,
          velocity.read.attach(0)
        );
        gl.uniform1i(
          advectionProg.uniforms.uSource,
          velocity.read.attach(0)
        );
        gl.uniform1f(advectionProg.uniforms.dt, dt);
        gl.uniform1f(
          advectionProg.uniforms.dissipation,
          CONFIG.VELOCITY_DISSIPATION
        );
        blit(velocity.write);
        velocity.swap();

        // Advect dye/density
        if (!supportLinearFiltering) {
          gl.uniform2f(
            advectionProg.uniforms.dyeTexelSize,
            dye.texelSizeX,
            dye.texelSizeY
          );
        }
        gl.uniform1i(
          advectionProg.uniforms.uVelocity,
          velocity.read.attach(0)
        );
        gl.uniform1i(advectionProg.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(
          advectionProg.uniforms.dissipation,
          CONFIG.DENSITY_DISSIPATION
        );
        blit(dye.write);
        dye.swap();
      }

      /* ─── Render Mask ────────────────────────────────────── */

      function renderMask() {
        displayProg.bind();
        gl.uniform1i(displayProg.uniforms.uDensity, dye.read.attach(0));
        gl.uniform1i(
          displayProg.uniforms.uVelocity,
          velocity.read.attach(1)
        );
        gl.uniform1f(
          displayProg.uniforms.refractionStrength,
          CONFIG.REFRACTION_STRENGTH
        );
        blit(null, true);
      }

      /* ─── Mouse Tracking ─────────────────────────────────── */

      let rawMouseX = window.innerWidth / 2;
      let rawMouseY = window.innerHeight / 2;
      let smoothMouseX = rawMouseX;
      let smoothMouseY = rawMouseY;
      let prevTexX = 0.5;
      let prevTexY = 0.5;
      let mouseInWindow = false;
      let lastSplatTime = 0;

      const onMouseMove = (e: MouseEvent) => {
        rawMouseX = e.clientX;
        rawMouseY = e.clientY;
        mouseInWindow = true;
      };
      const onMouseLeave = () => {
        mouseInWindow = false;
      };
      const onTouchStart = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        rawMouseX = t.clientX;
        rawMouseY = t.clientY;
        smoothMouseX = rawMouseX;
        smoothMouseY = rawMouseY;
        prevTexX = rawMouseX / window.innerWidth;
        prevTexY = 1.0 - rawMouseY / window.innerHeight;
        mouseInWindow = true;
      };
      const onTouchMove = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        rawMouseX = t.clientX;
        rawMouseY = t.clientY;
        mouseInWindow = true;
      };
      const onTouchEnd = () => {
        mouseInWindow = false;
      };

      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });

      /* ─── Animation Loop ─────────────────────────────────── */

      let animId: number;
      let lastTime = Date.now();
      let frameCount = 0;
      let maskCleared = true;

      function update() {
        animId = requestAnimationFrame(update);

        const now = Date.now();
        let dt = (now - lastTime) / 1000;
        dt = Math.min(dt, 0.016666);
        lastTime = now;

        // ── Cursor inertia (lerped smoothing) ─────────────
        if (mouseInWindow) {
          smoothMouseX += (rawMouseX - smoothMouseX) * CONFIG.MOUSE_LERP;
          smoothMouseY += (rawMouseY - smoothMouseY) * CONFIG.MOUSE_LERP;

          const texX = smoothMouseX / window.innerWidth;
          const texY = 1.0 - smoothMouseY / window.innerHeight;
          const dx = texX - prevTexX;
          const dy = texY - prevTexY;

          if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
            doSplat(
              texX,
              texY,
              dx * CONFIG.SPLAT_FORCE,
              dy * CONFIG.SPLAT_FORCE,
              [1, 1, 1]
            );
            lastSplatTime = now;
            maskCleared = false;
          }

          prevTexX = texX;
          prevTexY = texY;
        }

        // ── External splat queue ──────────────────────────
        while (splatQueueRef.current.length > 0) {
          const s = splatQueueRef.current.shift()!;
          doSplat(s.x, s.y, s.dx, s.dy, [1, 1, 1]);
          lastSplatTime = now;
          maskCleared = false;
        }

        // ── Continuous splat (reveal button held) ─────────
        if (continuousSplatRef.current.active) {
          const jx = (Math.random() - 0.5) * 0.015;
          const jy = (Math.random() - 0.5) * 0.015;
          doSplat(
            continuousSplatRef.current.x + jx,
            continuousSplatRef.current.y + jy,
            jx * CONFIG.SPLAT_FORCE * 0.5,
            jy * CONFIG.SPLAT_FORCE * 0.5,
            [1, 1, 1]
          );
          lastSplatTime = now;
          maskCleared = false;
        }

        // ── Run simulation ────────────────────────────────
        step(dt);

        // ── Render density → canvas ───────────────────────
        renderMask();

        // ── Apply canvas as CSS mask on red layer ─────────
        const redLayer = maskerRef.current;
        if (!redLayer) return;

        const elapsed = now - lastSplatTime;

        if (elapsed < 6000) {
          // Active: update mask every other frame for perf
          if (frameCount % 2 === 0) {
            const dataUrl = canvasEl!.toDataURL("image/png");
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            redLayer.style.setProperty(
              "-webkit-mask-image",
              `url(${dataUrl})`
            );
            redLayer.style.setProperty("mask-image", `url(${dataUrl})`);
            
            redLayer.style.setProperty(
              "-webkit-mask-size",
              `${w}px ${h}px`
            );
            redLayer.style.setProperty(
              "mask-size",
              `${w}px ${h}px`
            );
            
            redLayer.style.setProperty(
              "-webkit-mask-repeat",
              "no-repeat"
            );
            redLayer.style.setProperty(
              "mask-repeat",
              "no-repeat"
            );

            redLayer.style.setProperty(
              "-webkit-mask-position",
              `0 ${window.scrollY}px`
            );
            redLayer.style.setProperty(
              "mask-position",
              `0 ${window.scrollY}px`
            );
          }
        } else if (!maskCleared) {
          // Fluid fully dissipated — clear mask once
          redLayer.style.setProperty(
            "-webkit-mask-image",
            "linear-gradient(transparent, transparent)"
          );
          redLayer.style.setProperty(
            "mask-image",
            "linear-gradient(transparent, transparent)"
          );
          maskCleared = true;
        }

        frameCount++;
      }

      /* ─── Resize Handler ─────────────────────────────────── */

      let resizeTimer: ReturnType<typeof setTimeout>;

      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const newDye = getResolution(CONFIG.DYE_RESOLUTION);
          const newSim = getResolution(CONFIG.SIM_RESOLUTION);

          canvasEl!.width = newDye.width;
          canvasEl!.height = newDye.height;

          deleteDoubleFBO(dye);
          deleteDoubleFBO(velocity);
          deleteFBO(divergenceFBO);
          deleteFBO(curlFBO);
          deleteDoubleFBO(pressure);

          dye = createDoubleFBO(
            newDye.width, newDye.height,
            dyeFmt.internalFormat, dyeFmt.format,
            halfFloatTexType, texFilter
          );
          velocity = createDoubleFBO(
            newSim.width, newSim.height,
            simFmt.internalFormat, simFmt.format,
            halfFloatTexType, texFilter
          );
          divergenceFBO = createFBO(
            newSim.width, newSim.height,
            sim1Fmt.internalFormat, sim1Fmt.format,
            halfFloatTexType, gl.NEAREST
          );
          curlFBO = createFBO(
            newSim.width, newSim.height,
            sim1Fmt.internalFormat, sim1Fmt.format,
            halfFloatTexType, gl.NEAREST
          );
          pressure = createDoubleFBO(
            newSim.width, newSim.height,
            sim1Fmt.internalFormat, sim1Fmt.format,
            halfFloatTexType, gl.NEAREST
          );
        }, 250);
      };

      window.addEventListener("resize", onResize);

      /* ─── Start ──────────────────────────────────────────── */
      update();

      /* ─── Cleanup ────────────────────────────────────────── */
      return () => {
        cancelAnimationFrame(animId);
        clearTimeout(resizeTimer);
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("resize", onResize);

        // Clear mask
        const redLayer = maskerRef.current;
        if (redLayer) {
          redLayer.style.removeProperty("-webkit-mask-image");
          redLayer.style.removeProperty("mask-image");
        }
      };
    }, [maskerRef]);

    /* ─── Render ───────────────────────────────────────────── */

    return (
      <canvas
        ref={canvasRef}
        id="fluid-sim-canvas"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -9999,
        }}
      />
    );
  }
);

export default FluidReveal;
