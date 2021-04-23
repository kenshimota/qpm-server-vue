<template>
  <div style="width: 200px; height: 200px" ref="div-box"></div>
</template>

<script>
import WebGl from 'webgl-show';
export default {
  props: ['width', 'height', 'length', 'color'],
  data: () => ({
    graph: null,
  }),

  mounted: function() {
    this.createfigure();
  },

  beforeDestroy: function() {
    delete this.graph;
  },

  methods: {
    createfigure: async function() {
      const { width, height, length } = this;
      const data = { maxWidth: 200, maxHeight: 200 };
      const element = this.$refs['div-box'];
      const graph = await WebGl({
        element,
        width: data.maxWidth,
        height: data.maxHeight,
        color: 0xffffff,
      });

      if (width < height) {
        data.width = (data.maxWidth * width) / height;
        data.height = data.maxHeight;
      } else {
        data.height = (data.maxHeight * height) / width;
        data.width = data.maxWidth;
      }

      console.log(length, data);

      const cube = graph.createFigure({
        geometry: 'BoxGeometry',
        material: { color: this.color, type: 'basic' },
        attributes: [data.width / 100, data.height / 100, length / 100],
      });

      cube.animation = function() {
        //this.figure.rotation.y += 0.01;
        this.figure.rotation.x += 0.02;
      };

      graph.setLight({ intensity: 0.4, color: 0x000000, position: { x: -3, y: -5, z: 20 } });
      graph.addFigure(cube);
      this.graph = graph;
    },
  },
};
</script>
