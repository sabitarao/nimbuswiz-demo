import { useRef, useEffect, useCallback } from "react";

// --- Sketch primitives ---
function jitter(v: number, amt = 2): number {
  return v + (Math.random() - 0.5) * amt;
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
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
  }
  const r = 8;
  sketchLine(ctx, x + r, y, x + w - r, y);
  sketchLine(ctx, x + w, y + r, x + w, y + h - r);
  sketchLine(ctx, x + w - r, y + h, x + r, y + h);
  sketchLine(ctx, x, y + h - r, x, y + r);
  ctx.beginPath(); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + r, y + r, r, Math.PI, (3 * Math.PI) / 2); ctx.stroke();
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
  const hl = 9;
  sketchLine(ctx, x2, y2, x2 - hl * Math.cos(angle - 0.4), y2 - hl * Math.sin(angle - 0.4));
  sketchLine(ctx, x2, y2, x2 - hl * Math.cos(angle + 0.4), y2 - hl * Math.sin(angle + 0.4));
}

function sketchCurvedArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number
) {
  ctx.beginPath();
  ctx.moveTo(jitter(x1, 1), jitter(y1, 1));
  ctx.quadraticCurveTo(jitter(cx, 2), jitter(cy, 2), jitter(x2, 1), jitter(y2, 1));
  ctx.stroke();
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const hl = 9;
  sketchLine(ctx, x2, y2, x2 - hl * Math.cos(angle - 0.4), y2 - hl * Math.sin(angle - 0.4));
  sketchLine(ctx, x2, y2, x2 - hl * Math.cos(angle + 0.4), y2 - hl * Math.sin(angle + 0.4));
}

function txt(
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

// --- Mini wireframe sketches inside each screen card ---
function drawMiniDashboard(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // tiny bar chart
  ctx.strokeStyle = "#8ab4f8";
  ctx.lineWidth = 1.2;
  sketchRect(ctx, x + 6, y + 20, 10, 16);
  sketchRect(ctx, x + 20, y + 14, 10, 22);
  sketchRect(ctx, x + 34, y + 8, 10, 28);
  // numbers row
  ctx.strokeStyle = "#bbb";
  sketchLine(ctx, x + 54, y + 10, x + 90, y + 10);
  sketchLine(ctx, x + 54, y + 20, x + 82, y + 20);
  sketchLine(ctx, x + 54, y + 30, x + 76, y + 30);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniList(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const ly = y + 6 + i * 9;
    sketchRect(ctx, x + 4, ly, 6, 6);
    sketchLine(ctx, x + 14, ly + 3, x + 70, ly + 3);
  }
  // "+" button
  ctx.strokeStyle = "#4a9d5b";
  ctx.lineWidth = 1.4;
  sketchRect(ctx, x + 76, y + 8, 18, 14);
  sketchLine(ctx, x + 85, y + 11, x + 85, y + 19);
  sketchLine(ctx, x + 81, y + 15, x + 89, y + 15);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniForm(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const ly = y + 4 + i * 12;
    sketchLine(ctx, x + 4, ly, x + 30, ly);
    sketchRect(ctx, x + 34, ly - 4, 56, 8);
  }
  // button
  ctx.strokeStyle = "#4a9d5b";
  ctx.lineWidth = 1.4;
  sketchRect(ctx, x + 50, y + 36, 36, 10, "#e6f4ea");
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniDetail(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  // header block
  sketchRect(ctx, x + 4, y + 4, 86, 12, "#eef3ff");
  // fields
  for (let i = 0; i < 2; i++) {
    sketchLine(ctx, x + 4, y + 24 + i * 10, x + 40, y + 24 + i * 10);
    sketchLine(ctx, x + 44, y + 24 + i * 10, x + 90, y + 24 + i * 10);
  }
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniCheckup(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // gauge / meter
  ctx.strokeStyle = "#8ab4f8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 30, y + 24, 16, Math.PI, 0);
  ctx.stroke();
  // needle
  ctx.strokeStyle = "#4a9d5b";
  sketchLine(ctx, x + 30, y + 24, x + 38, y + 12);
  // checklist
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  sketchLine(ctx, x + 56, y + 10, x + 90, y + 10);
  sketchLine(ctx, x + 56, y + 20, x + 86, y + 20);
  sketchLine(ctx, x + 56, y + 30, x + 82, y + 30);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniPlan(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  // lightbulb scribble
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x + 18, y + 16, 10, 0, Math.PI * 2);
  ctx.stroke();
  sketchLine(ctx, x + 14, y + 26, x + 22, y + 26);
  sketchLine(ctx, x + 15, y + 30, x + 21, y + 30);
  // recommendation lines
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  sketchLine(ctx, x + 38, y + 10, x + 90, y + 10);
  sketchLine(ctx, x + 38, y + 20, x + 84, y + 20);
  sketchLine(ctx, x + 38, y + 30, x + 78, y + 30);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniWrench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 1.4;
  // progress bar
  sketchRect(ctx, x + 4, y + 8, 86, 8);
  ctx.fillStyle = "#8ab4f8";
  ctx.fillRect(x + 5, y + 9, 52, 6);
  // steps
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  sketchLine(ctx, x + 4, y + 24, x + 50, y + 24);
  sketchLine(ctx, x + 4, y + 32, x + 44, y + 32);
  // test button
  ctx.strokeStyle = "#d4a017";
  sketchRect(ctx, x + 56, y + 24, 34, 14, "#fff7e0");
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniRocket(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // rocket shape (triangle + body)
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1.4;
  sketchLine(ctx, x + 20, y + 4, x + 10, y + 28);
  sketchLine(ctx, x + 20, y + 4, x + 30, y + 28);
  sketchLine(ctx, x + 10, y + 28, x + 30, y + 28);
  // flames
  ctx.strokeStyle = "#e67e22";
  sketchLine(ctx, x + 16, y + 28, x + 20, y + 38);
  sketchLine(ctx, x + 24, y + 28, x + 20, y + 38);
  // stages
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  sketchLine(ctx, x + 42, y + 10, x + 90, y + 10);
  sketchLine(ctx, x + 42, y + 20, x + 84, y + 20);
  sketchLine(ctx, x + 42, y + 30, x + 78, y + 30);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniMonitor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#4a9d5b";
  ctx.lineWidth = 1.4;
  // heartbeat line
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 20);
  ctx.lineTo(x + 20, y + 20);
  ctx.lineTo(x + 26, y + 8);
  ctx.lineTo(x + 32, y + 32);
  ctx.lineTo(x + 38, y + 14);
  ctx.lineTo(x + 44, y + 20);
  ctx.lineTo(x + 60, y + 20);
  ctx.stroke();
  // status dots
  ctx.fillStyle = "#4a9d5b";
  ctx.beginPath(); ctx.arc(x + 72, y + 12, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#4a9d5b";
  ctx.beginPath(); ctx.arc(x + 72, y + 24, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ddd";
  ctx.beginPath(); ctx.arc(x + 72, y + 36, 3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#bbb";
  sketchLine(ctx, x + 80, y + 12, x + 94, y + 12);
  sketchLine(ctx, x + 80, y + 24, x + 94, y + 24);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniTroubleshoot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // magnifying glass
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x + 20, y + 16, 10, 0, Math.PI * 2);
  ctx.stroke();
  sketchLine(ctx, x + 28, y + 22, x + 36, y + 32);
  // error lines
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  sketchLine(ctx, x + 44, y + 10, x + 90, y + 10);
  sketchLine(ctx, x + 44, y + 20, x + 86, y + 20);
  sketchLine(ctx, x + 44, y + 30, x + 80, y + 30);
  ctx.strokeStyle = "#2a2a2a";
}

function drawMiniToolbox(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) {
  ctx.strokeStyle = "#bbb";
  ctx.lineWidth = 1;
  // generic settings/utility screen
  if (label === "Settings") {
    // gear
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(x + 22, y + 20, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 22, y + 20, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
    sketchLine(ctx, x + 42, y + 12, x + 90, y + 12);
    sketchLine(ctx, x + 42, y + 22, x + 84, y + 22);
    sketchLine(ctx, x + 42, y + 32, x + 78, y + 32);
  } else if (label === "API Keys") {
    ctx.strokeStyle = "#888"; ctx.lineWidth = 1.4;
    // key shape
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 8, 0, Math.PI * 2); ctx.stroke();
    sketchLine(ctx, x + 24, y + 16, x + 40, y + 16);
    sketchLine(ctx, x + 34, y + 16, x + 34, y + 22);
    sketchLine(ctx, x + 38, y + 16, x + 38, y + 22);
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
    sketchLine(ctx, x + 48, y + 12, x + 90, y + 12);
    sketchLine(ctx, x + 48, y + 24, x + 86, y + 24);
  } else if (label === "Automation") {
    ctx.strokeStyle = "#888"; ctx.lineWidth = 1.4;
    // lightning bolt
    sketchLine(ctx, x + 20, y + 4, x + 12, y + 18);
    sketchLine(ctx, x + 12, y + 18, x + 22, y + 18);
    sketchLine(ctx, x + 22, y + 18, x + 14, y + 36);
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
    sketchLine(ctx, x + 38, y + 12, x + 90, y + 12);
    sketchLine(ctx, x + 38, y + 24, x + 84, y + 24);
  } else if (label === "The Diary") {
    ctx.strokeStyle = "#888"; ctx.lineWidth = 1.4;
    // book
    sketchRect(ctx, x + 8, y + 6, 28, 30);
    sketchLine(ctx, x + 22, y + 6, x + 22, y + 36);
    ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
    sketchLine(ctx, x + 44, y + 12, x + 90, y + 12);
    sketchLine(ctx, x + 44, y + 22, x + 86, y + 22);
    sketchLine(ctx, x + 44, y + 32, x + 80, y + 32);
  }
  ctx.strokeStyle = "#2a2a2a";
}

// --- Screen card component ---
interface ScreenCard {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  kidLabel: string;
  kidDesc: string;
  fill: string;
  drawInner: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
}

export default function ScreenFlowSketch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 1100;
    const H = 1380;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Paper bg
    ctx.fillStyle = "#faf8f4";
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = "#e0ddd6";
    for (let gx = 20; gx < W; gx += 20) {
      for (let gy = 20; gy < H; gy += 20) {
        ctx.fillRect(gx, gy, 1, 1);
      }
    }

    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    // === TITLE ===
    txt(ctx, "NimbusWiz -- How Every Screen Connects", W / 2, 34, 24, "#1a1a1a");
    txt(ctx, "(the whole app, explained like you're 10)", W / 2, 58, 13, "#888");

    // === SCREEN CARDS ===
    const cardW = 160;
    const cardH = 110;
    const innerY = 42; // where mini wireframe starts inside card
    const innerH = 44;

    function drawCard(card: ScreenCard) {
      // Shadow
      ctx.fillStyle = "#e8e6e0";
      ctx.fillRect(card.x + 3, card.y + 3, card.w, card.h);
      // Card
      sketchRoundRect(ctx, card.x, card.y, card.w, card.h, card.fill);
      // Title bar
      ctx.fillStyle = "#00000010";
      ctx.fillRect(card.x + 1, card.y + 1, card.w - 2, 18);
      txt(ctx, card.title, card.x + card.w / 2, card.y + 11, 11, "#555");
      // Mini wireframe area
      ctx.save();
      ctx.beginPath();
      ctx.rect(card.x + 4, card.y + 20, card.w - 8, innerH + 6);
      ctx.clip();
      card.drawInner(ctx, card.x + 8, card.y + innerY);
      ctx.restore();
      // Kid label
      txt(ctx, card.kidLabel, card.x + card.w / 2, card.y + card.h + 14, 13, "#1a1a1a");
      txt(ctx, card.kidDesc, card.x + card.w / 2, card.y + card.h + 30, 10, "#888");
    }

    // --- ROW 0: First Run (special) ---
    const frX = W / 2 - 80;
    const frY = 86;
    sketchRoundRect(ctx, frX, frY, 160, 40, "#f0e6ff");
    txt(ctx, "First Time? Welcome Tour!", frX + 80, frY + 14, 12, "#1a1a1a");
    txt(ctx, "shows you around on day one", frX + 80, frY + 30, 10, "#888");

    // Arrow down to Dashboard
    sketchArrow(ctx, W / 2, frY + 40, W / 2, frY + 70);
    txt(ctx, "then you land here", W / 2 + 60, frY + 56, 10, "#aaa");

    // --- ROW 1: Dashboard ---
    const dashCard: ScreenCard = {
      x: W / 2 - cardW / 2,
      y: frY + 76,
      w: cardW + 40,
      h: cardH,
      title: "/ Dashboard",
      kidLabel: "Home Base",
      kidDesc: "see everything at a glance",
      fill: "#d4edda",
      drawInner: drawMiniDashboard,
    };
    drawCard(dashCard);

    // Annotation
    ctx.save();
    ctx.strokeStyle = "#4a9d5b";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    sketchLine(ctx, dashCard.x + dashCard.w + 8, dashCard.y + 30, dashCard.x + dashCard.w + 60, dashCard.y + 10);
    ctx.restore();
    txt(ctx, "shows quick counts,", dashCard.x + dashCard.w + 64, dashCard.y + 8, 10, "#4a9d5b", "left");
    txt(ctx, "charts, and shortcuts", dashCard.x + dashCard.w + 64, dashCard.y + 20, 10, "#4a9d5b", "left");

    // --- ROW 2: Systems List + Register ---
    const row2Y = dashCard.y + cardH + 80;
    const listCard: ScreenCard = {
      x: W / 2 - cardW - 50,
      y: row2Y,
      w: cardW,
      h: cardH,
      title: "/systems",
      kidLabel: "Your Collection",
      kidDesc: "all your old systems in a list",
      fill: "#e8f0fe",
      drawInner: drawMiniList,
    };
    const regCard: ScreenCard = {
      x: W / 2 + 50,
      y: row2Y,
      w: cardW,
      h: cardH,
      title: "Register (popup)",
      kidLabel: "Add a New One",
      kidDesc: "fill in what you know about it",
      fill: "#fef3e0",
      drawInner: drawMiniForm,
    };
    drawCard(listCard);
    drawCard(regCard);

    // Dashboard -> List
    sketchArrow(ctx, dashCard.x + 40, dashCard.y + cardH, listCard.x + cardW / 2, row2Y);
    txt(ctx, '"show me my systems"', listCard.x + cardW / 2, row2Y - 16, 10, "#666");

    // List -> Register
    sketchArrow(ctx, listCard.x + cardW, listCard.y + cardH / 2, regCard.x, regCard.y + cardH / 2);
    txt(ctx, 'click "+"', (listCard.x + cardW + regCard.x) / 2, listCard.y + cardH / 2 - 12, 10, "#666");

    // Register -> back to List (dashed)
    ctx.save();
    ctx.strokeStyle = "#aaa";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.2;
    sketchArrow(ctx, regCard.x + 20, regCard.y + cardH, listCard.x + cardW - 20, listCard.y + cardH);
    ctx.restore();
    txt(ctx, "saved! back to list", (listCard.x + cardW + regCard.x) / 2, regCard.y + cardH + 10, 9, "#aaa");

    // --- ROW 3: System Detail ---
    const row3Y = row2Y + cardH + 80;
    const detailCard: ScreenCard = {
      x: W / 2 - cardW / 2 - 20,
      y: row3Y,
      w: cardW + 40,
      h: cardH,
      title: "/systems/:id",
      kidLabel: "Look Closer",
      kidDesc: "everything about ONE system",
      fill: "#e8f0fe",
      drawInner: drawMiniDetail,
    };
    drawCard(detailCard);

    // List -> Detail
    sketchArrow(ctx, listCard.x + cardW / 2, listCard.y + cardH, detailCard.x + 40, row3Y);
    txt(ctx, "click a system", listCard.x + cardW / 2 - 50, (listCard.y + cardH + row3Y) / 2, 10, "#666");

    // Dashboard -> Detail
    sketchArrow(ctx, dashCard.x + dashCard.w - 30, dashCard.y + cardH, detailCard.x + detailCard.w - 30, row3Y);

    // === THE PIPELINE (Row 4-6) ===
    // Label
    const pipeStartY = row3Y + cardH + 60;
    ctx.save();
    ctx.strokeStyle = "#8ab4f8";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 4]);
    sketchRect(ctx, 40, pipeStartY - 20, W - 80, 540);
    ctx.restore();
    txt(ctx, 'THE MAIN ADVENTURE  --  "Fix My System"', W / 2, pipeStartY - 28, 14, "#4a7ab5");

    // Row 4: Assess + Advise
    const r4Y = pipeStartY + 10;
    const assessCard: ScreenCard = {
      x: 140,
      y: r4Y,
      w: cardW + 20,
      h: cardH,
      title: "/assessment",
      kidLabel: "Health Checkup",
      kidDesc: "is your system okay?",
      fill: "#e8f0fe",
      drawInner: drawMiniCheckup,
    };
    const adviseCard: ScreenCard = {
      x: 440,
      y: r4Y,
      w: cardW + 20,
      h: cardH,
      title: "/advisor",
      kidLabel: "Get a Plan",
      kidDesc: "what should we fix?",
      fill: "#e8f0fe",
      drawInner: drawMiniPlan,
    };
    const troubleCard: ScreenCard = {
      x: 760,
      y: r4Y,
      w: cardW + 20,
      h: cardH,
      title: "/troubleshooting",
      kidLabel: "Uh-Oh, Problems!",
      kidDesc: "find and fix what's broken",
      fill: "#fde8e8",
      drawInner: drawMiniTroubleshoot,
    };
    drawCard(assessCard);
    drawCard(adviseCard);
    drawCard(troubleCard);

    // Detail -> Assess
    sketchArrow(ctx, detailCard.x + detailCard.w / 2, detailCard.y + cardH, assessCard.x + assessCard.w / 2, r4Y);
    txt(ctx, '"check this system"', detailCard.x + 20, detailCard.y + cardH + 20, 10, "#666");

    // Assess -> Advise
    sketchArrow(ctx, assessCard.x + assessCard.w, assessCard.y + cardH / 2, adviseCard.x, adviseCard.y + cardH / 2);
    txt(ctx, "looks good!", (assessCard.x + assessCard.w + adviseCard.x) / 2, assessCard.y + cardH / 2 - 14, 10, "#4a9d5b");

    // Assess -> Trouble (if problems)
    ctx.save();
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 1.4;
    sketchArrow(ctx, assessCard.x + assessCard.w, assessCard.y + cardH - 10, troubleCard.x, troubleCard.y + cardH / 2);
    ctx.restore();
    txt(ctx, "problems found!", (assessCard.x + assessCard.w + troubleCard.x) / 2, assessCard.y + cardH + 6, 10, "#c0392b");

    // Trouble -> back to Assess (loop)
    ctx.save();
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    sketchCurvedArrow(ctx,
      troubleCard.x + troubleCard.w / 2, troubleCard.y + cardH,
      troubleCard.x - 100, troubleCard.y + cardH + 50,
      assessCard.x + assessCard.w / 2, assessCard.y + cardH
    );
    ctx.restore();
    txt(ctx, "fixed it! try again", (assessCard.x + troubleCard.x) / 2, r4Y + cardH + 52, 10, "#c0392b");

    // Row 5: Modernize
    const r5Y = r4Y + cardH + 80;
    const modCard: ScreenCard = {
      x: 200,
      y: r5Y,
      w: cardW + 30,
      h: cardH,
      title: "/modernization",
      kidLabel: "Fix It Up",
      kidDesc: "do the actual upgrades",
      fill: "#e8f0fe",
      drawInner: drawMiniWrench,
    };
    drawCard(modCard);

    // Advise -> Mod
    sketchArrow(ctx, adviseCard.x + adviseCard.w / 2, adviseCard.y + cardH, modCard.x + modCard.w / 2, r5Y);
    txt(ctx, '"here\'s the plan, go!"', adviseCard.x + adviseCard.w / 2 + 40, (adviseCard.y + cardH + r5Y) / 2, 10, "#666");

    // Dry run annotation
    ctx.save();
    ctx.strokeStyle = "#d4a017";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    const dryX = modCard.x + modCard.w + 14;
    sketchLine(ctx, dryX, modCard.y + 30, dryX + 50, modCard.y + 14);
    ctx.restore();
    txt(ctx, "practice run first!", dryX + 54, modCard.y + 12, 11, "#d4a017", "left");
    txt(ctx, "(like a rehearsal before", dryX + 54, modCard.y + 26, 9, "#b8960f", "left");
    txt(ctx, "the real show)", dryX + 54, modCard.y + 38, 9, "#b8960f", "left");

    // Row 6: Deploy + Monitor
    const r6Y = r5Y + cardH + 80;
    const deployCard: ScreenCard = {
      x: 140,
      y: r6Y,
      w: cardW + 20,
      h: cardH,
      title: "/deployment",
      kidLabel: "Send It Out",
      kidDesc: "put it back in action!",
      fill: "#e8f0fe",
      drawInner: drawMiniRocket,
    };
    const monCard: ScreenCard = {
      x: 460,
      y: r6Y,
      w: cardW + 20,
      h: cardH,
      title: "/monitoring",
      kidLabel: "Keep Watching",
      kidDesc: "make sure it stays good",
      fill: "#e6fce8",
      drawInner: drawMiniMonitor,
    };
    drawCard(deployCard);
    drawCard(monCard);

    // Mod -> Deploy
    sketchArrow(ctx, modCard.x + modCard.w / 2 - 30, modCard.y + cardH, deployCard.x + deployCard.w / 2, r6Y);
    txt(ctx, "ready to go!", modCard.x + 10, (modCard.y + cardH + r6Y) / 2, 10, "#666");

    // Deploy -> Monitor
    sketchArrow(ctx, deployCard.x + deployCard.w, deployCard.y + cardH / 2, monCard.x, monCard.y + cardH / 2);
    txt(ctx, "launched!", (deployCard.x + deployCard.w + monCard.x) / 2, deployCard.y + cardH / 2 - 14, 10, "#4a9d5b");

    // Finish star
    const starX = monCard.x + monCard.w + 60;
    const starY = monCard.y + monCard.h / 2;
    ctx.save();
    ctx.strokeStyle = "#d4a017";
    ctx.lineWidth = 1.6;
    sketchArrow(ctx, monCard.x + monCard.w, starY, starX - 20, starY);
    // Draw a hand-drawn star
    const sr = 18;
    const pts: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? sr : sr * 0.45;
      pts.push([starX + r * Math.cos(a), starY + r * Math.sin(a)]);
    }
    for (let i = 0; i < pts.length; i++) {
      const next = pts[(i + 1) % pts.length];
      sketchLine(ctx, pts[i][0], pts[i][1], next[0], next[1]);
    }
    ctx.restore();
    txt(ctx, "Done!", starX, starY + 28, 13, "#d4a017");
    txt(ctx, "system is modern", starX, starY + 42, 10, "#b8960f");

    // === UTILITY SHELF (bottom) ===
    const shelfY = r6Y + cardH + 90;
    ctx.save();
    ctx.strokeStyle = "#bbb";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    sketchRect(ctx, 60, shelfY, W - 120, 160);
    ctx.restore();
    txt(ctx, "THE TOOLBOX  --  always one click away from the side menu", W / 2, shelfY - 8, 12, "#999");

    const toolCards: { label: string; kidLabel: string; kidDesc: string; fill: string }[] = [
      { label: "Settings", kidLabel: "Preferences", kidDesc: "who's on the team", fill: "#f4f4f0" },
      { label: "API Keys", kidLabel: "Connections", kidDesc: "plug into other tools", fill: "#f4f4f0" },
      { label: "Automation", kidLabel: "Auto-Pilot", kidDesc: "let the app do steps", fill: "#f4f4f0" },
      { label: "The Diary", kidLabel: "Logbook", kidDesc: "who did what, when", fill: "#f4f4f0" },
    ];

    const tW = 150;
    const tH = 80;
    const tGap = 30;
    const tStartX = (W - (toolCards.length * tW + (toolCards.length - 1) * tGap)) / 2;

    toolCards.forEach((tc, i) => {
      const tx = tStartX + i * (tW + tGap);
      const ty = shelfY + 28;
      sketchRoundRect(ctx, tx, ty, tW, tH, tc.fill);
      drawMiniToolbox(ctx, tx + 18, ty + 14, tc.label);
      txt(ctx, tc.kidLabel, tx + tW / 2, ty + tH + 14, 12, "#1a1a1a");
      txt(ctx, tc.kidDesc, tx + tW / 2, ty + tH + 28, 10, "#888");
    });

    // Glossary popup annotation
    const glossX = tStartX + 3 * (tW + tGap) + tW + 30;
    ctx.save();
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    sketchLine(ctx, glossX, shelfY + 60, glossX + 50, shelfY + 40);
    ctx.restore();
    sketchRoundRect(ctx, glossX + 4, shelfY + 44, 100, 36, "#f9f0ff");
    txt(ctx, "Glossary", glossX + 54, shelfY + 56, 11);
    txt(ctx, "(popup dictionary)", glossX + 54, shelfY + 70, 9, "#888");

    // === LEGEND ===
    const legY = shelfY + 180;
    sketchLine(ctx, 100, legY, W - 100, legY);

    txt(ctx, "HOW TO READ THIS", W / 2, legY + 18, 13, "#555");

    ctx.save();
    // Solid arrow
    ctx.strokeStyle = "#2a2a2a"; ctx.lineWidth = 1.8; ctx.setLineDash([]);
    sketchArrow(ctx, 140, legY + 40, 200, legY + 40);
    txt(ctx, ' = "go here next"', 204, legY + 40, 11, "#555", "left");

    // Dashed arrow
    ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
    sketchArrow(ctx, 140, legY + 58, 200, legY + 58);
    ctx.setLineDash([]);
    txt(ctx, " = go back", 204, legY + 58, 11, "#aaa", "left");

    // Red dashed
    ctx.strokeStyle = "#c0392b"; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
    sketchArrow(ctx, 440, legY + 40, 500, legY + 40);
    ctx.setLineDash([]);
    txt(ctx, " = something went wrong, try again", 504, legY + 40, 11, "#c0392b", "left");

    // Blue dashed border
    ctx.strokeStyle = "#8ab4f8"; ctx.lineWidth = 1.4; ctx.setLineDash([6, 4]);
    sketchRect(ctx, 440, legY + 52, 30, 14);
    ctx.setLineDash([]);
    txt(ctx, " = the main adventure zone", 476, legY + 58, 11, "#4a7ab5", "left");

    ctx.restore();

    // Footer
    txt(ctx, "// sketched with a crayon (sort of)", W - 24, H - 16, 10, "#ccc", "right");
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
