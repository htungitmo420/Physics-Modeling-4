"use strict";

(function initGraphRenderer(namespace) {
  const { elements, graphCtx } = namespace.dom;
  const { screenHalfSpanM } = namespace.config;

  function drawGraph(params) {
    const canvas = elements.graphCanvas;
    const { width, height } = canvas;
    const margin = { top: 26, right: 22, bottom: 50, left: 66 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    graphCtx.clearRect(0, 0, width, height);
    graphCtx.fillStyle = "#fbfdff";
    graphCtx.fillRect(0, 0, width, height);

    drawGraphGrid(graphCtx, margin, plotWidth, plotHeight);

    graphCtx.strokeStyle = "#1f2937";
    graphCtx.lineWidth = 1.5;
    graphCtx.beginPath();
    graphCtx.moveTo(margin.left, margin.top);
    graphCtx.lineTo(margin.left, margin.top + plotHeight);
    graphCtx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    graphCtx.stroke();

    const color = namespace.colors.wavelengthToRgb(params.wavelengthNm);
    graphCtx.strokeStyle = namespace.colors.rgbToString(color);
    graphCtx.lineWidth = 2.5;
    graphCtx.beginPath();

    for (let px = 0; px <= plotWidth; px += 1) {
      const screenY = namespace.physics.screenYFromPixel(px, plotWidth);
      const intensity = namespace.physics.getIntensity(screenY, params);
      const x = margin.left + px;
      const y = margin.top + plotHeight - intensity * plotHeight;

      if (px === 0) {
        graphCtx.moveTo(x, y);
      } else {
        graphCtx.lineTo(x, y);
      }
    }

    graphCtx.stroke();

    graphCtx.fillStyle = "#334155";
    graphCtx.font = "700 14px Segoe UI, Arial, sans-serif";
    graphCtx.fillText("Интенсивность I(y)", 14, 20);
    graphCtx.fillText("Положение на экране y", margin.left + plotWidth / 2 - 82, height - 12);
  }

  function drawGraphGrid(ctx, margin, plotWidth, plotHeight) {
    ctx.save();
    ctx.strokeStyle = "#e2e8f0";
    ctx.fillStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.font = "11px Segoe UI, Arial, sans-serif";

    for (let i = 0; i <= 4; i += 1) {
      const x = margin.left + plotWidth * i / 4;
      const screenYmm = (-screenHalfSpanM + 2 * screenHalfSpanM * i / 4) * 1000;

      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + plotHeight);
      ctx.stroke();
      ctx.fillText(screenYmm.toFixed(1), x - 12, margin.top + plotHeight + 20);
    }

    for (let i = 0; i <= 4; i += 1) {
      const y = margin.top + plotHeight - plotHeight * i / 4;
      const intensity = i / 4;

      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotWidth, y);
      ctx.stroke();
      ctx.fillText(intensity.toFixed(2), 18, y + 4);
    }

    ctx.restore();
  }

  namespace.graphRenderer = {
    drawGraph
  };
})(window.OpticsInterference);
