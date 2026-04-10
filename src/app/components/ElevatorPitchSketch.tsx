import { useRef, useEffect, useCallback } from "react";

// Hand-sketch style helpers
function jitter(v: number, amount = 2): number {
  return v + (Math.random() - 0.5) * amount;
}

function sketchLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.beginPath();
  ctx.moveTo(jitter(x1), jitter(y1));
  // slightly wobbly midpoint
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 3;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 3;
  ctx.quadraticCurveTo(mx, my, jitter(x2), jitter(y2));
  ctx.stroke();
}

function sketchRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill?: string
) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
  }
  sketchLine(ctx, x, y, x + w, y);
  sketchLine(ctx, x + w, y, x + w, y + h);
  sketchLine(ctx, x + w, y + h, x, y + h);
  sketchLine(ctx, x, y + h, x, y);
}

function sketchRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill?: string
) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
  }
  // draw slightly wobbly rounded rect via lines
  const r = 10;
  sketchLine(ctx, x + r, y, x + w - r, y);
  sketchLine(ctx, x + w, y + r, x + w, y + h - r);
  sketchLine(ctx, x + w - r, y + h, x + r, y + h);
  sketchLine(ctx, x, y + h - r, x, y + r);
  // corners as tiny arcs
  ctx.beginPath();
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, Math.PI, (3 * Math.PI) / 2);
  ctx.stroke();
}

function sketchArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  sketchLine(ctx, x1, y1, x2, y2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 10;
  sketchLine(
    ctx,
    x2,
    y2,
    x2 - headLen * Math.cos(angle - 0.4),
    y2 - headLen * Math.sin(angle - 0.4)
  );
  sketchLine(
    ctx,
    x2,
    y2,
    x2 - headLen * Math.cos(angle + 0.4),
    y2 - headLen * Math.sin(angle + 0.4)
  );
}

function sketchDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  fill?: string
) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h / 2);
    ctx.lineTo(cx + w / 2, cy);
    ctx.lineTo(cx, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy);
    ctx.closePath();
    ctx.fill();
  }
  sketchLine(ctx, cx, cy - h / 2, cx + w / 2, cy);
  sketchLine(ctx, cx + w / 2, cy, cx, cy + h / 2);
  sketchLine(ctx, cx, cy + h / 2, cx - w / 2, cy);
  sketchLine(ctx, cx - w / 2, cy, cx, cy - h / 2);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size = 14,
  color = "#1a1a1a",
  align: CanvasTextAlign = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Segoe Print', 'Comic Sans MS', 'Patrick Hand', cursive`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

export default function ElevatorPitchSketch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 960;
    const H = 820;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Background - slightly off-white like paper
    ctx.fillStyle = "#faf8f4";
    ctx.fillRect(0, 0, W, H);

    // Grid dots for graph-paper feel
    ctx.fillStyle = "#e0ddd6";
    for (let gx = 20; gx < W; gx += 20) {
      for (let gy = 20; gy < H; gy += 20) {
        ctx.fillRect(gx, gy, 1, 1);
      }
    }

    // Sketch style
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    // Title
    drawText(ctx, "NimbusWiz", W / 2, 32, 28, "#1a1a1a");
    drawText(
      ctx,
      '"Keep what you love. Make it modern."',
      W / 2,
      58,
      14,
      "#666"
    );

    // --- CORE PIPELINE (horizontal flow) ---
    const pipeY = 160;
    const boxW = 120;
    const boxH = 56;
    const gap = 30;
    const startX = 60;

    const steps = [
      { label: "Register\nSystem", sub: "tell us about it", fill: "#e8f0fe" },
      { label: "Assess", sub: "health checkup", fill: "#e8f0fe" },
      { label: "Advise", sub: "smart plan", fill: "#e8f0fe" },
      { label: "Modernize", sub: "do the upgrades", fill: "#e8f0fe" },
      { label: "Deploy", sub: "ship it", fill: "#e8f0fe" },
      { label: "Monitor", sub: "watch it fly", fill: "#e8f0fe" },
    ];

    // Draw step boxes
    steps.forEach((step, i) => {
      const x = startX + i * (boxW + gap);
      sketchRoundRect(ctx, x, pipeY, boxW, boxH, step.fill);
      const lines = step.label.split("\n");
      if (lines.length === 2) {
        drawText(ctx, lines[0], x + boxW / 2, pipeY + 18, 13, "#1a1a1a");
        drawText(ctx, lines[1], x + boxW / 2, pipeY + 34, 13, "#1a1a1a");
      } else {
        drawText(ctx, step.label, x + boxW / 2, pipeY + 22, 14, "#1a1a1a");
      }
      drawText(
        ctx,
        step.sub,
        x + boxW / 2,
        pipeY + boxH + 14,
        11,
        "#888"
      );

      // Arrow to next
      if (i < steps.length - 1) {
        const ax1 = x + boxW + 2;
        const ax2 = x + boxW + gap - 2;
        sketchArrow(ctx, ax1, pipeY + boxH / 2, ax2, pipeY + boxH / 2);
      }
    });

    // Pipeline label
    ctx.save();
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    sketchRect(ctx, startX - 12, pipeY - 24, 6 * (boxW + gap) - gap + 24, boxH + 58);
    ctx.restore();
    drawText(ctx, "CORE PIPELINE", startX + 20, pipeY - 32, 11, "#999", "left");

    // --- DECISION DIAMONDS ---
    const decY = 310;

    // Decision 1: after Assess
    const d1x = startX + 1 * (boxW + gap) + boxW / 2;
    sketchDiamond(ctx, d1x, decY, 100, 60, "#fff7e0");
    drawText(ctx, "Pass?", d1x, decY, 12);

    // Arrow from Assess down to diamond
    sketchArrow(ctx, d1x, pipeY + boxH, d1x, decY - 30);

    // Yes arrow - back up to Advise
    const advX = startX + 2 * (boxW + gap) + boxW / 2;
    sketchArrow(ctx, d1x + 50, decY, advX, pipeY + boxH);
    drawText(ctx, "yes", d1x + 40, decY - 18, 11, "#2d7d2d");

    // No arrow - down to Troubleshoot
    const troubleY = 400;
    sketchArrow(ctx, d1x, decY + 30, d1x, troubleY);
    drawText(ctx, "no", d1x + 10, decY + 42, 11, "#c0392b");
    sketchRoundRect(ctx, d1x - 60, troubleY, 120, 44, "#fde8e8");
    drawText(ctx, "Troubleshoot", d1x, troubleY + 16, 12);
    drawText(ctx, "fix blockers", d1x, troubleY + 32, 10, "#888");

    // Loop arrow back from troubleshoot to assess
    const assessX = startX + 1 * (boxW + gap);
    ctx.save();
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 3]);
    sketchLine(ctx, d1x - 60, troubleY + 22, assessX - 16, troubleY + 22);
    sketchLine(ctx, assessX - 16, troubleY + 22, assessX - 16, pipeY + boxH / 2);
    sketchArrow(ctx, assessX - 16, pipeY + boxH / 2, assessX, pipeY + boxH / 2);
    ctx.restore();
    drawText(ctx, "re-assess", assessX - 30, troubleY + 38, 10, "#c0392b");

    // Decision 2: after Modernize (dry run)
    const d2x = startX + 3 * (boxW + gap) + boxW / 2;
    sketchDiamond(ctx, d2x, decY, 110, 60, "#fff7e0");
    drawText(ctx, "Dry run", d2x, decY - 8, 11);
    drawText(ctx, "pass?", d2x, decY + 8, 11);

    sketchArrow(ctx, d2x, pipeY + boxH, d2x, decY - 30);

    // Yes to Deploy
    const depX = startX + 4 * (boxW + gap) + boxW / 2;
    sketchArrow(ctx, d2x + 55, decY, depX, pipeY + boxH);
    drawText(ctx, "yes", d2x + 48, decY - 18, 11, "#2d7d2d");

    // No - loop back
    drawText(ctx, "no: revise", d2x, decY + 44, 10, "#c0392b");
    ctx.save();
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 3]);
    const modLeft = startX + 3 * (boxW + gap) - 14;
    sketchLine(ctx, d2x, decY + 30, d2x, decY + 56);
    sketchLine(ctx, d2x, decY + 56, modLeft, decY + 56);
    sketchLine(ctx, modLeft, decY + 56, modLeft, pipeY + boxH / 2);
    sketchArrow(ctx, modLeft, pipeY + boxH / 2, modLeft + 14, pipeY + boxH / 2);
    ctx.restore();

    // --- UTILITY SCREENS (bottom section) ---
    const utilY = 520;
    drawText(ctx, "UTILITY SCREENS (sidebar nav, always accessible)", W / 2, utilY - 16, 12, "#999");

    ctx.save();
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    sketchRect(ctx, 60, utilY, W - 120, 130);
    ctx.restore();

    const utils = [
      { label: "Settings", sub: "team + org" },
      { label: "API Keys", sub: "integrations" },
      { label: "Automation", sub: "rules + triggers" },
      { label: "Audit Logs", sub: "who did what" },
      { label: "Glossary", sub: "modal overlay" },
    ];

    const uBoxW = 130;
    const uGap = 22;
    const uStartX = (W - (utils.length * uBoxW + (utils.length - 1) * uGap)) / 2;

    utils.forEach((u, i) => {
      const x = uStartX + i * (uBoxW + uGap);
      sketchRect(ctx, x, utilY + 20, uBoxW, 50, "#f4f4f0");
      drawText(ctx, u.label, x + uBoxW / 2, utilY + 38, 13, "#1a1a1a");
      drawText(ctx, u.sub, x + uBoxW / 2, utilY + 56, 10, "#888");
    });

    // Onboarding callout
    const obY = utilY + 100;
    drawText(ctx, "* First visit: Setup Wizard + Onboarding Tour overlay", W / 2, obY, 11, "#aaa");

    // --- DASHBOARD hub at top ---
    const dashX = W / 2 - 70;
    const dashY = 86;
    sketchRoundRect(ctx, dashX, dashY, 140, 40, "#d4edda");
    drawText(ctx, "Dashboard", W / 2, dashY + 20, 14, "#1a1a1a");
    drawText(ctx, "(home / hub)", W / 2, dashY + 44, 10, "#888");

    // Arrows from dashboard to pipeline entry points
    ctx.save();
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1.2;
    // to Register
    sketchArrow(ctx, dashX + 10, dashY + 40, startX + boxW / 2, pipeY);
    // to Assess
    sketchArrow(ctx, dashX + 60, dashY + 40, startX + (boxW + gap) + boxW / 2, pipeY);
    // to Advise
    sketchArrow(ctx, dashX + 110, dashY + 40, startX + 2 * (boxW + gap) + boxW / 2, pipeY);
    ctx.restore();

    // --- "THE PITCH" annotation ---
    const pitchY = 700;
    ctx.save();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    sketchLine(ctx, 100, pitchY - 10, W - 100, pitchY - 10);
    ctx.restore();

    drawText(ctx, "THE PITCH", W / 2, pitchY + 14, 16, "#333");
    drawText(
      ctx,
      "Old system still flying? Don't junk it.",
      W / 2,
      pitchY + 40,
      14,
      "#555"
    );
    drawText(
      ctx,
      "Register --> Checkup --> Plan --> Upgrade --> Ship --> Watch.",
      W / 2,
      pitchY + 62,
      13,
      "#555"
    );
    drawText(
      ctx,
      "If something fails, loop back. Everything logged. Team stays in sync.",
      W / 2,
      pitchY + 84,
      13,
      "#555"
    );

    // Small pencil icon in corner
    drawText(ctx, "// sketched on a napkin", W - 20, H - 16, 10, "#ccc", "right");
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded shadow-md border border-gray-200"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}
