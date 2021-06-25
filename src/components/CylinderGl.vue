<template>
  <div :style="{ width: cvWidth, height: cvHeight }" ref="div-cylinder"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');

const disposeFigure = function() {
  try {
    const { cylinderParent, cylinder } = this;
    if (!cylinderParent) return;
    const { radius, height } = this.createCalculate();

    cylinderParent.setAttributes([radius, radius, height]);
    cylinder.setAttributes([radius, radius, height]);
    cylinder.figure.material.emissive = new THREE.Color(this.color);
  } catch (error) {
    console.error(error);
  }
};

export default {
  props: ['radius', 'height', 'color', 'dwWidth', 'dwHeight'],
  data: () => ({
    graph: null,
    cvWidth: 300,
    cvHeight: 300,
    cylinderParent: null,
    cylinder: null,
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
    radius: disposeFigure,
    color: disposeFigure,
  },

  methods: {
    // se encarga de calcular el espacio en la escena determinada
    createCalculate: function() {
      const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
      const { radius, height } = this;

      if (radius <= height) {
        data.radius = (data.maxWidth * radius) / height;
        data.height = data.maxHeight;
      } else {
        data.height = (data.maxHeight * height) / radius;
        data.radius = data.maxWidth;
      }

      data.radius = data.radius / 100;
      data.height = data.height / 100;

      return data;
    },

    createCylinder: function({ graph }) {
      try {
        const { radius, height } = this.createCalculate();

        const cylinder = graph.createFigure({
          geometry: 'CylinderGeometry',
          attributes: [radius, radius, height],
          material: {
            type: 'lambert',
            emissive: this.color,
            transparent: true,
            opacity: 0.9,
          },
        });

        const cylinderParent = graph.createFigure({
          geometry: 'CylinderGeometry',
          attributes: [radius, radius, height],
          material: {
            type: 'lambert',
            emissive: 0x000000,
            transparent: true,
            opacity: 0.6,
            wireframe: true,
          },
        });

        cylinderParent.add(cylinder);

        cylinderParent.animation = function() {
          this.figure.rotation.y += 0.01;
          this.figure.rotation.x += 0.01;
        };

        this.cylinderParent = cylinderParent;
        this.cylinder = cylinder;
        graph.addFigure(cylinderParent);
      } catch (error) {
        console.error(error);
      }
    },

    createfigure: async function() {
      try {
        const data = { maxWidth: this.cvWidth, maxHeight: this.cvHeight };
        const element = this.$refs['div-cylinder'];

        const graph = await WebGl({
          element,
          width: data.maxWidth,
          height: data.maxHeight,
          color: 'white',
        });

        graph.setLight({ intensity: 0.4, color: 0x111111, position: { x: 1, y: 1, z: 4 } });
        graph.setLight({ intensity: 0.45, color: 0xffffff, position: { x: -1, y: -2, z: 4 } });
        this.graph = graph;

        this.createCylinder({ data, graph });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
