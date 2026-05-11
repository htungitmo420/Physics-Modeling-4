"use strict";

(function initPatternRenderer(namespace) {
  const { elements, patternCtx } = namespace.dom;

  function drawPattern(params) {
    const canvas = elements.patternCanvas;
    const { width, height } = canvas;
    const color = namespace.colors.wavelengthToRgb(params.wavelengthNm);
    const image = patternCtx.createImageData(width, height);

    for (let x = 0; x < width; x += 1) {
      const screenY = namespace.physics.screenYFromPixel(x, width);
      const intensity = namespace.physics.getIntensity(screenY, params);
      const visualIntensity = Math.pow(intensity, 0.72);

      for (let row = 0; row < height; row += 1) {
        const verticalGlow = 0.82 + 0.18 * Math.cos((row - height / 2) / (height / 2) * Math.PI);
        const value = namespace.physics.clamp01(visualIntensity * verticalGlow);
        const index = (row * width + x) * 4;

        image.data[index] = Math.round(color.r * value);
        image.data[index + 1] = Math.round(color.g * value);
        image.data[index + 2] = Math.round(color.b * value);
        image.data[index + 3] = 255;
      }
    }

    patternCtx.putImageData(image, 0, 0);
    drawPatternFrame(patternCtx, canvas);
  }

  function drawPatternFrame(ctx, canvas) {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.font = "700 14px Segoe UI, Arial, sans-serif";
    ctx.fillText("экран", 24, 36);
    ctx.fillText("y = 0", canvas.width / 2 - 16, canvas.height - 24);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(canvas.width / 2, canvas.height - 20);
    ctx.stroke();
    ctx.restore();
  }

  namespace.patternRenderer = {
    drawPattern
  };
})(window.OpticsInterference);
