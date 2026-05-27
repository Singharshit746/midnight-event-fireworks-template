import { useEffect, useRef } from "react";

interface TrailStar {
  x: number;
  y: number;
  life: number;
}

/** Cursor-following glowing stars */
export function MouseStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailStar[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });

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

    const onMove = (e: MouseEvent | TouchEvent) => {
      const point = "touches" in e ? e.touches[0] : e;
      mouseRef.current = { x: point.clientX, y: point.clientY };
      for (let i = 0; i < 2; i++) {
        trailRef.current.push({
          x: point.clientX + (Math.random() - 0.5) * 20,
          y: point.clientY + (Math.random() - 0.5) * 20,
          life: 1,
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trailRef.current = trailRef.current.filter((s) => {
        s.life -= 0.02;
        if (s.life <= 0) return false;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        grad.addColorStop(0, `rgba(244, 165, 196, ${s.life * 0.8})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6 * s.life, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[15]"
      aria-hidden
    />
  );
}
