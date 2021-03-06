<template>
  <div :style="{ width: cvWidth, height: cvHeight }" ref="div-box"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');

const disposeFigure = function() {
  try {
    const { cubeParent, cube } = this;
    if (!cubeParent) return;
    const { data, length } = this.createCalculate();
    cube.figure.material.emissive = new THREE.Color(this.color);
    cubeParent.setAttributes([data.width, data.height, length]);
    cube.setAttributes([data.width, data.height, length]);
  } catch (error) {
    console.error(error);
  }
};

export default {
  props: ['width', 'height', 'length', 'color', 'dwWidth', 'dwHeight'],
  data: () => ({
    graph: {},
    cvWidth: 300,
    cvHeight: 300,
    cubeParent: null,
    cube: null,
  }),

  mounted: function() {
    if (this.dwWidth) this.cvWidth = this.dwWidth;
    if (this.dwHeight) this.cvHeight = this.dwHeight;
    this.createfigure();
  },

  beforeDestroy: function() {
    delete this.graph;
  },

  watch: {
    height: disposeFigure,
    width: disposeFigure,
    length: disposeFigure,
    color: disposeFigure,
  },

  methods: {
    createCalculate: function() {
      const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
      const { width, height } = this;
      let length = this.length;

      if (width < height) {
        data.width = (data.maxWidth * width) / height;
        length = (data.maxWidth * length) / height;
        data.height = data.maxHeight;
      } else {
        data.height = (data.maxHeight * height) / width;
        length = (data.maxHeight * length) / width;
        data.width = data.maxWidth;
      }

      data.width = data.width / 100;
      data.height = data.height / 100;
      length = length / 100;

      return { data, length };
    },

    createCube: function({ graph }) {
      try {
        const { data, length } = this.createCalculate();

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
        cubeParent.add(cube);

        cubeParent.animation = function() {
          this.figure.rotation.y += 0.01;
          this.figure.rotation.x += 0.01;
        };

        this.cubeParent = cubeParent;
        this.cube = cube;
        graph.addFigure(cubeParent);
      } catch (error) {
        console.error(error);
      }
    },

    createfigure: async function() {
      try {
        const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
        const element = this.$refs['div-box'];

        const graph = await WebGl({
          element,
          width: data.maxWidth,
          height: data.maxHeight,
          color: 'white',
        });

        graph.setLight({ intensity: 0.4, color: 0x111111, position: { x: 1, y: 1, z: 4 } });
        graph.setLight({ intensity: 0.3, color: 0xffffff, position: { x: -1, y: -2, z: 4 } });
        this.graph = graph;

        this.createCube({ data, graph });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
