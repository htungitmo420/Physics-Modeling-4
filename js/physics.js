"use strict";

(function initPhysics(namespace) {
  const { screenHalfSpanM } = namespace.config;

  function getIntensity(screenY, params) {
    const lambdaM = params.wavelengthNm * 1e-9;
    const slitDistanceM = params.slitDistanceMm * 1e-3;
    const distanceToScreenM = params.screenDistanceM;
    const firstLevel = getSlitLevelIntensity(
      screenY,
      lambdaM,
      slitDistanceM,
      distanceToScreenM,
      params.phaseRad,
      params.slitCount
    );

    if (params.secondLevelSlitCount > 0) {
      const secondSlitDistanceM = params.secondSlitDistanceMm * 1e-3;
      const secondLevel = getSlitLevelIntensity(
        screenY,
        lambdaM,
        secondSlitDistanceM,
        distanceToScreenM,
        0,
        params.secondLevelSlitCount
      );

      return clamp01(firstLevel * secondLevel);
    }

    return firstLevel;
  }

  function getSlitLevelIntensity(screenY, lambdaM, slitDistanceM, distanceToScreenM, phaseRad, slitCount) {
    // Модель для двух щелей:
    // delta = d * y / L, dPhi = 2*pi*delta/lambda + phi,
    // I(y) = I0 * cos^2(dPhi / 2). Здесь I0 = 1.
    if (slitCount === 2) {
      const pathDifference = slitDistanceM * screenY / distanceToScreenM;
      const phaseDifference = 2 * Math.PI * pathDifference / lambdaM + phaseRad;
      return clamp01(Math.cos(phaseDifference / 2) ** 2);
    }

    // Упрощённая модель для трёх щелей: складываем амплитуды волн.
    // Фаза соседних щелей отличается на 2*pi*d*y/(lambda*L) + phi.
    const phaseStep = 2 * Math.PI * slitDistanceM * screenY / (lambdaM * distanceToScreenM) + phaseRad;
    let amplitude = 0;

    for (let slitIndex = 0; slitIndex < 3; slitIndex += 1) {
      const centeredIndex = slitIndex - 1;
      amplitude += Math.cos(centeredIndex * phaseStep);
    }

    return clamp01((amplitude * amplitude) / 9);
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function screenYFromPixel(x, width) {
    const normalized = x / (width - 1) - 0.5;
    return normalized * 2 * screenHalfSpanM;
  }

  namespace.physics = {
    getIntensity,
    clamp01,
    screenYFromPixel
  };
})(window.OpticsInterference);
