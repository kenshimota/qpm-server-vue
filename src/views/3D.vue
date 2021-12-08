<template>
  <div>
    <div ref="node-graph" style="width: 100%; height: 600px" />
  </div>
</template>

<script>
import Cube from "../object-reactive/Cube";
import WarehouseWithPallets from "../object-reactive/WarehouseWithPallets";
import { renderTHREE } from "../object-reactive/TreeNode";

const App = function() {
  const warehouse = this.createNode({}, WarehouseWithPallets);
  const figure = this.createFigure({ geometry: "Object3D" }, (figure) =>
    figure.add(warehouse.template)
  );

  return figure;
};

export default {
  mounted: async function() {
    const element = this.$refs["node-graph"];
    renderTHREE({ element, callback: App, logs: true, color: "white" });
  },
};
</script>
