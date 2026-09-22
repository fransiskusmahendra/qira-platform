"use client";

import { useEffect, useRef } from "react";

export function TopographicWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 560;
    let height = 440;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = Math.floor(rect.width || 560);
      height = canvas.height = Math.floor(rect.height || 440);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let time = 0;
    const NUM_LINES = 16;
    const STEPS = 50;

    const milestones = [
      { label: "01 DISCOVER", tPct: 0.18, lineIdx: 11 },
      { label: "02 DESIGN", tPct: 0.40, lineIdx: 9 },
      { label: "03 BUILD", tPct: 0.64, lineIdx: 7 },
      { label: "04 IMPROVE", tPct: 0.86, lineIdx: 5 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      const nodePoints: { x: number; y: number; label: string }[] = [];

      // Draw undulating topographic contour elevation curves
      for (let l = 0; l < NUM_LINES; l++) {
        const lineYBase = height * 0.22 + (l * (height * 0.65)) / NUM_LINES;
        const lineProgress = l / NUM_LINES;
        const alpha = 0.12 + lineProgress * 0.45;

        ctx.beginPath();
        for (let s = 0; s <= STEPS; s++) {
          const x = (s / STEPS) * width;
          // Harmonic undulating mathematical elevation
          const wave1 = Math.sin(s * 0.16 + time + l * 0.25) * 22;
          const wave2 = Math.cos(s * 0.28 - time * 0.8 + l * 0.35) * 14;
          const wave3 = Math.sin((s / STEPS) * Math.PI) * 35; // Center bulge
          const y = lineYBase - (wave1 + wave2 + wave3);

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Check for milestone nodes on this line
          milestones.forEach((m) => {
            if (m.lineIdx === l && Math.abs(s / STEPS - m.tPct) < 0.015) {
              nodePoints.push({ x, y, label: m.label });
            }
          });
        }

        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
        ctx.lineWidth = l % 3 === 0 ? 1.8 : 1;
        ctx.stroke();
      }

      // Draw milestone nodes on top of the elevation contours
      nodePoints.forEach((node) => {
        // Glowing halo ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(23, 105, 255, 0.25)";
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#00d2ff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00d2ff";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label pill
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y - 14);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
