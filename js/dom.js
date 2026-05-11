"use strict";

(function initDom(namespace) {
  const elements = {
    patternCanvas: document.getElementById("patternCanvas"),
    graphCanvas: document.getElementById("graphCanvas"),
    schematicCanvas: document.getElementById("schematicCanvas"),
    wavelengthInput: document.getElementById("wavelengthInput"),
    slitDistanceInput: document.getElementById("slitDistanceInput"),
    screenDistanceInput: document.getElementById("screenDistanceInput"),
    phaseInput: document.getElementById("phaseInput"),
    wavelengthNumber: document.getElementById("wavelengthNumber"),
    slitDistanceNumber: document.getElementById("slitDistanceNumber"),
    screenDistanceNumber: document.getElementById("screenDistanceNumber"),
    phaseNumber: document.getElementById("phaseNumber"),
    slitCountInput: document.getElementById("slitCountInput"),
    resetButton: document.getElementById("resetButton"),
    wavelengthValue: document.getElementById("wavelengthValue"),
    slitDistanceValue: document.getElementById("slitDistanceValue"),
    screenDistanceValue: document.getElementById("screenDistanceValue"),
    phaseValue: document.getElementById("phaseValue"),
    screenSpanValue: document.getElementById("screenSpanValue"),
    colorName: document.getElementById("colorName")
  };

  namespace.dom = {
    elements,
    patternCtx: elements.patternCanvas.getContext("2d"),
    graphCtx: elements.graphCanvas.getContext("2d"),
    schematicCtx: elements.schematicCanvas.getContext("2d")
  };
})(window.OpticsInterference);
