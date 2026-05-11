"use strict";

window.OpticsInterference = window.OpticsInterference || {};

(function initConfig(namespace) {
  namespace.config = {
    defaults: {
      wavelengthNm: 550,
      slitDistanceMm: 0.25,
      screenDistanceM: 1.5,
      phaseRad: 0,
      slitCount: 2,
      secondLevelSlitCount: 0,
      secondSlitDistanceMm: 0.4
    },
    screenHalfSpanM: 0.008
  };
})(window.OpticsInterference);
