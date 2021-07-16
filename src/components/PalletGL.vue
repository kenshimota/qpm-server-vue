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
  props: ['width', 'height', 'length', 'color', 'dwWidth', 'dwHeight', 'fullbox'],
  data: () => ({
    graph: null,
    shapeGeometry: null,
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
    // esta funcion se encarga de calcular y empezar agregar las cajas
    createBox: function({ width, height, length, color }) {
      const { graph } = this;

      const cube = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [width, height, length],
        material: {
          emissive: color,
          transparent: true,
          opacity: 0.9,
        },
      });

      const cubeParent = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [width, height, length],
        material: {
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        },
      });
      cubeParent.add(cube);

      return cubeParent;
    },

    setFigure: function(space, figure, dimensions) {
      if (space.minX + dimensions.width > space.maxX) {
        space.minX = space.initX;
        space.minY += dimensions.length;
      }

      if (space.minY + dimensions.length > space.maxY) {
        space.minX = space.initX;
        space.minY = space.initY;
        space.minZ += dimensions.height;
      }

      //if (space.minZ + dimensions.height < space.maxZ)
      //  throw 'disculpe ya no hya espacio para seguir insertando';

      const point = {
        z: space.minZ + dimensions.height / 2,
        y: space.minY + dimensions.length / 2,
        x: space.minX + dimensions.width / 2,
      };

      figure.setPosition(point);
      space.minX += dimensions.width;
    },

    setFullBoxes: function(data) {
      const { width, length } = data;
      const height = width / 5;
      const { shapeGeometry, graph } = this;
      const spaceFigure = {
        minZ: data.holeWidth + data.holeWidth,
        maxZ: data.holeWidth * 12,
        initX: -data.width / 2,
        minX: -data.width / 2,
        maxX: data.width / 2,
        initY: -data.length / 2,
        minY: -data.length / 2,
        maxY: data.length / 2,
      };

      for (let i = 0; i < 100; i++) {
        const params = { width: width / 5, height, length: length / 5, color: 'yellow' };
        const box = this.createBox(params);
        this.setFigure(spaceFigure, box, params);
        shapeGeometry.add(box);
      }

      const { camera } = graph;
      camera.position.z *= 1.6;
    },

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
          // this.figure.rotation.y -= 0.01;
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

        console.log(camera);

        this.shapeGeometry = shapeGeometry;
        this.graph = graph;

        if (this.fullbox) this.setFullBoxes(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
