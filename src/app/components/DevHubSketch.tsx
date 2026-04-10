import { useRef, useEffect, useCallback, useState } from "react";

// ============================================================
// HAND-SKETCH PRIMITIVES
// ============================================================
function jitter(v: number, amount = 2): number {
  return v + (Math.random() - 0.5) * amount;
}

function sketchLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number
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
  x: number, y: number, w: number, h: number, fill?: string
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
  x: number, y: number, w: number, h: number, fill?: string
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
  x1: number, y1: number, x2: number, y2: number
) {
  sketchLine(ctx, x1, y1, x2, y2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 9;
  sketchLine(ctx, x2, y2, x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
  sketchLine(ctx, x2, y2, x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
}

function sketchDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, w: number, h: number, fill?: string
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

function sketchCircle(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, fill?: string
) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Draw wobbly circle with 8 segments
  ctx.beginPath();
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const px = cx + (r + (Math.random() - 0.5) * 2.5) * Math.cos(a);
    const py = cy + (r + (Math.random() - 0.5) * 2.5) * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  size = 14, color = "#1a1a1a", align: CanvasTextAlign = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Segoe Print', 'Comic Sans MS', 'Patrick Hand', cursive`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawTextBold(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  size = 14, color = "#1a1a1a", align: CanvasTextAlign = "center"
) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px 'Segoe Print', 'Comic Sans MS', 'Patrick Hand', cursive`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function setupCanvas(canvas: HTMLCanvasElement, W: number, H: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return ctx;
}

function drawPaper(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#faf8f4";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#e0ddd6";
  for (let gx = 20; gx < W; gx += 20) {
    for (let gy = 20; gy < H; gy += 20) {
      ctx.fillRect(gx, gy, 1, 1);
    }
  }
  ctx.strokeStyle = "#2a2a2a";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
}

function sketchDashedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color = "#bbb", lineWidth = 1
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([4, 4]);
  sketchRect(ctx, x, y, w, h);
  ctx.restore();
}

// ============================================================
// CANVAS 1: USER FLOW
// ============================================================
function drawUserFlow(canvas: HTMLCanvasElement) {
  const W = 1040;
  const H = 880;
  const ctx = setupCanvas(canvas, W, H);
  drawPaper(ctx, W, H);

  // Title
  drawTextBold(ctx, "Developer Hub -- User Flow", W / 2, 30, 22, "#1a1a1a");
  drawText(ctx, "How developers interact with the Developer Hub", W / 2, 54, 13, "#888");

  // ---- ENTRY POINT ----
  const entryX = W / 2;
  const entryY = 100;
  sketchRoundRect(ctx, entryX - 80, entryY - 20, 160, 40, "#d4edda");
  drawTextBold(ctx, "Developer Hub", entryX, entryY, 14, "#1a1a1a");

  // Arrow down to decision
  sketchArrow(ctx, entryX, entryY + 20, entryX, entryY + 60);

  // Decision: First time?
  const decY = entryY + 90;
  sketchDiamond(ctx, entryX, decY, 120, 60, "#fff7e0");
  drawText(ctx, "First time?", entryX, decY, 12);

  // ---- YES BRANCH (left) ----
  const yesX = 180;
  sketchArrow(ctx, entryX - 60, decY, yesX + 80, decY);
  drawText(ctx, "yes", entryX - 75, decY - 14, 11, "#2d7d2d");

  // Step 1: Overview
  const ovY = decY - 20;
  sketchRoundRect(ctx, yesX - 70, ovY, 140, 40, "#e8f0fe");
  drawText(ctx, "Overview Tab", yesX, ovY + 20, 13);
  drawText(ctx, "read quick start guide", yesX, ovY + 52, 10, "#888");

  // Step 2: Generate Key
  sketchArrow(ctx, yesX, ovY + 40, yesX, ovY + 80);
  const gkY = ovY + 90;
  sketchRoundRect(ctx, yesX - 70, gkY, 140, 40, "#e8f0fe");
  drawText(ctx, "Generate API Key", yesX, gkY + 20, 12);
  drawText(ctx, "set name + scopes", yesX, gkY + 52, 10, "#888");

  // Step 3: First call
  sketchArrow(ctx, yesX, gkY + 40, yesX, gkY + 80);
  const fcY = gkY + 90;
  sketchRoundRect(ctx, yesX - 70, fcY, 140, 40, "#e8f0fe");
  drawText(ctx, "Copy curl Example", yesX, fcY + 20, 12);
  drawText(ctx, "make first API call", yesX, fcY + 52, 10, "#888");

  // Arrow from first call down to convergence
  const convY = 720;
  ctx.save();
  ctx.strokeStyle = "#2d7d2d";
  ctx.lineWidth = 1.4;
  ctx.setLineDash([4, 4]);
  sketchLine(ctx, yesX, fcY + 40, yesX, convY - 40);
  sketchArrow(ctx, yesX, convY - 40, entryX - 80, convY);
  ctx.restore();

  // ---- NO BRANCH (right) -- fan out to 5 needs ----
  const noBaseX = entryX + 60;
  sketchArrow(ctx, entryX + 60, decY, entryX + 130, decY);
  drawText(ctx, "no", entryX + 80, decY - 14, 11, "#c0392b");

  // "What do they need?" node
  const needX = entryX + 190;
  sketchRoundRect(ctx, needX - 65, decY - 18, 130, 36, "#f0eaff");
  drawText(ctx, "What's the task?", needX, decY, 12);

  // Five branches fanning down
  const branches = [
    { label: "Monitor Usage", tab: "Usage Tab", detail: "charts + top endpoints", x: needX - 200, fill: "#e0f2fe" },
    { label: "Manage Keys", tab: "API Keys Tab", detail: "create / rotate / revoke", x: needX - 80, fill: "#e8f0fe" },
    { label: "Set Up Webhooks", tab: "Webhooks Tab", detail: "events + delivery logs", x: needX + 40, fill: "#fef3c7" },
    { label: "Connect Tools", tab: "Integrations Tab", detail: "marketplace cards", x: needX + 160, fill: "#dcfce7" },
    { label: "Look Up Endpoint", tab: "API Reference Tab", detail: "search + examples", x: needX + 280, fill: "#fce7f3" },
  ];

  const branchStartY = decY + 40;

  branches.forEach((b, i) => {
    const bx = b.x + 60;
    const by = branchStartY + 70;

    // Arrow from need to branch
    sketchArrow(ctx, needX, decY + 18, bx, by - 10);

    // Branch label
    sketchRoundRect(ctx, bx - 70, by, 140, 36, b.fill);
    drawText(ctx, b.label, bx, by + 18, 12);

    // Arrow down to tab
    sketchArrow(ctx, bx, by + 36, bx, by + 62);

    // Tab box
    const tabY = by + 68;
    sketchRoundRect(ctx, bx - 70, tabY, 140, 36, "#f8f8f4");
    drawTextBold(ctx, b.tab, bx, tabY + 14, 11, "#333");
    drawText(ctx, b.detail, bx, tabY + 50, 10, "#888");

    // Arrow down to action
    sketchArrow(ctx, bx, tabY + 36, bx, tabY + 68);

    // Action result
    const actY = tabY + 74;
    const actions = [
      "Spot anomalies, export data",
      "Copy key, set permissions",
      "Test delivery, retry fails",
      "Configure, check sync",
      "Copy snippet, check errors",
    ];
    sketchRoundRect(ctx, bx - 70, actY, 140, 36, "#f4f4f0");
    drawText(ctx, actions[i], bx, actY + 18, 10, "#555");

    // Arrow to convergence
    ctx.save();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    sketchArrow(ctx, bx, actY + 36, entryX, convY - 6);
    ctx.restore();
  });

  // ---- CONVERGENCE ----
  sketchRoundRect(ctx, entryX - 100, convY, 200, 44, "#d4edda");
  drawTextBold(ctx, "Ship Code with Confidence", entryX, convY + 22, 14, "#1a1a1a");

  // Audit trail callout
  const auditY = convY + 60;
  sketchDashedRect(ctx, entryX - 170, auditY, 340, 36, "#bbb", 1);
  drawText(ctx, "Every action logged to Audit Trail automatically", entryX, auditY + 18, 11, "#999");

  // Rate limit + HMAC callout
  const secY = auditY + 50;
  ctx.save();
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  sketchLine(ctx, 200, secY, W - 200, secY);
  ctx.restore();
  drawText(ctx, "Rate limited (1k req/min)  |  HMAC-SHA256 signed webhooks  |  Scoped permissions per key", W / 2, secY + 18, 11, "#aaa");

  // Footer
  drawText(ctx, "// developer hub user flow", W - 20, H - 14, 10, "#ccc", "right");
}

// ============================================================
// CANVAS 2: SCREEN FLOW WIREFRAMES
// ============================================================
function drawScreenFlow(canvas: HTMLCanvasElement) {
  const W = 1100;
  const H = 1020;
  const ctx = setupCanvas(canvas, W, H);
  drawPaper(ctx, W, H);

  // Title
  drawTextBold(ctx, "Developer Hub -- Screen Wireframes", W / 2, 30, 22, "#1a1a1a");
  drawText(ctx, "Six tabs, one unified page. Each tab's key UI elements.", W / 2, 54, 13, "#888");

  // Tab bar sketch at top
  const tabY = 80;
  const tabW = 130;
  const tabGap = 8;
  const tabStartX = (W - (6 * tabW + 5 * tabGap)) / 2;
  const tabLabels = ["Overview", "API Keys", "Usage", "Webhooks", "Integrations", "API Reference"];

  tabLabels.forEach((label, i) => {
    const tx = tabStartX + i * (tabW + tabGap);
    const isActive = i === 0;
    sketchRect(ctx, tx, tabY, tabW, 30, isActive ? "#e8f0fe" : "#f4f4f0");
    drawText(ctx, label, tx + tabW / 2, tabY + 15, 11, isActive ? "#2563eb" : "#666");
    if (isActive) {
      ctx.save();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2.5;
      sketchLine(ctx, tx + 4, tabY + 30, tx + tabW - 4, tabY + 30);
      ctx.restore();
    }
  });

  // Helper: draw a mini wireframe screen
  const screenW = 320;
  const screenH = 380;
  const colGap = 36;
  const rowGap = 50;

  function screenPos(col: number, row: number): [number, number] {
    const sx = (W - (3 * screenW + 2 * colGap)) / 2 + col * (screenW + colGap);
    const sy = 140 + row * (screenH + rowGap);
    return [sx, sy];
  }

  // ---- SCREEN 1: OVERVIEW ----
  {
    const [sx, sy] = screenPos(0, 0);
    sketchRect(ctx, sx, sy, screenW, screenH, "#fefefe");
    drawTextBold(ctx, "Overview", sx + screenW / 2, sy + 18, 14, "#1a1a1a");

    // Stats row - 4 boxes
    const statW = 65;
    const statGap = 6;
    const statStartX = sx + 14;
    const statY = sy + 36;
    ["12,847", "3 keys", "99.7%", "143ms"].forEach((val, i) => {
      sketchRect(ctx, statStartX + i * (statW + statGap), statY, statW, 36, "#f0f7ff");
      drawText(ctx, val, statStartX + i * (statW + statGap) + statW / 2, statY + 14, 10, "#333");
      drawText(ctx, ["calls", "active", "success", "latency"][i], statStartX + i * (statW + statGap) + statW / 2, statY + 28, 8, "#999");
    });

    // Quick Start box
    const qsY = statY + 50;
    sketchRect(ctx, sx + 14, qsY, screenW - 28, 80, "#f8fdf8");
    drawTextBold(ctx, "Quick Start", sx + 30, qsY + 16, 11, "#333", "left");
    // Fake code block
    sketchRect(ctx, sx + 22, qsY + 28, 120, 40, "#1e293b");
    drawText(ctx, "curl ...", sx + 82, qsY + 48, 9, "#a5f3fc");
    sketchRect(ctx, sx + 155, qsY + 28, 120, 40, "#1e293b");
    drawText(ctx, "{ data: [...] }", sx + 215, qsY + 48, 9, "#a5f3fc");

    // 3 concept cards
    const ccY = qsY + 96;
    ["Auth", "Rate Limits", "Webhooks"].forEach((c, i) => {
      sketchRect(ctx, sx + 14 + i * 98, ccY, 90, 50, "#fefce8");
      drawTextBold(ctx, c, sx + 14 + i * 98 + 45, ccY + 16, 10, "#555");
      // Squiggly text lines
      ctx.save();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      sketchLine(ctx, sx + 22 + i * 98, ccY + 30, sx + 22 + i * 98 + 72, ccY + 30);
      sketchLine(ctx, sx + 22 + i * 98, ccY + 38, sx + 22 + i * 98 + 55, ccY + 38);
      ctx.restore();
    });

    // Common Workflows
    const cwY = ccY + 64;
    drawTextBold(ctx, "Common Workflows", sx + 30, cwY, 10, "#555", "left");
    ["CI/CD Deployment", "Fleet Health Check", "Emergency Rollback"].forEach((wf, i) => {
      sketchRect(ctx, sx + 14, cwY + 12 + i * 26, screenW - 28, 22, "#f8f8f4");
      drawText(ctx, wf, sx + 30, cwY + 23 + i * 26, 9, "#555", "left");
      // Arrow chain
      ctx.save();
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 0.8;
      sketchLine(ctx, sx + 140, cwY + 23 + i * 26, sx + screenW - 24, cwY + 23 + i * 26);
      ctx.restore();
    });

    drawText(ctx, "[1]", sx + screenW / 2, sy + screenH - 8, 10, "#bbb");
  }

  // ---- SCREEN 2: API KEYS ----
  {
    const [sx, sy] = screenPos(1, 0);
    sketchRect(ctx, sx, sy, screenW, screenH, "#fefefe");
    drawTextBold(ctx, "API Keys", sx + screenW / 2, sy + 18, 14, "#1a1a1a");

    // Generate Key button
    sketchRoundRect(ctx, sx + screenW - 120, sy + 6, 104, 26, "#3b82f6");
    drawText(ctx, "+ Generate Key", sx + screenW - 68, sy + 19, 10, "#fff");

    // Table header
    const thY = sy + 42;
    sketchRect(ctx, sx + 14, thY, screenW - 28, 22, "#f1f5f9");
    ["Name", "Key", "Scopes", "Actions"].forEach((h, i) => {
      drawTextBold(ctx, h, sx + 30 + i * 72, thY + 11, 9, "#64748b", "left");
    });

    // Table rows
    const rows = [
      { name: "Flight Ops", key: "nbcs_live_a8f2...", dot: "#22c55e" },
      { name: "Training (RO)", key: "nbcs_live_f3e8...", dot: "#22c55e" },
      { name: "CI/CD Pipeline", key: "nbcs_live_c7b4...", dot: "#22c55e" },
      { name: "Legacy (Revoked)", key: "nbcs_live_d9a3...", dot: "#94a3b8" },
    ];

    rows.forEach((row, i) => {
      const ry = thY + 26 + i * 34;
      sketchRect(ctx, sx + 14, ry, screenW - 28, 30, i % 2 === 0 ? "#fefefe" : "#fafafa");

      // Status dot
      sketchCircle(ctx, sx + 24, ry + 15, 4, row.dot);

      drawText(ctx, row.name, sx + 52, ry + 11, 9, "#333", "left");
      drawText(ctx, row.key, sx + 52, ry + 23, 8, "#999", "left");

      // Scope badges
      sketchRect(ctx, sx + 174, ry + 6, 40, 16, "#f1f5f9");
      drawText(ctx, "read", sx + 194, ry + 14, 7, "#666");
      if (i < 3) {
        sketchRect(ctx, sx + 218, ry + 6, 40, 16, "#f1f5f9");
        drawText(ctx, i < 2 ? "write" : "+2", sx + 238, ry + 14, 7, "#666");
      }

      // Action icons (rotate, delete)
      if (i < 3) {
        drawText(ctx, "o  x", sx + screenW - 36, ry + 15, 10, "#999");
      }
    });

    // Key visibility toggle annotation
    const annY = thY + 26 + 4 * 34 + 10;
    ctx.save();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    sketchLine(ctx, sx + 130, thY + 40, sx + 14, annY + 6);
    ctx.restore();
    drawText(ctx, "click eye to reveal/hide full key", sx + 14, annY + 20, 9, "#3b82f6", "left");

    // Scoping panel annotation
    const spY = annY + 36;
    sketchDashedRect(ctx, sx + 14, spY, screenW - 28, 60, "#3b82f6", 1);
    drawText(ctx, "Create Key Panel", sx + screenW / 2, spY + 14, 10, "#3b82f6");
    drawText(ctx, "Name | Expiration | Scoped Permissions", sx + screenW / 2, spY + 32, 9, "#888");
    // Scope checkboxes
    ["fleet:read", "fleet:write", "deploy:read", "deploy:write"].forEach((s, i) => {
      sketchRect(ctx, sx + 24 + i * 70, spY + 42, 62, 14, "#f0f7ff");
      drawText(ctx, s, sx + 24 + i * 70 + 31, spY + 49, 7, "#555");
    });

    drawText(ctx, "[2]", sx + screenW / 2, sy + screenH - 8, 10, "#bbb");
  }

  // ---- SCREEN 3: USAGE ----
  {
    const [sx, sy] = screenPos(2, 0);
    sketchRect(ctx, sx, sy, screenW, screenH, "#fefefe");
    drawTextBold(ctx, "Usage", sx + screenW / 2, sy + 18, 14, "#1a1a1a");

    // 7d/30d toggle
    sketchRect(ctx, sx + screenW - 98, sy + 8, 40, 20, "#e8f0fe");
    drawText(ctx, "7d", sx + screenW - 78, sy + 18, 9, "#2563eb");
    sketchRect(ctx, sx + screenW - 54, sy + 8, 40, 20, "#f4f4f0");
    drawText(ctx, "30d", sx + screenW - 34, sy + 18, 9, "#999");

    // Summary cards row
    const statY = sy + 38;
    const sLabels = ["88,227 req", "235 err", "0.27%", "143ms"];
    const sNames = ["Total", "Errors", "Error %", "Latency"];
    sLabels.forEach((v, i) => {
      sketchRect(ctx, sx + 14 + i * 73, statY, 67, 36, "#f0f7ff");
      drawTextBold(ctx, v, sx + 14 + i * 73 + 33, statY + 14, 9, "#333");
      drawText(ctx, sNames[i], sx + 14 + i * 73 + 33, statY + 28, 7, "#999");
    });

    // Area chart
    const chartY = statY + 48;
    sketchRect(ctx, sx + 14, chartY, screenW - 28, 100, "#fafcff");
    drawTextBold(ctx, "Request Volume", sx + 30, chartY + 12, 9, "#555", "left");

    // Sketch a wobbly area chart line
    ctx.save();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    const chartPoints = [
      [0, 50], [1, 62], [2, 38], [3, 44], [4, 28], [5, 34], [6, 42],
    ];
    ctx.beginPath();
    chartPoints.forEach(([xi, yi], idx) => {
      const px = sx + 30 + xi * 40;
      const py = chartY + 20 + yi + (Math.random() - 0.5) * 3;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Fill underneath
    ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
    ctx.lineTo(sx + 30 + 6 * 40, chartY + 90);
    ctx.lineTo(sx + 30, chartY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // X-axis labels
    ["M28", "M29", "M30", "M31", "A1", "A2", "A3"].forEach((d, i) => {
      drawText(ctx, d, sx + 30 + i * 40, chartY + 96, 7, "#bbb");
    });

    // Two-column section: Top Endpoints + Error donut
    const botY = chartY + 114;

    // Top Endpoints
    sketchRect(ctx, sx + 14, botY, (screenW - 36) / 2, 120, "#fafafa");
    drawTextBold(ctx, "Top Endpoints", sx + 24, botY + 12, 9, "#555", "left");
    ["GET /fleet", "GET /fleet/{id}/status", "POST /fleet/scan", "GET /deployments/{id}"].forEach((ep, i) => {
      drawText(ctx, ep, sx + 24, botY + 30 + i * 22, 8, "#666", "left");
      // Bar representation
      const barW = [80, 55, 35, 28][i];
      ctx.save();
      ctx.fillStyle = "#dbeafe";
      ctx.fillRect(sx + 24, botY + 38 + i * 22, barW, 6);
      ctx.restore();
    });

    // Error distribution donut
    const donutCX = sx + 14 + (screenW - 36) / 2 + (screenW - 36) / 4 + 10;
    const donutCY = botY + 54;
    sketchRect(ctx, sx + 14 + (screenW - 36) / 2 + 8, botY, (screenW - 36) / 2, 120, "#fafafa");
    drawTextBold(ctx, "Errors", donutCX, botY + 12, 9, "#555");

    // Sketch donut
    const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"];
    const angles = [0, Math.PI * 0.7, Math.PI * 1.1, Math.PI * 1.6];
    colors.forEach((c, i) => {
      ctx.save();
      ctx.strokeStyle = c;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(donutCX, donutCY + 12, 28, angles[i], angles[(i + 1) % 4] || Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Legend
    ["400", "401", "404", "429"].forEach((code, i) => {
      ctx.save();
      ctx.fillStyle = colors[i];
      ctx.fillRect(donutCX + 44, donutCY - 18 + i * 16, 8, 8);
      ctx.restore();
      drawText(ctx, code, donutCX + 64, donutCY - 14 + i * 16, 8, "#666", "left");
    });

    // Latency bar chart
    const latY = botY + 130;
    sketchRect(ctx, sx + 14, latY, screenW - 28, 60, "#faf8ff");
    drawTextBold(ctx, "Avg Latency (ms)", sx + 30, latY + 12, 9, "#555", "left");
    // Bars
    [40, 35, 46, 38, 50, 42, 39].forEach((h, i) => {
      ctx.save();
      ctx.fillStyle = "#8b5cf6";
      ctx.fillRect(sx + 30 + i * 38, latY + 50 - h, 22, h);
      ctx.restore();
    });

    drawText(ctx, "[3]", sx + screenW / 2, sy + screenH - 8, 10, "#bbb");
  }

  // ---- SCREEN 4: WEBHOOKS ----
  {
    const [sx, sy] = screenPos(0, 1);
    sketchRect(ctx, sx, sy, screenW, screenH, "#fefefe");
    drawTextBold(ctx, "Webhooks", sx + screenW / 2, sy + 18, 14, "#1a1a1a");

    // Add Webhook button
    sketchRoundRect(ctx, sx + screenW - 116, sy + 6, 100, 26, "#3b82f6");
    drawText(ctx, "+ Add Webhook", sx + screenW - 66, sy + 19, 10, "#fff");

    // Webhook entries
    const whEntries = [
      { url: "hooks.slack.com/...", events: "4 events", rate: "99.8%", status: 200, dot: "#22c55e" },
      { url: "api.pagerduty.com/...", events: "3 events", rate: "100%", status: 202, dot: "#22c55e" },
      { url: "jenkins.internal/...", events: "2 events", rate: "72.4%", status: 503, dot: "#ef4444" },
    ];

    whEntries.forEach((wh, i) => {
      const wy = sy + 42 + i * 62;
      sketchRect(ctx, sx + 14, wy, screenW - 28, 54, "#fefefe");

      // Status dot
      sketchCircle(ctx, sx + 28, wy + 16, 4, wh.dot);

      drawText(ctx, wh.url, sx + 48, wy + 16, 10, "#333", "left");
      drawText(ctx, wh.events, sx + 48, wy + 32, 9, "#888", "left");

      // Success rate
      const rateColor = parseFloat(wh.rate) >= 99 ? "#22c55e" : parseFloat(wh.rate) >= 90 ? "#f59e0b" : "#ef4444";
      drawTextBold(ctx, wh.rate, sx + screenW - 80, wy + 16, 11, rateColor);

      // Status badge
      const badgeColor = wh.status < 300 ? "#dcfce7" : "#fee2e2";
      const textColor = wh.status < 300 ? "#166534" : "#991b1b";
      sketchRect(ctx, sx + screenW - 54, wy + 26, 32, 18, badgeColor);
      drawText(ctx, String(wh.status), sx + screenW - 38, wy + 35, 9, textColor);

      // Expand arrow
      drawText(ctx, ">", sx + screenW - 24, wy + 18, 12, "#ccc");
    });

    // Expanded view annotation
    const expY = sy + 42 + 3 * 62 + 6;
    sketchDashedRect(ctx, sx + 14, expY, screenW - 28, 106, "#3b82f6", 1);
    drawText(ctx, "Expanded Webhook Detail", sx + screenW / 2, expY + 14, 10, "#3b82f6");

    // Subscribed events
    drawTextBold(ctx, "Subscribed Events", sx + 28, expY + 32, 8, "#666", "left");
    ["deploy.started", "deploy.completed", "deploy.failed"].forEach((ev, i) => {
      sketchRect(ctx, sx + 24 + i * 88, expY + 40, 82, 16, "#f0f7ff");
      drawText(ctx, ev, sx + 24 + i * 88 + 41, expY + 48, 7, "#555");
    });

    // Delivery log
    drawTextBold(ctx, "Delivery Log", sx + 28, expY + 66, 8, "#666", "left");
    drawText(ctx, "Send Test", sx + screenW - 52, expY + 66, 8, "#3b82f6", "left");

    sketchRect(ctx, sx + 24, expY + 74, screenW - 48, 14, "#f1f5f9");
    drawText(ctx, "Status    Event               Time           Retry", sx + screenW / 2, expY + 81, 7, "#999");
    sketchRect(ctx, sx + 24, expY + 88, screenW - 48, 14, "#fefefe");
    drawText(ctx, "200     deploy.started     Apr 3 14:22     --", sx + screenW / 2, expY + 95, 7, "#666");

    drawText(ctx, "[4]", sx + screenW / 2, sy + screenH - 8, 10, "#bbb");
  }

  // ---- SCREEN 5: INTEGRATIONS ----
  {
    const [sx, sy] = screenPos(1, 1);
    sketchRect(ctx, sx, sy, screenW, screenH, "#fefefe");
    drawTextBold(ctx, "Integrations", sx + screenW / 2, sy + 18, 14, "#1a1a1a");

    // Category filter
    const cats = ["All", "CI/CD", "Monitoring", "Notifications"];
    cats.forEach((c, i) => {
      const isActive = i === 0;
      sketchRect(ctx, sx + 14 + i * 68, sy + 36, 62, 20, isActive ? "#e8f0fe" : "#f4f4f0");
      drawText(ctx, c, sx + 14 + i * 68 + 31, sy + 46, 8, isActive ? "#2563eb" : "#999");
    });

    // Connected section
    drawTextBold(ctx, "CONNECTED", sx + 24, sy + 72, 9, "#999", "left");
    const connected = [
      { name: "GitHub Actions", cat: "CI/CD", sync: "2h ago" },
      { name: "Datadog", cat: "Monitoring", sync: "5m ago" },
      { name: "Slack", cat: "Notifications", sync: "14m ago" },
    ];
    connected.forEach((int, i) => {
      const cx = sx + 14 + i * 100;
      const cy = sy + 86;
      sketchRect(ctx, cx, cy, 93, 86, "#f0fdf4");

      // Checkmark
      drawText(ctx, "v", cx + 78, cy + 12, 10, "#22c55e");

      drawTextBold(ctx, int.name, cx + 46, cy + 24, 9, "#333");
      drawText(ctx, int.cat, cx + 46, cy + 38, 8, "#999");

      // Squiggly description lines
      ctx.save();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 0.8;
      sketchLine(ctx, cx + 8, cy + 50, cx + 85, cy + 50);
      sketchLine(ctx, cx + 8, cy + 56, cx + 60, cy + 56);
      ctx.restore();

      drawText(ctx, "synced " + int.sync, cx + 46, cy + 68, 7, "#aaa");

      // Configure button
      sketchRect(ctx, cx + 8, cy + 74, 77, 10, "#e2e8f0");
      drawText(ctx, "Configure", cx + 46, cy + 79, 7, "#64748b");
    });

    // Available section
    drawTextBold(ctx, "AVAILABLE", sx + 24, sy + 188, 9, "#999", "left");
    const available = [
      { name: "Jenkins", cat: "CI/CD" },
      { name: "PagerDuty", cat: "Incident" },
      { name: "Terraform", cat: "Infra" },
      { name: "GitLab CI", cat: "CI/CD" },
      { name: "Prometheus", cat: "Monitoring" },
    ];

    available.forEach((int, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = sx + 14 + col * 100;
      const cy = sy + 202 + row * 86;
      sketchRect(ctx, cx, cy, 93, 78, "#fefefe");

      drawTextBold(ctx, int.name, cx + 46, cy + 20, 9, "#333");
      drawText(ctx, int.cat, cx + 46, cy + 34, 8, "#999");

      // Squiggly desc lines
      ctx.save();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 0.8;
      sketchLine(ctx, cx + 8, cy + 46, cx + 85, cy + 46);
      sketchLine(ctx, cx + 8, cy + 52, cx + 60, cy + 52);
      ctx.restore();

      // Connect button
      sketchRoundRect(ctx, cx + 8, cy + 60, 77, 14, "#3b82f6");
      drawText(ctx, "Connect", cx + 46, cy + 67, 8, "#fff");
    });

    drawText(ctx, "[5]", sx + screenW / 2, sy + screenH - 8, 10, "#bbb");
  }

  // ---- SCREEN 6: API REFERENCE ----
  {
    const [sx, sy] = screenPos(2, 1);
    sketchRect(ctx, sx, sy, screenW, screenH, "#fefefe");
    drawTextBold(ctx, "API Reference", sx + screenW / 2, sy + 18, 14, "#1a1a1a");

    // Search bar
    sketchRect(ctx, sx + screenW - 160, sy + 6, 144, 24, "#fafafa");
    drawText(ctx, "Search endpoints...", sx + screenW - 88, sy + 18, 9, "#ccc");

    // Auth banner
    const authY = sy + 38;
    sketchRect(ctx, sx + 14, authY, screenW - 28, 22, "#fef3c7");
    drawText(ctx, "All endpoints require Bearer token auth", sx + screenW / 2, authY + 11, 9, "#92400e");

    // Endpoints
    const endpoints = [
      { method: "GET", path: "/v1/fleet", desc: "List all systems", fill: "#dcfce7", textColor: "#166534" },
      { method: "POST", path: "/v1/fleet/scan", desc: "Initiate scan", fill: "#dbeafe", textColor: "#1e40af" },
      { method: "POST", path: "/v1/deployments", desc: "Create deployment", fill: "#dbeafe", textColor: "#1e40af" },
      { method: "GET", path: "/v1/deployments/{id}", desc: "Get deploy status", fill: "#dcfce7", textColor: "#166534" },
      { method: "POST", path: "/v1/deployments/{id}/rollback", desc: "Rollback", fill: "#dbeafe", textColor: "#1e40af" },
    ];

    endpoints.forEach((ep, i) => {
      const ey = authY + 30 + i * 32;
      sketchRect(ctx, sx + 14, ey, screenW - 28, 28, i === 0 ? "#fafafa" : "#fefefe");

      // Expand arrow
      drawText(ctx, i === 0 ? "v" : ">", sx + 26, ey + 14, 10, "#ccc");

      // Method badge
      sketchRect(ctx, sx + 38, ey + 5, 36, 18, ep.fill);
      drawTextBold(ctx, ep.method, sx + 56, ey + 14, 8, ep.textColor);

      // Path
      drawText(ctx, ep.path, sx + 82, ey + 14, 9, "#333", "left");

      // Description
      drawText(ctx, ep.desc, sx + screenW - 30, ey + 14, 8, "#999", "right");
    });

    // Expanded first endpoint
    const expY = authY + 30 + 5 * 32 + 4;
    sketchDashedRect(ctx, sx + 14, expY, screenW - 28, 130, "#3b82f6", 1);
    drawText(ctx, "Expanded Endpoint Detail", sx + screenW / 2, expY + 14, 10, "#3b82f6");

    // Response block
    drawTextBold(ctx, "Response 200", sx + 28, expY + 34, 8, "#666", "left");
    sketchRect(ctx, sx + 24, expY + 42, screenW - 48, 36, "#1e293b");
    drawText(ctx, '{ "data": [{ "id": "nmb-2024-1147", ...}] }', sx + screenW / 2, expY + 60, 8, "#a5f3fc");

    // Error table
    drawTextBold(ctx, "Errors", sx + 28, expY + 88, 8, "#666", "left");
    sketchRect(ctx, sx + 24, expY + 96, screenW - 48, 14, "#f1f5f9");
    drawText(ctx, "Code     Error                 Description", sx + screenW / 2, expY + 103, 7, "#999");
    sketchRect(ctx, sx + 24, expY + 110, screenW - 48, 14, "#fefefe");
    drawText(ctx, "401    unauthorized       Missing or invalid API key", sx + screenW / 2, expY + 117, 7, "#666");

    drawText(ctx, "[6]", sx + screenW / 2, sy + screenH - 8, 10, "#bbb");
  }

  // ---- NAVIGATION ARROWS between screens ----
  ctx.save();
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 3]);

  // Overview -> API Keys (horizontal)
  {
    const [sx1] = screenPos(0, 0);
    const [sx2] = screenPos(1, 0);
    sketchArrow(ctx, sx1 + screenW + 4, 140 + screenH / 2 - 30, sx2 - 4, 140 + screenH / 2 - 30);
    drawText(ctx, "tab", (sx1 + screenW + sx2) / 2, 140 + screenH / 2 - 44, 8, "#3b82f6");
  }

  // API Keys -> Usage
  {
    const [sx2] = screenPos(1, 0);
    const [sx3] = screenPos(2, 0);
    sketchArrow(ctx, sx2 + screenW + 4, 140 + screenH / 2 - 30, sx3 - 4, 140 + screenH / 2 - 30);
    drawText(ctx, "tab", (sx2 + screenW + sx3) / 2, 140 + screenH / 2 - 44, 8, "#3b82f6");
  }

  // Overview -> Webhooks (vertical)
  {
    const [sx1, sy1] = screenPos(0, 0);
    const [, sy2] = screenPos(0, 1);
    sketchArrow(ctx, sx1 + screenW / 2 - 30, sy1 + screenH + 4, sx1 + screenW / 2 - 30, sy2 - 4);
    drawText(ctx, "tab", sx1 + screenW / 2 - 48, (sy1 + screenH + sy2) / 2, 8, "#3b82f6");
  }

  // Webhooks -> Integrations
  {
    const [sx4] = screenPos(0, 1);
    const [sx5, sy5] = screenPos(1, 1);
    sketchArrow(ctx, sx4 + screenW + 4, sy5 + screenH / 2 - 30, sx5 - 4, sy5 + screenH / 2 - 30);
    drawText(ctx, "tab", (sx4 + screenW + sx5) / 2, sy5 + screenH / 2 - 44, 8, "#3b82f6");
  }

  // Integrations -> API Reference
  {
    const [sx5] = screenPos(1, 1);
    const [sx6, sy6] = screenPos(2, 1);
    sketchArrow(ctx, sx5 + screenW + 4, sy6 + screenH / 2 - 30, sx6 - 4, sy6 + screenH / 2 - 30);
    drawText(ctx, "tab", (sx5 + screenW + sx6) / 2, sy6 + screenH / 2 - 44, 8, "#3b82f6");
  }

  ctx.restore();

  // ---- PITCH AT BOTTOM ----
  const pitchY = H - 60;
  ctx.save();
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  sketchLine(ctx, 120, pitchY - 8, W - 120, pitchY - 8);
  ctx.restore();

  drawTextBold(ctx, "One page. Six tabs. Everything a developer needs.", W / 2, pitchY + 12, 14, "#333");
  drawText(ctx, "Keys, usage, webhooks, integrations, and endpoint reference -- no context switching.", W / 2, pitchY + 32, 12, "#666");

  drawText(ctx, "// developer hub wireframes", W - 20, H - 14, 10, "#ccc", "right");
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DevHubSketch() {
  const flowRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<"flow" | "screens">("flow");

  const render = useCallback(() => {
    if (flowRef.current) drawUserFlow(flowRef.current);
    if (screenRef.current) drawScreenFlow(screenRef.current);
  }, []);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="min-h-screen bg-[#faf8f4] p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setView("flow")}
            className={`px-5 py-2.5 rounded-lg text-sm transition-colors ${
              view === "flow"
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            User Flow
          </button>
          <button
            onClick={() => setView("screens")}
            className={`px-5 py-2.5 rounded-lg text-sm transition-colors ${
              view === "screens"
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Screen Wireframes
          </button>
        </div>

        {/* Canvases */}
        <div className="flex justify-center">
          <canvas
            ref={flowRef}
            className={`max-w-full h-auto rounded shadow-md border border-gray-200 ${view !== "flow" ? "hidden" : ""}`}
            style={{ imageRendering: "auto" }}
          />
          <canvas
            ref={screenRef}
            className={`max-w-full h-auto rounded shadow-md border border-gray-200 ${view !== "screens" ? "hidden" : ""}`}
            style={{ imageRendering: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
