"use strict";

(function initApp(namespace) {
  function updateSimulation() {
    const params = namespace.ui.readParams();
    namespace.ui.updateLabels(params);
    namespace.patternRenderer.drawPattern(params);
    namespace.graphRenderer.drawGraph(params);
    namespace.schematicRenderer.drawSchematic(params);
  }

  namespace.updateSimulation = updateSimulation;
  namespace.ui.bindControls(updateSimulation);
  updateSimulation();
})(window.OpticsInterference);
