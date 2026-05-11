"use strict";

(function initColors(namespace) {
  function wavelengthToRgb(wavelength) {
    let r = 0;
    let g = 0;
    let b = 0;

    if (wavelength >= 380 && wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380);
      b = 1;
    } else if (wavelength < 490) {
      g = (wavelength - 440) / (490 - 440);
      b = 1;
    } else if (wavelength < 510) {
      g = 1;
      b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1;
    } else if (wavelength < 645) {
      r = 1;
      g = -(wavelength - 645) / (645 - 580);
    } else {
      r = 1;
    }

    let factor = 1;
    if (wavelength < 420) {
      factor = 0.35 + 0.65 * (wavelength - 380) / (420 - 380);
    } else if (wavelength > 700) {
      factor = 0.35 + 0.65 * (750 - wavelength) / (750 - 700);
    }

    return {
      r: Math.round(255 * Math.pow(r * factor, 0.8)),
      g: Math.round(255 * Math.pow(g * factor, 0.8)),
      b: Math.round(255 * Math.pow(b * factor, 0.8))
    };
  }

  function getColorName(wavelength) {
    if (wavelength < 450) {
      return "фиолетовый";
    }
    if (wavelength < 495) {
      return "синий";
    }
    if (wavelength < 570) {
      return "зелёный";
    }
    if (wavelength < 590) {
      return "жёлтый";
    }
    if (wavelength < 620) {
      return "оранжевый";
    }
    return "красный";
  }

  function rgbToString(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  function mixWithBlack(rgbString, intensity) {
    const match = rgbString.match(/\d+/g).map(Number);
    return `rgb(${Math.round(match[0] * intensity)}, ${Math.round(match[1] * intensity)}, ${Math.round(match[2] * intensity)})`;
  }

  namespace.colors = {
    wavelengthToRgb,
    getColorName,
    rgbToString,
    mixWithBlack
  };
})(window.OpticsInterference);
