<template>
  <div :style="{ width: cvWidth, height: cvHeight }" ref="div-pallet"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');

export default {
  props: ['width', 'height', 'length', 'color', 'dwWidth', 'dwHeight'],
  data: () => ({
    graph: null,
    cvWidth: 300,
    cvHeight: 300,
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
        let { width, height, color } = this;
        const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
        const element = this.$refs['div-pallet'];

        if (!color) color = 0x827a02;

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

        const shape = graph.createFigure({ geometry: 'Shape' });
        shape.figure.moveTo(0, 0);
        shape.figure.lineTo(0, 8);
        shape.figure.lineTo(8, 8);
        shape.figure.lineTo(8, 0);
        shape.figure.lineTo(0, 0);

        const holePath = graph.createFigure({ geometry: 'Path' });
        holePath.figure.moveTo(0.7, 0.7);
        holePath.figure.lineTo(0.7, 7.3);
        holePath.figure.lineTo(7.3, 7.3);
        holePath.figure.lineTo(7.3, 0.7);
        holePath.figure.lineTo(0.7, 0.7);

        shape.figure.holes.push(holePath.figure);

        const shapeGeometry = graph.createFigure({
          geometry: 'ExtrudeGeometry',
          material: {
            emissive: color,
            opacity: 1,
            side: THREE.DoubleSide,
          },
          attributes: [shape.figure, { depth: 1, bevelEnabled: false }],
        });

        shapeGeometry.setPosition({ x: 0, y: 3, z: -12 });

        shapeGeometry.animation = function() {
          this.figure.rotation.x = -1;
          this.figure.rotation.z -= 0.012;
        };

        const cylinderBottomLeft = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [0.7, 8, 0.7],
          positions: { x: 0.35, y: 4, z: -0.2 },
        });

        const cylinderBottomRight = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [0.7, 8, 0.7],
          positions: { x: 7.6, y: 4, z: -0.3 },
        });

        const cylinderBottomCenter = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [0.7, 8, 0.7],
          positions: { x: 4, y: 4, z: -0.5 },
        });

        const cylinderTopRight = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [1.4, 8, 0.3],
          positions: { x: 7.3, y: 4, z: 1 },
        });

        const cylinderTopLeft = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [1.4, 8, 0.3],
          positions: { x: 0.7, y: 4, z: 1 },
        });

        const cylinderTopCenter = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [0.7, 8, 0.3],
          positions: { x: 4, y: 4, z: 1 },
        });

        const cylinderTopCenterCenter = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [8, 0.7, 0.3],
          positions: { x: 4, y: 4, z: 1 },
        });

        shapeGeometry.add(cylinderBottomLeft);
        shapeGeometry.add(cylinderBottomRight);
        shapeGeometry.add(cylinderBottomCenter);
        shapeGeometry.add(cylinderTopRight);
        shapeGeometry.add(cylinderTopLeft);
        shapeGeometry.add(cylinderTopCenter);
        shapeGeometry.add(cylinderTopCenterCenter);

        graph.setLight({ intensity: 0.4, color: 0xffffff, position: { x: -3, y: -5, z: 2 } });
        graph.setLight({ intensity: 0.4, color: 0x000000, position: { x: -3, y: -5, z: -2 } });
        graph.addFigure(shapeGeometry);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
