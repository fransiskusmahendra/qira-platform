"use client";

import { useEffect, useRef } from "react";

export function IsometricStackCanvas() {
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
    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMouseMove);

    // Isometric projection helpers
    const toIso = (x: number, y: number, z: number, cx: number, cy: number) => {
      const isoX = (x - y) * Math.cos(Math.PI / 6);
      const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
      return { x: cx + isoX, y: cy + isoY };
    };

    const drawIsometricSlab = (
      zBase: number,
      sizeX: number,
      sizeY: number,
      thickness: number,
      colorStroke: string,
      colorFill: string,
      cx: number,
      cy: number,
      label: string,
      glowColor: string
    ) => {
      const hw = sizeX / 2;
      const hl = sizeY / 2;

      const p0 = toIso(-hw, -hl, zBase, cx, cy);
      const p1 = toIso(hw, -hl, zBase, cx, cy);
      const p2 = toIso(hw, hl, zBase, cx, cy);
      const p3 = toIso(-hw, hl, zBase, cx, cy);

      const p0b = toIso(-hw, -hl, zBase - thickness, cx, cy);
      const p1b = toIso(hw, -hl, zBase - thickness, cx, cy);
      const p2b = toIso(hw, hl, zBase - thickness, cx, cy);
      const p3b = toIso(-hw, hl, zBase - thickness, cx, cy);

      // Left face
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2b.x, p2b.y);
      ctx.lineTo(p3b.x, p3b.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(10, 16, 32, 0.85)";
      ctx.fill();
      ctx.strokeStyle = colorStroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2b.x, p2b.y);
      ctx.lineTo(p1b.x, p1b.y);
      ctx.closePath();
      ctx.fillStyle = "rgba(14, 24, 48, 0.85)";
      ctx.fill();
      ctx.strokeStyle = colorStroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top face
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = colorFill;
      ctx.fill();

      // Glowing border on top face
      ctx.shadowBlur = 12;
      ctx.shadowColor = glowColor;
      ctx.strokeStyle = colorStroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Internal circuit grid on top face
      for (let i = -1; i <= 1; i++) {
        const lineA = toIso(-hw + 30, (i * hl) / 2, zBase, cx, cy);
        const lineB = toIso(hw - 30, (i * hl) / 2, zBase, cx, cy);
        ctx.beginPath();
        ctx.moveTo(lineA.x, lineA.y);
        ctx.lineTo(lineB.x, lineB.y);
        ctx.strokeStyle = "rgba(0, 210, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Corner node points
      [p0, p1, p2, p3].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Layer label text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, p2.x + 50, p2.y - 12);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      const cx = width / 2;
      const cy = height / 2 + 50;

      // Dynamic floating levitations
      const float0 = Math.sin(time) * 4;
      const float1 = Math.sin(time + 1.2) * 6;
      const float2 = Math.sin(time + 2.4) * 8;

      // Layer 1 (Bottom): Digital Foundation
      drawIsometricSlab(
        -50 + float0,
        220,
        150,
        14,
        "rgba(23, 105, 255, 0.4)",
        "rgba(14, 22, 44, 0.8)",
        cx,
        cy,
        "01 FOUNDATION",
        "#1769ff"
      );

      // Vertical connecting energy beams (Foundation -> Engine)
      const pBeamA1 = toIso(-50, -30, -36 + float0, cx, cy);
      const pBeamA2 = toIso(-50, -30, 24 + float1, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pBeamA1.x, pBeamA1.y);
      ctx.lineTo(pBeamA2.x, pBeamA2.y);
      ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -time * 15;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Layer 2 (Middle): Growth Engine
      drawIsometricSlab(
        24 + float1,
        200,
        135,
        14,
        "rgba(0, 210, 255, 0.6)",
        "rgba(16, 32, 64, 0.85)",
        cx,
        cy,
        "02 GROWTH ENGINE",
        "#00d2ff"
      );

      // Vertical connecting energy beams (Engine -> Connected Growth)
      const pBeamB1 = toIso(50, 30, 38 + float1, cx, cy);
      const pBeamB2 = toIso(50, 30, 102 + float2, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pBeamB1.x, pBeamB1.y);
      ctx.lineTo(pBeamB2.x, pBeamB2.y);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -time * 20;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Layer 3 (Top): Connected Growth
      drawIsometricSlab(
        102 + float2,
        180,
        120,
        14,
        "rgba(56, 189, 248, 0.85)",
        "rgba(20, 42, 80, 0.9)",
        cx,
        cy,
        "03 CONNECTED GROWTH",
        "#38bdf8"
      );

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
