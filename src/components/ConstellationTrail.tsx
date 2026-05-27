import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

const MAX_POINTS = 12;
const CONNECT_DISTANCE = 120;

/** Constellation lines connecting recent cursor positions */
export function ConstellationTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addPoint = (x: number, y: number) => {
      pointsRef.current.unshift({ x, y, age: 0 });
      if (pointsRef.current.length > MAX_POINTS) {
        pointsRef.current.pop();
      }
    };

    const onMove = (e: MouseEvent) => {
      if (Math.random() > 0.6) addPoint(e.clientX, e.clientY);
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) addPoint(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = pointsRef.current;

      for (const p of pts) p.age += 1;

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            const alpha = (1 - dist / CONNECT_DISTANCE) * 0.4;
            ctx.strokeStyle = `rgba(200, 212, 232, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      for (const p of pts) {
        const fade = Math.max(0, 1 - p.age / 80);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 165, 196, ${fade * 0.9})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[14]"
      aria-hidden
    />
  );
}
