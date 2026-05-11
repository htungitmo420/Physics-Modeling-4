"use strict";

(function initUi(namespace) {
  const { elements } = namespace.dom;
  const { defaults, screenHalfSpanM } = namespace.config;

  function readParams() {
    return {
      wavelengthNm: readNumberValue(elements.wavelengthNumber, elements.wavelengthInput),
      slitDistanceMm: readNumberValue(elements.slitDistanceNumber, elements.slitDistanceInput),
      screenDistanceM: readNumberValue(elements.screenDistanceNumber, elements.screenDistanceInput),
      phaseRad: readNumberValue(elements.phaseNumber, elements.phaseInput),
      slitCount: Number.parseInt(elements.slitCountInput.value, 10),
      secondLevelSlitCount: Number.parseInt(elements.secondLevelInput.value, 10),
      secondSlitDistanceMm: readNumberValue(elements.secondSlitDistanceNumber, elements.secondSlitDistanceInput)
    };
  }

  function updateLabels(params) {
    elements.wavelengthValue.textContent = `${params.wavelengthNm.toFixed(0)} нм`;
    elements.slitDistanceValue.textContent = `${params.slitDistanceMm.toFixed(2)} мм`;
    elements.screenDistanceValue.textContent = `${params.screenDistanceM.toFixed(2)} м`;
    elements.phaseValue.textContent = `${params.phaseRad.toFixed(2)} рад (${(params.phaseRad / Math.PI).toFixed(2)}π)`;
    elements.secondSlitDistanceValue.textContent = `${params.secondSlitDistanceMm.toFixed(2)} мм`;
    elements.screenSpanValue.textContent = `±${(screenHalfSpanM * 1000).toFixed(1)} мм`;
    elements.colorName.textContent = `${namespace.colors.getColorName(params.wavelengthNm)} свет`;
    updateSecondLevelState(params.secondLevelSlitCount);
  }

  function resetControls() {
    elements.wavelengthInput.value = defaults.wavelengthNm;
    elements.wavelengthNumber.value = defaults.wavelengthNm;
    elements.slitDistanceInput.value = defaults.slitDistanceMm;
    elements.slitDistanceNumber.value = defaults.slitDistanceMm;
    elements.screenDistanceInput.value = defaults.screenDistanceM;
    elements.screenDistanceNumber.value = defaults.screenDistanceM;
    elements.phaseInput.value = defaults.phaseRad;
    elements.phaseNumber.value = defaults.phaseRad;
    elements.slitCountInput.value = String(defaults.slitCount);
    elements.secondLevelInput.value = String(defaults.secondLevelSlitCount);
    elements.secondSlitDistanceInput.value = defaults.secondSlitDistanceMm;
    elements.secondSlitDistanceNumber.value = defaults.secondSlitDistanceMm;
  }

  function bindControls(handler) {
    [
      [elements.wavelengthInput, elements.wavelengthNumber],
      [elements.slitDistanceInput, elements.slitDistanceNumber],
      [elements.screenDistanceInput, elements.screenDistanceNumber],
      [elements.phaseInput, elements.phaseNumber],
      [elements.secondSlitDistanceInput, elements.secondSlitDistanceNumber]
    ].forEach(([rangeInput, numberInput]) => {
      rangeInput.addEventListener("input", () => {
        numberInput.value = rangeInput.value;
        handler();
      });

      numberInput.addEventListener("input", () => {
        if (numberInput.value === "") {
          return;
        }

        const value = capToMax(numberInput);
        if (value === null) {
          return;
        }

        numberInput.value = value;
        rangeInput.value = value;
        handler();
      });
    });

    elements.slitCountInput.addEventListener("change", handler);
    elements.secondLevelInput.addEventListener("change", handler);
    elements.resetButton.addEventListener("click", () => {
      resetControls();
      handler();
    });
  }

  function updateSecondLevelState(slitCount) {
    const isEnabled = slitCount > 0;

    elements.secondDistanceControl.classList.toggle("is-disabled", !isEnabled);
    elements.secondSlitDistanceInput.disabled = !isEnabled;
    elements.secondSlitDistanceNumber.disabled = !isEnabled;
  }

  function readNumberValue(numberInput, fallbackInput) {
    const value = Number.parseFloat(numberInput.value);

    if (!Number.isNaN(value)) {
      return value;
    }

    return Number.parseFloat(fallbackInput.value);
  }

  function capToMax(input) {
    const value = Number.parseFloat(input.value);
    const max = Number.parseFloat(input.max);

    if (Number.isNaN(value)) {
      return null;
    }

    if (!Number.isNaN(max) && value > max) {
      return max;
    }

    return value;
  }

  namespace.ui = {
    readParams,
    updateLabels,
    resetControls,
    bindControls
  };
})(window.OpticsInterference);
