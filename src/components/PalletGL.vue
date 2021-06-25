<template>
  <div :style="{ width: cvWidth, height: cvHeight }" ref="div-pallet"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');

const initWatch = function() {
  this.createfigure();
};

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

  watch: {
    width: initWatch,
    height: initWatch,
    length: initWatch,
    color: initWatch,
  },

  methods: {
    createfigure: async function() {
      try {
        let { width, height, length, color } = this;
        const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
        const element = this.$refs['div-pallet'];
        element.innerHTML = '';

        if (!color) color = 0x827a02;

        const graph = await WebGl({
          element,
          width: data.maxWidth,
          height: data.maxHeight,
          color: 'transparent',
        });

        if (width < height) {
          data.width = (data.maxWidth * width) / height;
          data.length = (data.maxWidth * length) / height;
          data.height = data.maxHeight;
        } else if (length > width && length > height) {
          data.height = (data.maxHeight * height) / length;
          data.width = (data.maxHeight * width) / length;
          data.length = data.maxWidth;
        } else {
          data.height = (data.maxHeight * height) / width;
          data.length = (data.maxHeight * length) / width;
          data.width = data.maxWidth;
        }

        data.height /= 10;
        data.width /= 10;
        data.length /= 10;

        const shape = graph.createFigure({ geometry: 'Shape' });
        shape.figure.moveTo(data.width / -2, data.length / -2);
        shape.figure.lineTo(data.width / -2, data.length / 2);
        shape.figure.lineTo(data.width / 2, data.length / 2);
        shape.figure.lineTo(data.width / 2, data.length / -2);
        shape.figure.lineTo(data.width / -2, data.length / -2);

        data.holeWidth = data.width * 0.1;

        const holePath = graph.createFigure({ geometry: 'Path' });
        holePath.figure.moveTo(data.width / -2 + data.holeWidth, data.length / -2 + data.holeWidth);

        holePath.figure.lineTo(data.width / -2 + data.holeWidth, data.length / 2 - data.holeWidth);

        holePath.figure.lineTo(data.width / 2 - data.holeWidth, data.length / 2 - data.holeWidth);

        holePath.figure.lineTo(data.width / 2 - data.holeWidth, data.length / -2 + data.holeWidth);

        holePath.figure.lineTo(data.width / -2 + data.holeWidth, data.length / -2 + data.holeWidth);

        shape.figure.holes.push(holePath.figure);

        const shapeGeometry = graph.createFigure({
          geometry: 'ExtrudeGeometry',
          material: {
            emissive: color,
            opacity: 1,
            side: THREE.DoubleSide,
          },
          attributes: [shape.figure, { depth: data.holeWidth, bevelEnabled: false }],
        });

        shapeGeometry.setPosition({ x: 0, y: 0, z: 0 });

        shapeGeometry.animation = function() {
          this.figure.rotation.x = -1;
          this.figure.rotation.z -= 0.012;
        };

        data.widthPallet = data.holeWidth * 0.9;
        data.heightPallet = data.height - 2 * data.holeWidth;

        const cylinderBottomLeft = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.length, data.heightPallet],
          positions: {
            z: -data.heightPallet / 2,
            x: data.width / 2 - data.holeWidth / 2,
          },
        });

        const cylinderBottomRight = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.length, data.heightPallet],
          positions: {
            z: -data.heightPallet / 2,
            x: data.width / -2 + data.holeWidth / 2,
          },
        });

        const cylinderBottomCenter = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.length, data.heightPallet],
          positions: {
            z: -data.heightPallet / 2,
          },
        });

        const cylinderTopRight = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.length, data.widthPallet / 2],
          positions: {
            z: data.holeWidth + data.widthPallet / 2,
            x: data.width / -2 + data.holeWidth,
          },
        });

        const cylinderTopLeft = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.length, data.widthPallet / 2],
          positions: {
            z: data.holeWidth + data.widthPallet / 2,
            x: data.width / 2 - data.holeWidth,
          },
        });

        const cylinderTopCenter = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.length, data.widthPallet / 2],
          positions: {
            z: data.holeWidth + data.widthPallet / 2,
          },
        });

        const cylinderTopCenterCenter = graph.createFigure({
          geometry: 'BoxGeometry',
          material: { emissive: color },
          attributes: [data.widthPallet, data.width - 2 * data.holeWidth, data.widthPallet / 2],
          positions: { z: data.holeWidth + data.widthPallet / 2 },
        });

        cylinderTopCenterCenter.figure.rotation.z = Math.PI / 2;

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

        const { camera } = graph;
        camera.fov = 120;
        camera.position.z = (data.width > data.length ? data.width : data.length) * 1.1;
        camera.position.y = 0;
        camera.position.x = 0;
        camera.lookAt(shapeGeometry.figure.position);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
