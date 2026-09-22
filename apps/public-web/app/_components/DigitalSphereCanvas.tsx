"use client";

import { useEffect, useRef } from "react";

export function DigitalSphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 680);
    let height = (canvas.height = 680);

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const size = Math.min(680, Math.max(340, Math.floor(rect.width || 600)));
      width = canvas.width = size;
      height = canvas.height = size;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let angleY = 0;
    let angleX = 0.18;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      angleY += dx * 0.005;
      angleX += dy * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const RADIUS = width * 0.38;
      const NUM_LAT = 16;
      const NUM_LON = 22;

      // Rotate sphere automatically if not dragged
      if (!isDragging) {
        angleY += 0.003;
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Draw latitude rings
      for (let i = 1; i < NUM_LAT; i++) {
        const theta = (i * Math.PI) / NUM_LAT;
        const rRing = RADIUS * Math.sin(theta);
        const y0 = RADIUS * Math.cos(theta);

        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 36; j++) {
          const phi = (j * 2 * Math.PI) / 36;
          const x = rRing * Math.cos(phi);
          const z = rRing * Math.sin(phi);
          const y = y0;

          // Rotate around Y
          const x1 = x * cosY - z * sinY;
          const z1 = x * sinY + z * cosY;

          // Rotate around X
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;

          const scale = 520 / (520 + z2);
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = "rgba(0, 210, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw longitude lines
      for (let j = 0; j < NUM_LON; j++) {
        const phi = (j * Math.PI) / NUM_LON;
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= 36; i++) {
          const theta = (i * 2 * Math.PI) / 36;
          const x = RADIUS * Math.cos(theta) * Math.sin(phi);
          const y = RADIUS * Math.sin(theta);
          const z = RADIUS * Math.cos(theta) * Math.cos(phi);

          const x1 = x * cosY - z * sinY;
          const z1 = x * sinY + z * cosY;
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;

          const scale = 520 / (520 + z2);
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = "rgba(23, 105, 255, 0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw glowing vertex nodes on front hemisphere
      for (let i = 2; i < NUM_LAT; i += 2) {
        const theta = (i * Math.PI) / NUM_LAT;
        const rRing = RADIUS * Math.sin(theta);
        const y0 = RADIUS * Math.cos(theta);

        for (let j = 0; j < NUM_LON; j += 3) {
          const phi = (j * 2 * Math.PI) / NUM_LON;
          const x = rRing * Math.cos(phi);
          const z = rRing * Math.sin(phi);
          let y = y0;

          const x1 = x * cosY - z * sinY;
          const z1 = x * sinY + z * cosY;
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;

          if (z2 > -40) {
            const scale = 520 / (520 + z2);
            const px = cx + x1 * scale;
            const py = cy + y2 * scale;
            const alpha = Math.min(1, Math.max(0.15, (z2 + 100) / 360));

            ctx.beginPath();
            ctx.arc(px, py, 2.2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 210, 255, ${alpha * 0.9})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#00d2ff";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
