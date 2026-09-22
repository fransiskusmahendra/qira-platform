"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label?: string;
  isHub?: boolean;
}

interface Packet {
  from: number;
  to: number;
  progress: number;
  speed: number;
}

export function NodeNetworkCanvas() {
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

    const HUB_LABELS = [
      "Retail POS",
      "WhatsApp API",
      "Cloud Database",
      "Owner Dashboard",
      "Multi-Warehouse",
      "Invoice Generator",
    ];

    const nodes: Node[] = [];
    const NUM_NODES = 24;

    for (let i = 0; i < NUM_NODES; i++) {
      const isHub = i < HUB_LABELS.length;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: isHub ? 5 : 2.5,
        label: isHub ? HUB_LABELS[i] : undefined,
        isHub,
      });
    }

    const packets: Packet[] = [];
    for (let i = 0; i < 7; i++) {
      packets.push({
        from: Math.floor(Math.random() * HUB_LABELS.length),
        to: Math.floor(Math.random() * HUB_LABELS.length),
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw node connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 20 || n1.x > width - 20) n1.vx *= -1;
        if (n1.y < 20 || n1.y > height - 20) n1.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.4;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw moving data packets between hub nodes
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.from = Math.floor(Math.random() * HUB_LABELS.length);
          pkt.to = Math.floor(Math.random() * HUB_LABELS.length);
        }

        const n1 = nodes[pkt.from];
        const n2 = nodes[pkt.to];
        if (n1 && n2) {
          const px = n1.x + (n2.x - n1.x) * pkt.progress;
          const py = n1.y + (n2.y - n1.y) * pkt.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00d2ff";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw nodes and labels
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isHub ? "#00d2ff" : "rgba(255, 255, 255, 0.45)";
        if (n.isHub) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00d2ff";
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (n.label) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - 10);
        }
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
