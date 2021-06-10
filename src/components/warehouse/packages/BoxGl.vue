<template>
  <div :style="{ width: cvWidth, height: cvHeight }" ref="div-box"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');

// console.log(DoubleSide);

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
        const { width, height } = this;
        const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
        const element = this.$refs['div-box'];
        let length = this.length;

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

        data.width = data.width / 100;
        data.height = data.height / 100;
        length = length / 100;

        const cubeParent = graph.createFigure({
          geometry: 'BoxGeometry',
          attributes: [data.width, data.height, length],
          material: {
            type: 'lambert',
            emissive: 0x000000,
            transparent: true,
            opacity: 0.6,
            wireframe: true,
          },
        });

        const cube = graph.createFigure({
          geometry: 'BoxGeometry',
          attributes: [data.width, data.height, length],
          material: {
            type: 'lambert',
            emissive: this.color,
            transparent: true,
            opacity: 0.9,
          },
        });

        cubeParent.add(cube);

        cubeParent.animation = function() {
          this.figure.rotation.y += 0.01;
          this.figure.rotation.x += 0.01;
        };

        graph.setLight({ intensity: 0.1, color: 0x111111, position: { x: 1, y: 1, z: 4 } });
        graph.setLight({ intensity: 0.1, color: 0xffffff, position: { x: -1, y: -2, z: 4 } });
        graph.addFigure(cubeParent); // (cube);
        this.graph = graph;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
