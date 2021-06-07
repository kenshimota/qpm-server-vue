<template>
  <div :style="{ width: cvWidth, height: cvHeight }" ref="div-box"></div>
</template>

<script>
import WebGl from 'webgl-show';
export default {
  props: ['width', 'height', 'length', 'color', 'dwWidth', 'dwHeight'],
  data: () => ({
    graph: null,
    cvWidth: 200,
    cvHeight: 200,
  }),

  mounted: function() {
    if (this.dwWidth) this.cvWidth = this.dwWidth;
    if (this.dwHeight) this.cvHeight = this.dwHeight;
    this.createfigure();
  },

  beforeDestroy: function() {
    delete this.graph;
  },

  methods: {
    createfigure: async function() {
      try {
        const { width, height, length } = this;
        const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
        const element = this.$refs['div-box'];

        const graph = await WebGl({
          element,
          width: data.maxWidth,
          height: data.maxHeight,
          color: 'transparent',
        });

        if (width < height) {
          data.width = (data.maxWidth * width) / height;
          data.height = data.maxHeight;
        } else {
          data.height = (data.maxHeight * height) / width;
          data.width = data.maxWidth;
        }

        const cube = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: this.color },
          attributes: [data.width / 100, data.height / 100, length / 100],
        });

        cube.animation = function() {
          this.figure.rotation.y += 0.01;
          this.figure.rotation.x += 0.01;
        };

        graph.setLight({ intensity: 0.1, color: 0x111111, position: { x: 1, y: 1, z: 4 } });
        graph.setLight({ intensity: 0.1, color: 0xffffff, position: { x: -1, y: -2, z: 4 } });
        graph.addFigure(cube);
        this.graph = graph;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
