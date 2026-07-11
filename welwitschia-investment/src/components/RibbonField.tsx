"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsapSetup";

/* Slow, wind-like ribbons inspired by the two eternal leaves of the
   Welwitschia — drawn as layered translucent bands, with drifting
   gold dust. Deliberately quiet: ambience, not spectacle. */
export default function RibbonField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = Math.random() * 1000;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse);

    type Ribbon = {
      yBase: number; amp: number; freq: number; speed: number; width: number;
      hueGold: boolean; alpha: number; phase: number; drift: number;
    };
    const ribbons: Ribbon[] = [
      { yBase: 0.62, amp: 0.10, freq: 1.35, speed: 0.055, width: 130, hueGold: true, alpha: 0.05, phase: 0.0, drift: 0.35 },
      { yBase: 0.70, amp: 0.13, freq: 1.05, speed: 0.042, width: 200, hueGold: true, alpha: 0.038, phase: 1.7, drift: 0.5 },
      { yBase: 0.55, amp: 0.08, freq: 1.7, speed: 0.065, width: 80, hueGold: false, alpha: 0.045, phase: 3.1, drift: 0.28 },
      { yBase: 0.78, amp: 0.09, freq: 0.9, speed: 0.035, width: 260, hueGold: true, alpha: 0.028, phase: 4.6, drift: 0.6 },
      { yBase: 0.47, amp: 0.06, freq: 2.1, speed: 0.075, width: 46, hueGold: false, alpha: 0.05, phase: 5.9, drift: 0.2 },
    ];

    const NDUST = window.innerWidth < 768 ? 26 : 60;
    const dust = Array.from({ length: NDUST }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      vx: (Math.random() - 0.3) * 0.00009,
      vy: -0.00003 - Math.random() * 0.00007,
      tw: Math.random() * Math.PI * 2,
      a: 0.15 + Math.random() * 0.4,
    }));

    const drawRibbon = (r: Ribbon) => {
      const my = (mouse.y - 0.5) * 40 * r.drift;
      const mx = (mouse.x - 0.5) * 60 * r.drift;
      const yAt = (x01: number) =>
        h * r.yBase +
        Math.sin(x01 * Math.PI * 2 * r.freq + t * r.speed + r.phase) * h * r.amp +
        Math.sin(x01 * Math.PI * 2 * r.freq * 0.37 + t * r.speed * 1.6 + r.phase * 2) *
          h * r.amp * 0.45 +
        my;

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      if (r.hueGold) {
        grad.addColorStop(0, "rgba(200,166,90,0)");
        grad.addColorStop(0.35, `rgba(226,194,111,${r.alpha})`);
        grad.addColorStop(0.65, `rgba(200,166,90,${r.alpha * 0.85})`);
        grad.addColorStop(1, "rgba(200,166,90,0)");
      } else {
        grad.addColorStop(0, "rgba(28,147,183,0)");
        grad.addColorStop(0.4, `rgba(92,205,232,${r.alpha})`);
        grad.addColorStop(0.7, `rgba(28,147,183,${r.alpha * 0.9})`);
        grad.addColorStop(1, "rgba(28,147,183,0)");
      }

      ctx.beginPath();
      const STEPS = 42;
      for (let i = 0; i <= STEPS; i++) {
        const x01 = i / STEPS;
        const x = x01 * (w + 200) - 100 + mx;
        const y = yAt(x01);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = STEPS; i >= 0; i--) {
        const x01 = i / STEPS;
        const x = x01 * (w + 200) - 100 + mx;
        const y = yAt(x01) + r.width * (0.75 + 0.25 * Math.sin(x01 * 5 + t * 0.03));
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // luminous top edge
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const x01 = i / STEPS;
        const x = x01 * (w + 200) - 100 + mx;
        const y = yAt(x01);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = r.hueGold
        ? `rgba(244,227,174,${r.alpha * 1.6})`
        : `rgba(92,205,232,${r.alpha * 1.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const frame = () => {
      t += 1;
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const r of ribbons) drawRibbon(r);

      // gold dust
      for (const d of dust) {
        d.x += d.vx; d.y += d.vy; d.tw += 0.012;
        if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        if (d.x > 1.02) d.x = -0.02;
        if (d.x < -0.02) d.x = 1.02;
        const a = d.a * (0.5 + 0.5 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226,194,111,${a * 0.5})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      if (!reduced) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 h-full w-full"}
      aria-hidden
    />
  );
}
