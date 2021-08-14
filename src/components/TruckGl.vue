<template>
  <div ref="div-truck"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls');

export default {
  props: ['dwWidth', 'dwHeight'],

  data: () => ({
    cvWidth: 150,
    cvHeight: 150,
    graph: null,
    controls: null,
    dataDefault: {
      height: 400,
      width: 100,
      depth: 200,
    },
  }),

  mounted: function() {
    setTimeout(() => this.initTruck(), 200);
  },

  methods: {
    // funcion que se encarga de crear el contenedor
    createWall: async function({ width, height, emissive }) {
      const { graph } = this;

      const textureLoader = new THREE.TextureLoader();
      const containerImg = await require('../assets/container.jpg');
      const boxTexture = textureLoader.load(containerImg);
      boxTexture.wrapS = THREE.RepeatWrapping;
      boxTexture.wrapT = THREE.RepeatWrapping;
      boxTexture.repeat.set(20, 20);

      const material = { type: 'basic', map: boxTexture, opacity: 0.6 };
      if (emissive) {
        delete material.type;
        material.emissive = emissive;
      }

      const wall = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [width, height, 1],
        material,
      });

      return wall;
    },

    // funcion que se encarga de crear el contenedor
    createContainer: async function() {
      const data = this.dataDefault;
      const { width, height } = data;
      const { graph } = this;

      const container = graph.createFigure({ geometry: 'Object3D' });

      const wall = await this.createWall({ width, height });
      wall.figure.rotation.z = Math.PI * 0.5;
      wall.figure.rotation.x = Math.PI * 0.5;
      container.add(wall);

      const wall1 = await this.createWall({ width: height, height: width });
      wall1.figure.position.y = width / 2;
      wall1.figure.position.z = width / 2;
      container.add(wall1);

      const wall2 = await this.createWall({ width: height, height: width });
      wall2.figure.position.y = width / 2;
      wall2.figure.position.z -= width / 2;
      container.add(wall2);

      const wall3 = await this.createWall({ width: width, height: width });
      wall3.figure.rotation.y = Math.PI / 2;
      wall3.figure.position.x = height / 2;
      wall3.figure.position.y = width / 2;

      container.add(wall3);
      return container;
    },

    initTruck: async function() {
      const div = this.$refs['div-truck'];
      const { dwWidth, dwHeight } = this;

      if (dwWidth) this.cvWidth = dwWidth;
      else this.cvWidth = div.clientWidth;

      if (dwHeight) this.cvHeight = dwHeight;
      else this.cvHeight = div.clientWidth;

      await this.createScene();
      const trailer = await this.createSemiTrailer();
      const container = await this.createContainer();
      const front = await this.createFront();

      const { graph } = this;
      const data = this.dataDefault;

      const object3d = graph.createFigure({ geometry: 'Object3D' });
      container.figure.position.y = data.width / 20;

      front.figure.position.y = data.width / 2.4;
      front.figure.position.x = data.width * 2.4;
      front.figure.position.z = -data.width / 2;

      object3d.add(front);
      object3d.add(container);
      object3d.add(trailer);

      graph.addFigure(object3d);
      // console.log(container.figure);
    },

    createCrystalLateral: function(points = [], color = '#5ca2ef') {
      const graph = this.graph;
      const frontShape = graph.createFigure({ geometry: 'Shape' });
      let figure = frontShape.figure;

      figure.moveTo(0, 0);
      for (const index in points) {
        const point = points[index];
        figure.lineTo(point[0], point[1]);
      }

      const frontGeometry = graph.createFigure({
        geometry: 'ExtrudeGeometry',
        attributes: [figure, { depth: 1, bevelEnabled: false }],
        material: { emissive: color, opacity: 1, side: THREE.DoubleSide },
      });

      return frontGeometry;
    },

    // funcion que se encarga de crear el frente del camion
    createFront: function() {
      // informacion inicial
      const data = this.dataDefault;
      const { width } = data;
      const { graph } = this;
      const distance = (width * 0.8) / 2;

      const points = [
        [-distance, -distance],
        [-distance, distance],
        [distance * 0.2, distance],
      ];

      let lastY = null;

      for (let i = 0; i < 80; i++) {
        const point = [];
        point[0] = distance * (0.2 + i / 100);
        point[1] = (distance / 100) * (100 - i);
        lastY = point[1];
        points.push(point);
      }

      points.push([distance * 1.5, lastY]);
      points.push([distance * 1.5, -distance]);

      const frontShape = graph.createFigure({ geometry: 'Shape' });
      let figure = frontShape.figure;

      figure.moveTo(0, 0);
      figure.lineTo(0, -distance);

      for (const index in points) {
        const point = points[index];
        figure.lineTo(point[0], point[1]);
      }

      figure.lineTo(0, -distance);

      const frontGeometry = graph.createFigure({
        geometry: 'ExtrudeGeometry',
        attributes: [figure, { depth: width, bevelEnabled: false }],
        material: { emissive: '#c2c220', opacity: 1, side: THREE.DoubleSide },
      });

      const startPoint = points[3];
      const finalPoint = points[points.length - 1];
      const heightCrystal = Math.sqrt(
        (finalPoint[0] - startPoint[0]) ** 2 + (finalPoint[1] - startPoint[1]) ** 2
      );

      console.log({ startPoint, finalPoint, heightCrystal });

      const crystal = graph.createFigure({
        geometry: 'PlaneGeometry',
        attributes: [heightCrystal * 0.4, width * 0.8],
        material: { emissive: '#5ca2ef', side: THREE.DoubleSide },
      });

      crystal.figure.position.x = width * 0.22;
      crystal.figure.position.z = width * 0.5;
      crystal.figure.position.y = width * 0.27;

      crystal.figure.rotation.x = 1.57;
      crystal.figure.rotation.y = 2.37;

      frontGeometry.add(crystal);

      const pointsCrystal = points.slice(1, points.length - 2);
      for (let j = 0; j < pointsCrystal.length; j++) {
        const point = pointsCrystal[j];
        pointsCrystal[j] = [point[0] * 0.9, point[1] * 0.9];
      }

      const startPointCrystal = pointsCrystal[0];
      const finalPointCrystal = pointsCrystal[pointsCrystal.length - 1];

      pointsCrystal.push([startPointCrystal[0], finalPointCrystal[1]]);
      pointsCrystal.push(startPointCrystal);

      const crystalLateral1 = this.createCrystalLateral(pointsCrystal);
      crystalLateral1.figure.position.z = -2;
      frontGeometry.add(crystalLateral1);

      const crystalLateral2 = this.createCrystalLateral(pointsCrystal);
      frontGeometry.add(crystalLateral2);
      crystalLateral2.figure.position.z = width;
      console.log(crystalLateral2.figure);

      const radius = width / 5;
      const wheele1 = this.createRubber(radius);
      wheele1.figure.position.y = -distance - radius;
      wheele1.figure.position.z = 0;
      wheele1.figure.rotation.y = Math.PI;
      wheele1.figure.rotation.x = 0;

      const wheele2 = this.createRubber(radius);
      wheele2.figure.position.y = -distance - radius;
      wheele2.figure.position.z = distance * 2.5;

      wheele2.figure.rotation.y = Math.PI;
      wheele2.figure.rotation.x = 0;

      frontGeometry.add(wheele1);
      frontGeometry.add(wheele2);

      return frontGeometry;
    },

    createRubber: function(radius, color = '#000') {
      const { graph } = this;
      const attributes = [radius, radius * 0.3, 100, radius * 10];

      const rubberChild = graph.createFigure({
        geometry: 'TorusGeometry',
        attributes,
        material: {
          emissive: color,
          color: '#fff',
        },
      });

      const ringChild = graph.createFigure({
        geometry: 'CylinderGeometry',
        attributes: [radius, radius * 0.4, 1],
        material: {
          emissive: '#999',
          color: '#fff',
        },
      });

      ringChild.figure.rotation.x -= Math.PI / 2;

      rubberChild.add(ringChild);
      attributes[2] = radius / 4;
      attributes[3] = radius * 1;
      const rubber = graph.createFigure({
        geometry: 'TorusGeometry',
        attributes,
        material: {
          transparent: true,
          opacity: 0.6,
          wireframe: true,
          type: 'lambert',
          emissive: '#fff',
        },
      });

      rubber.add(rubberChild);
      rubber.figure.rotation.x = Math.PI * 0.5;
      rubber.figure.position.z = radius * 1;
      return rubber;
    },

    // funcion que se ocupa del trailer del camion
    createSemiTrailer: function() {
      const { graph } = this;
      const data = this.dataDefault;
      let max = null,
        min = null;

      for (const index in data) {
        if (data[index] > max && data[index] != ' ') max = data[index];
        if (data[index] < min) min = data[index];
      }

      const attributes = [];
      attributes[0] = data.height;
      attributes[1] = data.width;
      attributes[2] = data.width / 20;

      const trailer = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes,
        material: {
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        },
      });

      const trailerChild = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes,
        position: { y: data.height * 0.3 },
        material: {
          color: '#666',
          emissive: '#333',
        },
      });

      trailer.add(trailerChild);
      trailer.figure.rotation.x = Math.PI * 0.5;

      const { camera, _scene } = graph;
      camera.position.z = max * 1.2;
      camera.lookAt(_scene.position);

      const radius = attributes[1] / 5;

      const rubber = this.createRubber(radius);
      rubber.figure.position.y = attributes[1] / 2 + radius / 3;
      rubber.figure.position.x += attributes[0] / 2 - radius;

      const rubber1 = this.createRubber(radius);
      rubber1.figure.position.y -= attributes[1] / 2 + radius / 3;
      rubber1.figure.position.x += attributes[0] / 2 - radius;

      const rubber2 = this.createRubber(radius);
      rubber2.figure.position.y = attributes[1] / 2 + radius / 3;
      rubber2.figure.position.x += attributes[0] / 2 - radius * 3.7;

      const rubber3 = this.createRubber(radius);
      rubber3.figure.position.y -= attributes[1] / 2 + radius / 3;
      rubber3.figure.position.x += attributes[0] / 2 - radius * 3.7;

      const rubber4 = this.createRubber(radius);
      rubber4.figure.position.y = attributes[1] / 2 + radius / 3;
      rubber4.figure.position.x -= attributes[0] / 2 - radius;

      const rubber5 = this.createRubber(radius);
      rubber5.figure.position.y -= attributes[1] / 2 + radius / 3;
      rubber5.figure.position.x -= attributes[0] / 2 - radius;

      const rubber6 = this.createRubber(radius);
      rubber6.figure.position.y = attributes[1] / 2 + radius / 3;
      rubber6.figure.position.x -= attributes[0] / 2 - radius * 3.7;

      const rubber7 = this.createRubber(radius);
      rubber7.figure.position.y -= attributes[1] / 2 + radius / 3;
      rubber7.figure.position.x -= attributes[0] / 2 - radius * 3.7;

      const rubber8 = this.createRubber(radius);
      rubber8.figure.position.y = attributes[1] / 2 + radius;
      rubber8.figure.position.x -= attributes[0] / 2 - radius;

      const rubber9 = this.createRubber(radius);
      rubber9.figure.position.y -= attributes[1] / 2 + radius;
      rubber9.figure.position.x -= attributes[0] / 2 - radius;

      const rubber10 = this.createRubber(radius);
      rubber10.figure.position.y = attributes[1] / 2 + radius;
      rubber10.figure.position.x -= attributes[0] / 2 - radius * 3.7;

      const rubber11 = this.createRubber(radius);
      rubber11.figure.position.y -= attributes[1] / 2 + radius;
      rubber11.figure.position.x -= attributes[0] / 2 - radius * 3.7;

      trailer.add(rubber);
      trailer.add(rubber2);
      trailer.add(rubber1);
      trailer.add(rubber3);

      trailer.add(rubber4);
      trailer.add(rubber5);
      trailer.add(rubber6);
      trailer.add(rubber7);

      trailer.add(rubber8);
      trailer.add(rubber9);
      trailer.add(rubber10);
      trailer.add(rubber11);

      return trailer;
    },

    // funcion que se encarga de crear un camion
    createScene: async function() {
      const { cvWidth, cvHeight } = this;
      const element = this.$refs['div-truck'];
      element.innerHTML = '';

      const graph = await WebGl({
        element,
        width: cvWidth,
        height: cvHeight,
        color: '#fff',
      });

      this.graph = graph;
      const { camera } = graph;

      // aplicando controles de moviemiento
      const controls = new OrbitControls(camera, element);
      this.controls = controls;
      controls.update();
    },
  },
};
</script>
