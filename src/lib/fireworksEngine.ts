/**
 * Canvas-based fireworks engine with glow, reflections, and heart bursts.
 */

export interface FireworkOptions {
  x?: number;
  y?: number;
  heart?: boolean;
  color?: string;
  intensity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
  trail: { x: number; y: number }[];
  gravity: number;
  friction: number;
  sparkle: boolean;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  heart: boolean;
  trail: { x: number; y: number }[];
  exploded: boolean;
}

const PALETTE = [
  "#f4a5c4",
  "#c084fc",
  "#818cf8",
  "#67e8f9",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#e879f9",
  "#ffffff",
];

function randomColor(): string {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Heart parametric points for burst shape */
function heartPoint(t: number, scale: number): { x: number; y: number } {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x: x * scale * 0.06, y: y * scale * 0.06 };
}

export class FireworksEngine {
  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private particles: Particle[] = [];
  private rockets: Rocket[] = [];
  private reflectionY = 0;
  private autoLaunchTimer = 0;
  private intensity = 1;
  private running = false;
  private rafId = 0;
  private onBeat?: () => void;
  private beatTimer = 0;
  private lowQuality: boolean;

  private canvas: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement,
    options?: { onBeat?: () => void; lowQuality?: boolean },
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.onBeat = options?.onBeat;
    this.lowQuality = options?.lowQuality ?? false;
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    const dprCap = this.lowQuality ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.reflectionY = this.height * 0.72;
  };

  setIntensity(v: number) {
    this.intensity = v;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  /** Launch firework at screen position */
  launch(x: number, y?: number, opts?: FireworkOptions) {
    const startX = opts?.x ?? x;
    const startY = this.height;
    const targetY = y ?? this.height * (0.15 + Math.random() * 0.25);
    const heart = opts?.heart ?? Math.random() < 0.12;
    this.rockets.push({
      x: startX,
      y: startY,
      vy: -12 - Math.random() * 4,
      targetY,
      color: opts?.color ?? randomColor(),
      heart,
      trail: [],
      exploded: false,
    });
  }

  /** Auto-launch from random positions */
  autoLaunch() {
    const x = this.width * (0.1 + Math.random() * 0.8);
    const heart = Math.random() < 0.15;
    this.launch(x, undefined, { heart });
  }

  private explode(x: number, y: number, color: string, heart: boolean) {
    const scale = this.lowQuality ? 0.55 : 1;
    const count = Math.floor(
      (heart ? 80 : 60 + Math.floor(Math.random() * 40)) * scale,
    );
    const [r, g, b] = hexToRgb(color);

    for (let i = 0; i < count; i++) {
      let vx: number;
      let vy: number;

      if (heart) {
        const t = (i / count) * Math.PI * 2;
        const p = heartPoint(t, 8 + Math.random() * 4);
        vx = p.x * (0.8 + Math.random() * 0.4);
        vy = p.y * (0.8 + Math.random() * 0.4);
      } else {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 2 + Math.random() * 6;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      const shade = Math.random() > 0.5 ? color : `rgb(${r},${g},${b})`;
      this.particles.push({
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife: 50 + Math.random() * 40,
        color: shade,
        size: 1.5 + Math.random() * 2,
        alpha: 1,
        trail: [],
        gravity: 0.04 + Math.random() * 0.02,
        friction: 0.97 + Math.random() * 0.02,
        sparkle: Math.random() > 0.7,
      });
    }

    // Secondary ring burst
    const ringCount = this.lowQuality ? 10 : 20;
    for (let i = 0; i < ringCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30 + Math.random() * 20,
        color: "#ffffff",
        size: 1,
        alpha: 0.8,
        trail: [],
        gravity: 0.03,
        friction: 0.96,
        sparkle: true,
      });
    }

    this.onBeat?.();
  }

  private drawSky() {
    const { ctx, width, height } = this;
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#050510");
    grad.addColorStop(0.4, "#0a0a1a");
    grad.addColorStop(0.7, "#0f1729");
    grad.addColorStop(1, "#0a1628");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Horizon glow
    const horizon = ctx.createRadialGradient(
      width / 2,
      height * 0.85,
      0,
      width / 2,
      height * 0.85,
      width * 0.6,
    );
    horizon.addColorStop(0, "rgba(26, 16, 51, 0.6)");
    horizon.addColorStop(1, "transparent");
    ctx.fillStyle = horizon;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);
  }

  private drawReflections() {
    const { ctx, reflectionY } = this;
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.translate(0, reflectionY);
    ctx.scale(1, -0.3);
    ctx.translate(0, -reflectionY);

    for (const p of this.particles) {
      if (p.alpha < 0.1) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.3;
      ctx.fill();
    }
    ctx.restore();
  }

  private drawParticle(p: Particle) {
    const { ctx } = this;
    const lifeRatio = 1 - p.life / p.maxLife;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Glow
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
    glow.addColorStop(0, p.color);
    glow.addColorStop(1, "transparent");
    ctx.globalAlpha = p.alpha * lifeRatio * 0.6;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.globalAlpha = p.alpha * lifeRatio;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Trail
    if (p.trail.length > 1) {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size * 0.5;
      ctx.globalAlpha = p.alpha * lifeRatio * 0.4;
      ctx.beginPath();
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let i = 1; i < p.trail.length; i++) {
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  private loop = () => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.loop);

    const { ctx, width, height } = this;

    this.drawSky();

    // Auto launch
    this.autoLaunchTimer += 1;
    const interval = Math.max(20, 60 - this.intensity * 30);
    if (this.autoLaunchTimer > interval) {
      this.autoLaunchTimer = 0;
      if (Math.random() < this.intensity * 0.8) this.autoLaunch();
    }

    // Beat sync hint
    this.beatTimer += 1;
    if (this.beatTimer > 90) {
      this.beatTimer = 0;
    }

    // Update rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 12) r.trail.shift();

      r.vy += 0.15;
      r.y += r.vy;

      // Draw rocket trail
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      if (r.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(r.trail[0].x, r.trail[0].y);
        for (const t of r.trail) ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (r.vy >= 0 || r.y <= r.targetY) {
        this.explode(r.x, r.y, r.color, r.heart);
        this.rockets.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      p.alpha = 1 - p.life / p.maxLife;
      if (p.sparkle && p.life % 4 === 0) p.alpha *= 1.3;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      this.drawParticle(p);
    }

    this.drawReflections();

    // Water line shimmer
    ctx.save();
    const waterGrad = ctx.createLinearGradient(
      0,
      this.reflectionY - 20,
      0,
      height,
    );
    waterGrad.addColorStop(0, "rgba(15, 23, 41, 0.3)");
    waterGrad.addColorStop(1, "rgba(5, 5, 16, 0.8)");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(
      0,
      this.reflectionY - 20,
      width,
      height - this.reflectionY + 20,
    );
    ctx.restore();
  };

  getParticleCount() {
    return this.particles.length + this.rockets.length;
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this.resize);
  }
}
