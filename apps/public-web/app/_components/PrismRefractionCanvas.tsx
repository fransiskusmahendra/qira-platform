"use client";

import { useEffect, useRef } from "react";

export function PrismRefractionCanvas() {
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

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      const cx = width * 0.44;
      const cy = height * 0.52;
      const floatY = Math.sin(time) * 6;

      // Prism Triangle Vertices
      const pTop = { x: cx, y: cy - 90 + floatY };
      const pLeft = { x: cx - 75, y: cy + 70 + floatY };
      const pRight = { x: cx + 75, y: cy + 70 + floatY };

      // Incident ray (white input beam coming from left)
      const rayStartX = 20;
      const rayStartY = cy + 20 + Math.sin(time * 0.8) * 4;
      const hitX = cx - 35;
      const hitY = cy + 10 + floatY;

      ctx.beginPath();
      ctx.moveTo(rayStartX, rayStartY);
      ctx.lineTo(hitX, hitY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ffffff";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Incident ray label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10.5px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("COMPLEXITY", rayStartX + 10, rayStartY - 10);

      // Internal refracted beams inside prism
      const exitPoint1 = { x: cx + 45, y: cy - 15 + floatY };
      const exitPoint2 = { x: cx + 55, y: cy + 15 + floatY };
      const exitPoint3 = { x: cx + 60, y: cy + 45 + floatY };

      ctx.beginPath();
      ctx.moveTo(hitX, hitY);
      ctx.lineTo(exitPoint1.x, exitPoint1.y);
      ctx.strokeStyle = "rgba(0, 210, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hitX, hitY);
      ctx.lineTo(exitPoint2.x, exitPoint2.y);
      ctx.strokeStyle = "rgba(23, 105, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hitX, hitY);
      ctx.lineTo(exitPoint3.x, exitPoint3.y);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Refracted output spectral beams fan out to the right
      const spectra = [
        { exit: exitPoint1, endY: cy - 80, color: "#00d2ff", label: "CLARITY" },
        { exit: exitPoint2, endY: cy + 10, color: "#38bdf8", label: "SPEED" },
        { exit: exitPoint3, endY: cy + 100, color: "#10b981", label: "RELIABILITY" },
      ];

      spectra.forEach((spec) => {
        ctx.beginPath();
        ctx.moveTo(spec.exit.x, spec.exit.y);
        ctx.lineTo(width - 40, spec.endY);
        ctx.strokeStyle = spec.color;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 14;
        ctx.shadowColor = spec.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label for each spectral output
        ctx.fillStyle = spec.color;
        ctx.font = "bold 10.5px system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(spec.label, width - 45, spec.endY - 6);
      });

      // Glass Prism Polygon (Translucent faceted crystal)
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pRight.x, pRight.y);
      ctx.lineTo(pLeft.x, pLeft.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(14, 24, 48, 0.65)";
      ctx.fill();

      // Glowing prism facet borders
      ctx.strokeStyle = "rgba(0, 210, 255, 0.6)";
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00d2ff";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Prism central facet line
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(cx, cy + 70 + floatY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

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
