"use strict";

(function initSchematicRenderer(namespace) {
  const { elements, schematicCtx } = namespace.dom;
  const { screenHalfSpanM } = namespace.config;

  function drawSchematic(params) {
    const canvas = elements.schematicCanvas;
    const { width, height } = canvas;
    const ctx = schematicCtx;
    const color = namespace.colors.wavelengthToRgb(params.wavelengthNm);
    const lightColor = namespace.colors.rgbToString(color);
    const centerY = height / 2;
    const sourceX = width * 0.12;
    const firstSlitX = params.secondLevelSlitCount > 0 ? width * 0.28 : width * 0.34;
    const secondSlitX = width * 0.52;
    const screenX = width * 0.82;
    const firstSlitPositions = getSlitPositions(params.slitCount, centerY);
    const secondSlitPositions = getSlitPositions(params.secondLevelSlitCount, centerY);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fbfdff";
    ctx.fillRect(0, 0, width, height);

    drawSource(ctx, sourceX, centerY, lightColor);
    drawBarrier(ctx, firstSlitX, centerY, firstSlitPositions, height);
    if (params.secondLevelSlitCount > 0) {
      drawBarrier(ctx, secondSlitX, centerY, secondSlitPositions, height);
    }
    drawScreen(ctx, screenX, centerY, lightColor, params, height);
    drawLightRays(
      ctx,
      sourceX,
      firstSlitX,
      params.secondLevelSlitCount > 0 ? secondSlitX : null,
      screenX,
      centerY,
      firstSlitPositions,
      secondSlitPositions,
      lightColor
    );
    drawMeasurements(ctx, firstSlitX, secondSlitX, screenX, firstSlitPositions, secondSlitPositions, height, params);

    ctx.fillStyle = "#334155";
    ctx.font = "700 12px Segoe UI, Arial, sans-serif";
    ctx.fillText("свет", sourceX - 14, centerY + 72);
    ctx.fillText("щели 1", firstSlitX - 18, 28);
    if (params.secondLevelSlitCount > 0) {
      ctx.fillText("щели 2", secondSlitX - 18, 28);
    }
    ctx.fillText("экран", screenX - 18, 28);
  }

  function getSlitPositions(slitCount, centerY) {
    if (slitCount <= 0) {
      return [];
    }

    if (slitCount === 2) {
      return [centerY - 28, centerY + 28];
    }

    return [centerY - 38, centerY, centerY + 38];
  }

  function drawSource(ctx, x, y, lightColor) {
    ctx.save();
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 2;

    for (let radius = 14; radius <= 44; radius += 15) {
      ctx.beginPath();
      ctx.arc(x, y, radius, -0.8, 0.8);
      ctx.stroke();
    }

    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBarrier(ctx, x, centerY, slitPositions, height) {
    const halfHeight = Math.min(76, height * 0.36);

    ctx.save();
    ctx.fillStyle = "#334155";
    ctx.fillRect(x - 6, centerY - halfHeight, 12, halfHeight * 2);

    ctx.fillStyle = "#fbfdff";
    slitPositions.forEach(y => {
      ctx.fillRect(x - 8, y - 7, 16, 14);
    });

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    slitPositions.forEach(y => {
      ctx.strokeRect(x - 8, y - 7, 16, 14);
    });
    ctx.restore();
  }

  function drawScreen(ctx, x, centerY, lightColor, params, height) {
    const halfHeight = Math.min(82, height * 0.38);

    ctx.save();
    ctx.fillStyle = "#dbe7f3";
    ctx.fillRect(x - 6, centerY - halfHeight, 12, halfHeight * 2);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 6, centerY - halfHeight, 12, halfHeight * 2);

    for (let y = centerY - halfHeight + 8; y <= centerY + halfHeight - 8; y += 4) {
      const screenY = (y - centerY) / halfHeight * screenHalfSpanM;
      const intensity = namespace.physics.getIntensity(screenY, params);
      ctx.strokeStyle = namespace.colors.mixWithBlack(lightColor, Math.pow(intensity, 0.7));
      ctx.beginPath();
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 32, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLightRays(ctx, sourceX, firstSlitX, secondSlitX, screenX, centerY, firstSlitPositions, secondSlitPositions, lightColor) {
    ctx.save();
    ctx.strokeStyle = lightColor;
    ctx.globalAlpha = 0.48;
    ctx.lineWidth = 1.8;

    firstSlitPositions.forEach(y => {
      ctx.beginPath();
      ctx.moveTo(sourceX + 14, centerY);
      ctx.lineTo(firstSlitX - 10, y);
      ctx.stroke();

      if (secondSlitX !== null) {
        secondSlitPositions.forEach(secondY => {
          ctx.beginPath();
          ctx.moveTo(firstSlitX + 10, y);
          ctx.lineTo(secondSlitX - 10, secondY);
          ctx.stroke();
        });
      } else {
        ctx.beginPath();
        ctx.moveTo(firstSlitX + 10, y);
        ctx.lineTo(screenX - 10, centerY);
        ctx.stroke();
      }
    });

    if (secondSlitX !== null) {
      secondSlitPositions.forEach(y => {
        ctx.beginPath();
        ctx.moveTo(secondSlitX + 10, y);
        ctx.lineTo(screenX - 10, centerY);
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  function drawMeasurements(ctx, firstSlitX, secondSlitX, screenX, firstSlitPositions, secondSlitPositions, height, params) {
    const firstY = firstSlitPositions[0];
    const secondY = firstSlitPositions[1];
    const measureX = firstSlitX - 28;
    const arrowY = height - 22;

    ctx.save();
    ctx.strokeStyle = "#f59e0b";
    ctx.fillStyle = "#92400e";
    ctx.lineWidth = 2;
    ctx.font = "700 12px Segoe UI, Arial, sans-serif";

    if (firstSlitPositions.length > 1) {
      drawArrow(ctx, measureX, firstY, measureX, secondY);
      drawArrow(ctx, measureX, secondY, measureX, firstY);
      ctx.fillText("d", measureX - 18, (firstY + secondY) / 2 + 5);
    }

    if (params.secondLevelSlitCount > 0 && secondSlitPositions.length > 1) {
      const secondMeasureX = secondSlitX + 28;
      drawArrow(ctx, secondMeasureX, secondSlitPositions[0], secondMeasureX, secondSlitPositions[1]);
      drawArrow(ctx, secondMeasureX, secondSlitPositions[1], secondMeasureX, secondSlitPositions[0]);
      ctx.fillText("d₂", secondMeasureX + 6, (secondSlitPositions[0] + secondSlitPositions[1]) / 2 + 5);
    }

    drawArrow(ctx, firstSlitX + 18, arrowY, screenX - 18, arrowY);
    drawArrow(ctx, screenX - 18, arrowY, firstSlitX + 18, arrowY);
    ctx.fillText("L", (firstSlitX + screenX) / 2 - 4, arrowY - 10);

    ctx.restore();
  }

  function drawArrow(ctx, x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const head = 8;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45));
    ctx.lineTo(x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45));
    ctx.closePath();
    ctx.fill();
  }

  namespace.schematicRenderer = {
    drawSchematic
  };
})(window.OpticsInterference);
