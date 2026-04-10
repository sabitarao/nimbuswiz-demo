import { useRef, useEffect, useCallback } from "react";

// --- Clean drawing primitives ---
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill?: string, stroke?: string
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color = "#94a3b8", width = 1.5, dashed = false
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  if (dashed) ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hl = 7;
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hl * Math.cos(angle - 0.35), y2 - hl * Math.sin(angle - 0.35));
  ctx.lineTo(x2 - hl * Math.cos(angle + 0.35), y2 - hl * Math.sin(angle + 0.35));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function elbowArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, midX: number, midY: number, x2: number, y2: number,
  color = "#94a3b8", width = 1.5, dashed = false
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (dashed) ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, midY);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - midY, x2 - midX);
  const hl = 7;
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hl * Math.cos(angle - 0.35), y2 - hl * Math.sin(angle - 0.35));
  ctx.lineTo(x2 - hl * Math.cos(angle + 0.35), y2 - hl * Math.sin(angle + 0.35));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function label(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  size = 12, color = "#334155", weight = "500",
  align: CanvasTextAlign = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Inter, system-ui, -apple-system, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function pill(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  bg: string, fg: string, size = 9
) {
  ctx.font = `600 ${size}px Inter, system-ui, sans-serif`;
  const w = ctx.measureText(text).width + 12;
  const h = size + 8;
  roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2, bg);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

// --- Mini wireframe icons (clean/geometric) ---
function iconDashboard(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.2;
  // 4 cards grid
  roundRect(ctx, cx - 16, cy - 12, 14, 10, 2, "#e2e8f0", "#cbd5e1");
  roundRect(ctx, cx + 2, cy - 12, 14, 10, 2, "#e2e8f0", "#cbd5e1");
  roundRect(ctx, cx - 16, cy + 2, 14, 10, 2, "#e2e8f0", "#cbd5e1");
  roundRect(ctx, cx + 2, cy + 2, 14, 10, 2, "#e2e8f0", "#cbd5e1");
  // mini bar in first card
  ctx.fillStyle = "#818cf8";
  ctx.fillRect(cx - 14, cy - 5, 3, 4);
  ctx.fillRect(cx - 10, cy - 7, 3, 6);
  ctx.fillRect(cx - 6, cy - 9, 3, 8);
  ctx.restore();
}

function iconList(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const ly = cy - 10 + i * 10;
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(cx - 16, ly, 32, 7);
    ctx.strokeRect(cx - 16, ly, 32, 7);
    ctx.fillStyle = "#818cf8";
    ctx.beginPath(); ctx.arc(cx - 12, ly + 3.5, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function iconForm(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const ly = cy - 12 + i * 9;
    roundRect(ctx, cx - 14, ly, 28, 6, 1.5, "#f8fafc", "#cbd5e1");
  }
  roundRect(ctx, cx - 6, cy + 16, 18, 7, 2, "#818cf8");
  ctx.fillStyle = "#fff"; ctx.font = "600 5px Inter, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("SAVE", cx + 3, cy + 19.5);
  ctx.restore();
}

function iconDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  roundRect(ctx, cx - 16, cy - 14, 32, 8, 2, "#e0e7ff", "#c7d2fe");
  ctx.fillStyle = "#94a3b8"; ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(cx - 16, cy + i * 7, 12, 4);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(cx, cy + i * 7, 16, 4);
  }
  ctx.restore();
}

function iconGauge(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 12, Math.PI, 0); ctx.stroke();
  // colored arc
  ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, 12, Math.PI, Math.PI + Math.PI * 0.7); ctx.stroke();
  // needle
  ctx.strokeStyle = "#334155"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 6, cy - 8); ctx.stroke();
  ctx.fillStyle = "#334155";
  ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function iconBulb(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#eab308"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy - 4, 9, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#fef9c3";
  ctx.beginPath(); ctx.arc(cx, cy - 4, 9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#eab308";
  ctx.beginPath(); ctx.arc(cx, cy - 4, 9, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 4, cy + 5); ctx.lineTo(cx + 4, cy + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 3, cy + 8); ctx.lineTo(cx + 3, cy + 8); ctx.stroke();
  // rays
  ctx.lineWidth = 1;
  const rays = 6;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + 12 * Math.cos(a), cy - 4 + 12 * Math.sin(a));
    ctx.lineTo(cx + 15 * Math.cos(a), cy - 4 + 15 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();
}

function iconWrench(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  // progress bar
  roundRect(ctx, cx - 16, cy - 10, 32, 6, 3, "#e2e8f0", "#cbd5e1");
  ctx.fillStyle = "#818cf8";
  roundRect(ctx, cx - 16, cy - 10, 20, 6, 3);
  // gear icon below
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.arc(cx, cy + 8, 6, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy + 8, 2, 0, Math.PI * 2); ctx.stroke();
  // gear teeth
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + 6 * Math.cos(a), cy + 8 + 6 * Math.sin(a));
    ctx.lineTo(cx + 8 * Math.cos(a), cy + 8 + 8 * Math.sin(a));
    ctx.stroke();
  }
  ctx.restore();
}

function iconRocket(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.fillStyle = "#e0e7ff";
  ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 14);
  ctx.quadraticCurveTo(cx + 8, cy - 6, cx + 6, cy + 8);
  ctx.lineTo(cx - 6, cy + 8);
  ctx.quadraticCurveTo(cx - 8, cy - 6, cx, cy - 14);
  ctx.fill(); ctx.stroke();
  // window
  ctx.fillStyle = "#818cf8";
  ctx.beginPath(); ctx.arc(cx, cy - 4, 3, 0, Math.PI * 2); ctx.fill();
  // flames
  ctx.fillStyle = "#fb923c";
  ctx.beginPath();
  ctx.moveTo(cx - 4, cy + 8); ctx.lineTo(cx, cy + 14); ctx.lineTo(cx + 4, cy + 8);
  ctx.fill();
  ctx.restore();
}

function iconPulse(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy);
  ctx.lineTo(cx - 8, cy);
  ctx.lineTo(cx - 4, cy - 10);
  ctx.lineTo(cx + 2, cy + 8);
  ctx.lineTo(cx + 6, cy - 4);
  ctx.lineTo(cx + 10, cy);
  ctx.lineTo(cx + 16, cy);
  ctx.stroke();
  ctx.restore();
}

function iconSearch(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx - 2, cy - 2, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + 4, cy + 4); ctx.lineTo(cx + 10, cy + 10); ctx.stroke();
  // x mark
  ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx - 5, cy - 5); ctx.lineTo(cx + 1, cy + 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 1, cy - 5); ctx.lineTo(cx - 5, cy + 1); ctx.stroke();
  ctx.restore();
}

// --- Screen card ---
interface CardDef {
  x: number; y: number; w: number; h: number;
  route: string;
  title: string;
  desc: string;
  accentColor: string;
  bgColor: string;
  icon: (ctx: CanvasRenderingContext2D, cx: number, cy: number) => void;
}

function drawScreenCard(ctx: CanvasRenderingContext2D, c: CardDef) {
  // Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.06)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, c.x, c.y, c.w, c.h, 8, "#ffffff");
  ctx.restore();
  // Border
  roundRect(ctx, c.x, c.y, c.w, c.h, 8, undefined, "#e2e8f0");
  // Accent top bar
  ctx.fillStyle = c.accentColor;
  ctx.beginPath();
  ctx.roundRect(c.x, c.y, c.w, 4, [8, 8, 0, 0]);
  ctx.fill();
  // Icon area
  const iconBgY = c.y + 14;
  roundRect(ctx, c.x + (c.w - 44) / 2, iconBgY, 44, 36, 6, c.bgColor);
  c.icon(ctx, c.x + c.w / 2, iconBgY + 18);
  // Title
  label(ctx, c.title, c.x + c.w / 2, c.y + 62, 11, "#0f172a", "600");
  // Route
  label(ctx, c.route, c.x + c.w / 2, c.y + 76, 9, "#94a3b8", "400");
  // Desc
  const descLines = wrapText(ctx, c.desc, c.w - 16, 9);
  descLines.forEach((line, i) => {
    label(ctx, line, c.x + c.w / 2, c.y + 90 + i * 12, 9, "#64748b", "400");
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number): string[] {
  ctx.font = `400 ${size}px Inter, system-ui, sans-serif`;
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width > maxW) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// --- Utility card (smaller) ---
interface UtilDef {
  x: number; y: number; w: number; h: number;
  title: string; desc: string; iconChar: string;
}

function drawUtilCard(ctx: CanvasRenderingContext2D, u: UtilDef) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.04)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  roundRect(ctx, u.x, u.y, u.w, u.h, 6, "#ffffff");
  ctx.restore();
  roundRect(ctx, u.x, u.y, u.w, u.h, 6, undefined, "#e2e8f0");
  // icon circle
  ctx.fillStyle = "#f1f5f9";
  ctx.beginPath(); ctx.arc(u.x + 24, u.y + u.h / 2, 14, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(u.x + 24, u.y + u.h / 2, 14, 0, Math.PI * 2); ctx.stroke();
  label(ctx, u.iconChar, u.x + 24, u.y + u.h / 2, 14, "#64748b", "400");
  // text
  label(ctx, u.title, u.x + 46, u.y + u.h / 2 - 7, 10, "#0f172a", "600", "left");
  label(ctx, u.desc, u.x + 46, u.y + u.h / 2 + 7, 9, "#94a3b8", "400", "left");
}

// === MAIN COMPONENT ===
export default function ScreenFlowPro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 1100;
    const H = 1340;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    // === HEADER ===
    roundRect(ctx, 0, 0, W, 72, 0, "#0f172a");
    label(ctx, "NimbusWiz", 40, 28, 20, "#ffffff", "700", "left");
    label(ctx, "Platform Screen Flow", 40, 48, 12, "#94a3b8", "400", "left");
    label(ctx, "Decision platform for preserving and modernizing legacy Nimbus2000-class systems", W - 40, 28, 10, "#64748b", "400", "right");
    // version pill
    pill(ctx, "v3.0", W - 40, 50, "#1e293b", "#94a3b8", 8);

    // === ONBOARDING ===
    const obY = 100;
    roundRect(ctx, W / 2 - 120, obY, 240, 36, 18, "#f0f9ff", "#bae6fd");
    label(ctx, "First Run Setup + Onboarding Tour", W / 2, obY + 18, 11, "#0369a1", "500");
    arrow(ctx, W / 2, obY + 36, W / 2, obY + 58, "#0ea5e9", 1.2);
    label(ctx, "one-time", W / 2 + 16, obY + 48, 8, "#7dd3fc");

    // === ROW 1: DASHBOARD ===
    const cW = 140;
    const cH = 114;

    const dashCard: CardDef = {
      x: W / 2 - cW / 2, y: obY + 62, w: cW, h: cH,
      route: "/", title: "Dashboard", desc: "Fleet overview, KPIs, and quick navigation",
      accentColor: "#22c55e", bgColor: "#f0fdf4", icon: iconDashboard,
    };
    drawScreenCard(ctx, dashCard);

    // === ROW 2: SYSTEMS LIST + REGISTER ===
    const r2Y = dashCard.y + cH + 64;
    const listCard: CardDef = {
      x: W / 2 - cW - 40, y: r2Y, w: cW, h: cH,
      route: "/systems", title: "Systems Registry", desc: "Browse, search, and filter all registered systems",
      accentColor: "#6366f1", bgColor: "#eef2ff", icon: iconList,
    };
    const regCard: CardDef = {
      x: W / 2 + 40, y: r2Y, w: cW, h: cH,
      route: "Modal", title: "Register System", desc: "Onboard a new system with metadata and certification",
      accentColor: "#f59e0b", bgColor: "#fffbeb", icon: iconForm,
    };
    drawScreenCard(ctx, listCard);
    drawScreenCard(ctx, regCard);

    // Dash -> List
    arrow(ctx, dashCard.x + 30, dashCard.y + cH, listCard.x + cW / 2, r2Y, "#6366f1");
    // Dash -> Register (or list -> register)
    arrow(ctx, listCard.x + cW, listCard.y + cH / 2, regCard.x, regCard.y + cH / 2, "#f59e0b");
    pill(ctx, "NEW", (listCard.x + cW + regCard.x) / 2, listCard.y + cH / 2 - 12, "#fef3c7", "#92400e", 8);

    // Register -> List (dashed back)
    arrow(ctx, regCard.x + 30, regCard.y + cH, listCard.x + cW - 10, listCard.y + cH, "#94a3b8", 1.2, true);

    // === ROW 3: SYSTEM DETAIL ===
    const r3Y = r2Y + cH + 64;
    const detailCard: CardDef = {
      x: W / 2 - cW / 2, y: r3Y, w: cW, h: cH,
      route: "/systems/:id", title: "System Detail", desc: "Full profile, service history, and action hub",
      accentColor: "#6366f1", bgColor: "#eef2ff", icon: iconDetail,
    };
    drawScreenCard(ctx, detailCard);

    // List -> Detail
    arrow(ctx, listCard.x + cW / 2, listCard.y + cH, detailCard.x + 40, r3Y, "#6366f1");
    pill(ctx, "SELECT", listCard.x + cW / 2 - 34, (listCard.y + cH + r3Y) / 2, "#eef2ff", "#4338ca", 7);

    // === PIPELINE ZONE ===
    const pipeY = r3Y + cH + 50;
    const pipeH = 530;
    // Pipeline background
    roundRect(ctx, 50, pipeY, W - 100, pipeH, 12, "#f8fafc", "#cbd5e1");
    // Pipeline header
    roundRect(ctx, 50, pipeY, W - 100, 32, [12, 12, 0, 0], "#eef2ff");
    label(ctx, "MODERNIZATION PIPELINE", W / 2, pipeY + 16, 11, "#4338ca", "700");
    // step indicators
    const stepsLabels = ["ASSESS", "ADVISE", "UPGRADE", "DEPLOY", "MONITOR"];
    const stepW = 80;
    const stepGap = 30;
    const stepsStartX = W / 2 - ((stepsLabels.length * stepW + (stepsLabels.length - 1) * stepGap) / 2);
    stepsLabels.forEach((s, i) => {
      const sx = stepsStartX + i * (stepW + stepGap);
      // step number circle
      ctx.fillStyle = "#818cf8";
      ctx.beginPath(); ctx.arc(sx + stepW / 2, pipeY + 52, 10, 0, Math.PI * 2); ctx.fill();
      label(ctx, String(i + 1), sx + stepW / 2, pipeY + 52, 10, "#ffffff", "700");
      label(ctx, s, sx + stepW / 2, pipeY + 68, 8, "#6366f1", "600");
      if (i < stepsLabels.length - 1) {
        arrow(ctx, sx + stepW / 2 + 12, pipeY + 52, sx + stepW + stepGap - stepW / 2 + stepW / 2 - 12, pipeY + 52, "#c7d2fe", 1.2);
      }
    });

    // --- Pipeline Row 1: Assess + Advise + Troubleshoot ---
    const pr1Y = pipeY + 90;
    const pCardW = 150;
    const pCardH = cH;

    const assessCard: CardDef = {
      x: 130, y: pr1Y, w: pCardW, h: pCardH,
      route: "/assessment", title: "System Assessment", desc: "Compatibility scoring, risk analysis, dependency map",
      accentColor: "#6366f1", bgColor: "#eef2ff", icon: iconGauge,
    };
    const adviseCard: CardDef = {
      x: 400, y: pr1Y, w: pCardW, h: pCardH,
      route: "/advisor", title: "Modernization Advisor", desc: "AI-driven upgrade recommendations and path options",
      accentColor: "#eab308", bgColor: "#fefce8", icon: iconBulb,
    };
    const troubleCard: CardDef = {
      x: 730, y: pr1Y, w: pCardW, h: pCardH,
      route: "/troubleshooting", title: "Troubleshooting", desc: "Diagnose failures, resolve blockers, guided fixes",
      accentColor: "#ef4444", bgColor: "#fef2f2", icon: iconSearch,
    };
    drawScreenCard(ctx, assessCard);
    drawScreenCard(ctx, adviseCard);
    drawScreenCard(ctx, troubleCard);

    // Detail -> Assess
    arrow(ctx, detailCard.x + cW / 2, detailCard.y + cH, assessCard.x + pCardW / 2, pr1Y - 16, "#6366f1");
    arrow(ctx, assessCard.x + pCardW / 2, pr1Y - 16, assessCard.x + pCardW / 2, pr1Y, "#6366f1");

    // Assess -> Advise
    arrow(ctx, assessCard.x + pCardW, assessCard.y + pCardH / 2, adviseCard.x, adviseCard.y + pCardH / 2, "#22c55e", 1.8);
    pill(ctx, "PASS", (assessCard.x + pCardW + adviseCard.x) / 2, assessCard.y + pCardH / 2 - 12, "#dcfce7", "#166534", 8);

    // Assess -> Trouble
    arrow(ctx, assessCard.x + pCardW, assessCard.y + pCardH - 16, troubleCard.x, troubleCard.y + pCardH / 2, "#ef4444", 1.4);
    pill(ctx, "FAIL", (assessCard.x + pCardW + troubleCard.x) / 2 + 20, assessCard.y + pCardH - 4, "#fee2e2", "#991b1b", 8);

    // Trouble -> loop back to Assess
    elbowArrow(ctx,
      troubleCard.x + pCardW / 2, troubleCard.y + pCardH,
      troubleCard.x + pCardW / 2, pr1Y + pCardH + 30,
      assessCard.x + pCardW / 2, pr1Y + pCardH,
      "#ef4444", 1.2, true
    );
    label(ctx, "Resolved: re-assess", (assessCard.x + troubleCard.x + pCardW) / 2, pr1Y + pCardH + 38, 9, "#ef4444", "500");

    // --- Pipeline Row 2: Modernize ---
    const pr2Y = pr1Y + pCardH + 60;
    const modCard: CardDef = {
      x: 280, y: pr2Y, w: pCardW, h: pCardH,
      route: "/modernization", title: "Modernization", desc: "Configure upgrade, preview with dry run, execute",
      accentColor: "#6366f1", bgColor: "#eef2ff", icon: iconWrench,
    };
    drawScreenCard(ctx, modCard);

    // Advise -> Mod
    arrow(ctx, adviseCard.x + pCardW / 2, adviseCard.y + pCardH, modCard.x + pCardW / 2, pr2Y, "#6366f1");

    // Dry run annotation
    roundRect(ctx, modCard.x + pCardW + 20, pr2Y + 10, 140, 44, 6, "#fffbeb", "#fde68a");
    label(ctx, "Preview / Dry Run", modCard.x + pCardW + 90, pr2Y + 26, 10, "#92400e", "600");
    label(ctx, "Non-destructive validation", modCard.x + pCardW + 90, pr2Y + 40, 9, "#a16207", "400");
    arrow(ctx, modCard.x + pCardW, modCard.y + 30, modCard.x + pCardW + 20, pr2Y + 32, "#f59e0b", 1.2);

    // --- Pipeline Row 3: Deploy + Monitor ---
    const pr3Y = pr2Y + pCardH + 52;
    const deployCard: CardDef = {
      x: 160, y: pr3Y, w: pCardW, h: pCardH,
      route: "/deployment", title: "Deployment", desc: "Staged rollout, progress tracking, rollback options",
      accentColor: "#6366f1", bgColor: "#eef2ff", icon: iconRocket,
    };
    const monCard: CardDef = {
      x: 480, y: pr3Y, w: pCardW, h: pCardH,
      route: "/monitoring", title: "Monitoring", desc: "Real-time health, performance metrics, alerts",
      accentColor: "#22c55e", bgColor: "#f0fdf4", icon: iconPulse,
    };
    drawScreenCard(ctx, deployCard);
    drawScreenCard(ctx, monCard);

    // Mod -> Deploy
    arrow(ctx, modCard.x + 20, modCard.y + pCardH, deployCard.x + pCardW / 2, pr3Y, "#6366f1");

    // Deploy -> Monitor
    arrow(ctx, deployCard.x + pCardW, deployCard.y + pCardH / 2, monCard.x, monCard.y + pCardH / 2, "#22c55e", 1.8);
    pill(ctx, "LIVE", (deployCard.x + pCardW + monCard.x) / 2, deployCard.y + pCardH / 2 - 12, "#dcfce7", "#166534", 8);

    // Completion badge
    const doneX = monCard.x + pCardW + 40;
    const doneY = monCard.y + pCardH / 2;
    roundRect(ctx, doneX, doneY - 22, 120, 44, 8, "#f0fdf4", "#86efac");
    ctx.fillStyle = "#22c55e";
    ctx.beginPath(); ctx.arc(doneX + 20, doneY, 10, 0, Math.PI * 2); ctx.fill();
    // checkmark
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(doneX + 16, doneY); ctx.lineTo(doneX + 19, doneY + 4); ctx.lineTo(doneX + 25, doneY - 4); ctx.stroke();
    label(ctx, "System", doneX + 72, doneY - 7, 11, "#166534", "600");
    label(ctx, "Modernized", doneX + 72, doneY + 7, 11, "#166534", "600");
    arrow(ctx, monCard.x + pCardW, doneY, doneX, doneY, "#22c55e", 1.4);

    // === UTILITY BAR ===
    const utilY = pipeY + pipeH + 40;
    roundRect(ctx, 50, utilY, W - 100, 100, 10, "#ffffff", "#e2e8f0");
    roundRect(ctx, 50, utilY, W - 100, 28, [10, 10, 0, 0], "#f1f5f9");
    label(ctx, "GLOBAL UTILITIES", 76, utilY + 14, 9, "#64748b", "700", "left");
    label(ctx, "Accessible from sidebar navigation on every screen", 400, utilY + 14, 9, "#94a3b8", "400", "left");

    const utils: UtilDef[] = [
      { x: 72, y: utilY + 40, w: 186, h: 44, title: "Settings", desc: "Team, org, notifications", iconChar: "\u2699" },
      { x: 278, y: utilY + 40, w: 186, h: 44, title: "API Integrations", desc: "Keys, endpoints, webhooks", iconChar: "\u21C4" },
      { x: 484, y: utilY + 40, w: 186, h: 44, title: "Automation", desc: "Rules, triggers, schedules", iconChar: "\u26A1" },
      { x: 690, y: utilY + 40, w: 186, h: 44, title: "Audit Logs", desc: "Timestamped action history", iconChar: "\u2637" },
    ];
    utils.forEach(u => drawUtilCard(ctx, u));

    // Glossary popup
    roundRect(ctx, 900, utilY + 40, 120, 44, 6, "#faf5ff", "#e9d5ff");
    label(ctx, "Glossary", 960, utilY + 56, 10, "#7c3aed", "600");
    label(ctx, "Modal overlay", 960, utilY + 70, 9, "#a78bfa", "400");

    // === LEGEND ===
    const legY = utilY + 118;
    roundRect(ctx, 50, legY, W - 100, 50, 8, "#f8fafc", "#e2e8f0");

    const legItems: { x: number; color: string; dashed: boolean; lbl: string }[] = [
      { x: 80, color: "#6366f1", dashed: false, lbl: "Primary flow" },
      { x: 260, color: "#22c55e", dashed: false, lbl: "Success path" },
      { x: 440, color: "#ef4444", dashed: false, lbl: "Error / failure" },
      { x: 610, color: "#94a3b8", dashed: true, lbl: "Return / optional" },
      { x: 800, color: "#f59e0b", dashed: false, lbl: "Modal / preview" },
    ];
    legItems.forEach(l => {
      arrow(ctx, l.x, legY + 25, l.x + 30, legY + 25, l.color, 1.8, l.dashed);
      label(ctx, l.lbl, l.x + 36, legY + 25, 10, "#475569", "500", "left");
    });

    // Footer
    label(ctx, "NimbusWiz Platform Architecture", 40, H - 20, 9, "#cbd5e1", "400", "left");
    label(ctx, "16 screens + 2 modals", W - 40, H - 20, 9, "#cbd5e1", "400", "right");
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-8">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-xl"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}
