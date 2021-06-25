<template>
  <div ref="div-container-scene"></div>
</template>

<script>
import WebGl from 'webgl-show';
const THREE = require('three');

export default {
  props: ['container', 'list'],

  data: () => ({
    maxWidth: 0,
    maxHeight: 0,
    graph: null,
    plane: null,
    spaceFree: {},
    boxes: [],
    pallets: [],
    cylinders: [],
    container_render: {},
    exp: 0,
  }),

  mounted: function() {
    const div = this.$refs['div-container-scene'];

    setTimeout(async () => {
      this.maxWidth = div.clientWidth;
      this.maxHeight = div.clientWidth;
      this.initContainerSpace();

      await this.createScene();
    }, 200);
  },

  destroyed: function() {
    let { graph } = this;

    for (const index in graph._figures) {
      const item = graph._figures[index].figure;
      if (item.geometry && item.material) {
        item.geometry.dispose(); // eliminar geometría
        item.material.dispose(); // eliminar material
      }
      delete graph._figures[index];
    }

    delete this.graph;
  },

  methods: {
    initContainerSpace: function() {
      let container_render = {};
      const { container, list } = this;

      container_render = { ...container };
      const exp = this.getQuantityCycles(container_render);

      this.exp = exp;
      this.setDimesions({ exp, figure: container_render });
      this.container_render = container_render;

      this.spaceFree = {
        initX: container_render.length_int / 2,
        minX: container_render.length_int / 2,
        maxX: container_render.length_int / -2,
        initZ: 0,
        minZ: 0,
        maxZ: container_render.width_int,
        minY: 0,
        initY: 0,
        maxY: container_render.height_int,
      };

      for (const index in list) {
        if (list[index].type == 'box') this.boxes.push(list[index]);
        if (list[index].type == 'pallet') this.pallets.push(list[index]);
        if (list[index].type == 'cylinder') this.cylinders.push(list[index]);
      }
    },

    getQuantityCycles: function(container) {
      let name = '';
      const LIMIT_PX = 1200;
      let quantity = 0;
      let length = 0;

      if (container.length_max > container.width_max) name = 'length_max';
      else name = 'width_max';

      if (container[name] < container.height_max) name = 'height_max';
      length = container[name];

      while (length > LIMIT_PX) {
        length /= 10;
        ++quantity;
      }

      return quantity;
    },

    setDimesions: function({ exp, figure }) {
      for (const index in figure) {
        if (typeof figure[index] == 'number') figure[index] = figure[index] / 10 ** exp;
      }
    },

    createPallet: function(data) {
      const { graph } = this;
      const { color } = data;
      data.holeWidth = data.width * 0.1;
      data.widthPallet = data.holeWidth * 0.9;
      data.heightPallet = data.height - 2 * data.holeWidth;

      // dibujando las lineas de la figura
      const shape = graph.createFigure({ geometry: 'Shape' });
      shape.figure.moveTo(data.width / -2, data.length / -2);
      shape.figure.lineTo(data.width / -2, data.length / 2);
      shape.figure.lineTo(data.width / 2, data.length / 2);
      shape.figure.lineTo(data.width / 2, data.length / -2);
      shape.figure.lineTo(data.width / -2, data.length / -2);

      // oyos en la figura
      const holePath = graph.createFigure({ geometry: 'Path' });
      holePath.figure.moveTo(data.width / -2 + data.holeWidth, data.length / -2 + data.holeWidth);
      holePath.figure.lineTo(data.width / -2 + data.holeWidth, data.length / 2 - data.holeWidth);
      holePath.figure.lineTo(data.width / 2 - data.holeWidth, data.length / 2 - data.holeWidth);
      holePath.figure.lineTo(data.width / 2 - data.holeWidth, data.length / -2 + data.holeWidth);
      holePath.figure.lineTo(data.width / -2 + data.holeWidth, data.length / -2 + data.holeWidth);
      shape.figure.holes.push(holePath.figure);

      // figura
      const shapeGeometry = graph.createFigure({
        geometry: 'ExtrudeGeometry',
        material: {
          emissive: color,
          opacity: 1,
          side: THREE.DoubleSide,
        },
        attributes: [shape.figure, { depth: data.holeWidth, bevelEnabled: false }],
      });

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

      return shapeGeometry;
    },

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

    createCylinder: function({ radius, height, color }) {
      const { graph } = this;
      const cylinder = graph.createFigure({
        geometry: 'CylinderGeometry',
        attributes: [radius, radius, height],
        material: {
          type: 'lambert',
          emissive: color,
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
      return cylinderParent;
    },

    setFigure: function(figure) {
      const { spaceFree, plane } = this;

      if (spaceFree.minZ + figure.length > spaceFree.maxZ) {
        spaceFree.minZ = spaceFree.initZ;
        spaceFree.minY += figure.height;
      }

      if (spaceFree.minY + figure.height > spaceFree.maxY) {
        spaceFree.minZ = spaceFree.initZ;
        spaceFree.minY = spaceFree.initY;
        spaceFree.minX -= figure.width;
      }

      if (spaceFree.minX - figure.width < spaceFree.maxX)
        throw 'disculpe ya no hya espacio para seguir insertando';

      const point = {
        z: spaceFree.minZ + figure.length / 2,
        y: spaceFree.minY + figure.height / 2,
        x: spaceFree.minX - figure.width / 2,
      };

      figure.setPosition(point);

      spaceFree.minZ += figure.length;
      plane.add(figure);
    },

    setPallets: function() {
      const { pallets } = this;

      for (let j = 0; j < pallets.length; j++) {
        const element = { ...pallets[j] };
        const exp = this.exp;

        // datos de atributos
        element.length = parseFloat(element.length);
        element.width = parseFloat(element.width);
        element.height = parseFloat(element.height);

        this.setDimesions({ exp, figure: element });
        console.log(element);

        for (let i = 0; i < element.quantity; i++) {
          const pallet = this.createPallet({
            width: element.width,
            height: element.height,
            length: element.length,
            color: element.color,
          });

          // datos de atributos
          pallet.length = element.length;
          pallet.width = element.width;
          pallet.height = element.height;

          pallet.figure.rotation.x = Math.PI / 2;
          pallet.figure.rotation.z = Math.PI / 2;

          pallet.name = 'pallet';

          this.setFigure(pallet);
        }
      }
    },

    setCubes: function() {
      const { boxes } = this;
      for (let j = 0; j < boxes.length; j++) {
        const cubes = { ...boxes[j] };
        const exp = this.exp;

        // datos de atributos
        cubes.length = parseFloat(cubes.length);
        cubes.width = parseFloat(cubes.width);
        cubes.height = parseFloat(cubes.height);

        this.setDimesions({ exp, figure: cubes });

        for (let i = 0; i < cubes.quantity; i++) {
          const cube = this.createBox({
            width: cubes.width,
            height: cubes.height,
            length: cubes.length,
            color: cubes.color,
          });

          // datos de atributos
          cube.length = cubes.length;
          cube.width = cubes.width;
          cube.height = cubes.height;
          this.setFigure(cube);
        }
      }
    },

    setCylinder: function() {
      const { cylinders } = this;
      for (let j = 0; j < cylinders.length; j++) {
        const barrel = { ...cylinders[j] };
        const exp = this.exp;

        // datos de atributos
        barrel.height = parseFloat(barrel.height);
        barrel.diameter = parseFloat(barrel.diameter);

        this.setDimesions({ exp, figure: barrel });

        for (let i = 0; i < barrel.quantity; i++) {
          const cylinder = this.createCylinder({
            radius: barrel.diameter / 2,
            height: barrel.height,
            color: barrel.color,
          });

          // datos de atributos
          cylinder.length = barrel.diameter;
          cylinder.width = barrel.diameter;
          cylinder.height = barrel.height;
          this.setFigure(cylinder);
        }
      }
    },

    createScene: async function() {
      const data = { width: this.maxWidth, height: this.maxHeight };
      const element = this.$refs['div-container-scene'];

      // me permite obtener la textura de una imagen determinada
      const textureLoader = new THREE.TextureLoader();
      const graph = await WebGl({
        element,
        width: data.width,
        height: data.height,
        color: 0x000000,
      });

      const renderer = graph._renderer;
      renderer.physicallyCorrectLights = true;
      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ReinhardToneMapping;

      const { camera } = graph;
      camera.fov = 45;

      // textura del piso
      const floor = await require('../../assets/floor.jpg');
      const floorTexture = textureLoader.load(floor);
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(20, 20);

      const planeGeometry = graph.createFigure({
        geometry: 'PlaneGeometry',
        attributes: [this.container_render.length_max * 2, this.container_render.length_max * 2],
        material: { type: 'basic', color: 0xffffff, map: floorTexture },
      });

      planeGeometry.figure.rotation.x = -0.5 * Math.PI;
      planeGeometry.figure.position.x = 0;
      planeGeometry.figure.position.y = 0;
      planeGeometry.figure.position.z = 0;

      const containerImg = require('../../assets/container.jpg');
      const boxTexture = textureLoader.load(containerImg);
      boxTexture.wrapS = THREE.RepeatWrapping;
      boxTexture.wrapT = THREE.RepeatWrapping;
      boxTexture.repeat.set(20, 20);

      const wall = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [this.container_render.length_max, this.container_render.height_max, 1],
        material: { type: 'phong', map: boxTexture, opacity: 1 },
      });
      wall.setPosition({ y: this.container_render.height_int / 2, x: 0, z: 0 });

      const wall1 = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [this.container_render.width_max, this.container_render.height_max, 1],
        material: { type: 'pong', map: boxTexture, opacity: 6 },
      });

      wall1.setPosition({
        y: this.container_render.height_int / 2,
        x: this.container_render.length_max / 2,
        z: this.container_render.width_max / 2,
      });
      wall1.figure.rotation.y = Math.PI / 2;

      const wall2 = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [this.container_render.length_max, this.container_render.height_max, 1],
        material: { type: 'phong', map: boxTexture, opacity: 1 },
      });
      wall2.setPosition({
        y: this.container_render.height_int / 2,
        x: 0,
        z: this.container_render.width_max,
      });

      const wall3 = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [1, this.container_render.length_max, this.container_render.width_max],
        material: { type: 'phong', map: boxTexture, opacity: 1 },
      });
      wall3.setPosition({ y: 0, x: 0, z: this.container_render.width_max / 2 });
      wall3.figure.rotation.z += Math.PI / 2;

      const object3d = graph.createFigure({ geometry: 'Object3D' });
      object3d.figure.rotation.x = Math.PI / 2;
      object3d.add(wall);
      object3d.add(wall1);
      object3d.add(wall2);
      object3d.add(wall3);

      planeGeometry.add(object3d);

      const plane = graph.createFigure({ geometry: 'Object3D' });
      this.plane = plane;
      plane.add(planeGeometry);

      plane.animation = function() {
        this.figure.rotation.y += 0.01;
      };

      graph.addFigure(plane);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      graph._scene.add(ambient);
      camera.position.x = this.container_render.length_max * 0.8;
      camera.position.y = this.container_render.height_max * 2;
      camera.position.z = this.container_render.width_max / 2;
      camera.lookAt(graph._scene.position);

      graph.setLight({ intensity: 0.9, color: 0xffffff, position: { x: -200, y: -155, z: 100 } });
      graph.setLight({ intensity: 0.5, color: 0x000000, position: { x: -300, y: -180, z: -80 } });
      graph.setLight({ intensity: 0.7, color: 0xffffff, position: { x: 200, y: 155, z: -100 } });
      graph.setLight({ intensity: 0.5, color: 0x000000, position: { x: 300, y: 180, z: 80 } });
      this.graph = graph;

      this.setPallets();
      this.setCubes();
      this.setCylinder();
    },
  },
};
</script>
