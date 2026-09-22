"use client";

import { useEffect, useRef } from "react";

export function PerspectiveGridCanvas() {
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

    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.35;
      const vpX = width / 2;
      const vpY = horizonY;

      // Horizon atmospheric glow
      const grad = ctx.createRadialGradient(vpX, vpY, 10, vpX, vpY, width * 0.55);
      grad.addColorStop(0, "rgba(0, 210, 255, 0.28)");
      grad.addColorStop(0.5, "rgba(23, 105, 255, 0.12)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Horizon line
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00d2ff";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Perspective vertical lines receding to vanishing point
      const NUM_V_LINES = 20;
      for (let i = -NUM_V_LINES / 2; i <= NUM_V_LINES / 2; i++) {
        const bottomX = vpX + i * (width / 10);
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(bottomX, height);
        ctx.strokeStyle = "rgba(0, 210, 255, 0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Moving horizontal lines (speed towards camera)
      offset = (offset + 0.006) % 1;
      const NUM_H_LINES = 14;

      for (let j = 0; j < NUM_H_LINES; j++) {
        const p = (j + offset) / NUM_H_LINES;
        // Non-linear exponential curve for authentic 3D depth
        const depth = Math.pow(p, 2.5);
        const y = horizonY + depth * (height - horizonY);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        const alpha = Math.min(0.55, depth * 0.85);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1 + depth * 1.5;
        ctx.stroke();
      }

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
