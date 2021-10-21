<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <div class="columns is-multiline">
        <div class="column is-6">
          <div class="columns is-multiline">
            <div class="column is-12">
              <h3>{{ 'Detalles de paleta' }}</h3>
            </div>

            <div class="column is-6">
              <b-field :label="language.WIDTH" label-position="on-border">
                <b-input v-model="pallet_width" />
              </b-field>
            </div>

            <div class="column is-6">
              <b-field :label="language.HEIGHT" label-position="on-border">
                <b-input v-model="pallet_height" />
              </b-field>
            </div>

            <div class="column is-6">
              <b-field :label="language.LENGTH" label-position="on-border">
                <b-input v-model="pallet_length" />
              </b-field>
            </div>

            <div class="column is-6">
              <b-field :label="language.QUANTITY" label-position="on-border">
                <b-input v-model="pallet_quantity" />
              </b-field>
            </div>

            <div class="column is-6">
              <b-field :label="language.MARGIN" label-position="on-border">
                <b-input v-model="pallet_margin" />
              </b-field>
            </div>

            <div class="column is-6">
              <b-field :label="language.COLUMN" label-position="on-border">
                <b-input v-model="pallet_column" />
              </b-field>
            </div>
          </div>
        </div>
        <div class="column is-6"></div>
      </div>
    </div>
    <div class="column is-12">
      <div ref="test" :style="{ width: '100%', height: '100%', position: 'absolute' }"></div>
    </div>
  </div>
</template>

<script>
import WebGl from 'webgl-show';
import sleep from '../../utils/sleep';
import Containers from '../../components-opengl/Containers';
import Flat from '../../components-opengl/Flat';
import Pallets from '../../components-opengl/Pallets';
import language from '../../languages/index';

const makeScene = async function(){
  const element = this.$refs['test'];

  if(element && element.children && element.children.length)
    element.removeChild( element.children[0] );
  
  await this.createGraph(element);  
  const pallets = await this.createPallets();
  this.calculateContainerDimensions();
  this.calculateFlat();
  this.calculateScreen();
  await this.createContainer();
  await this.createFlat();

  const graph = this.graph;
  const figure = graph.createFigure({ geometry: 'Object3D' });
  figure.add(this.flat);
  figure.add(this.container);

  this.setPositionsPallets(pallets);
  
  graph.addFigure(figure);
  this.setCamera();

  const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls');
  const controls = new OrbitControls(graph.camera, element);
  controls.update();
};

export default {
  data: () => ({
    graph: null,
    container: null,
    containerResource: null,
    language: language().content,
    pallet_width: 5,
    pallet_height: 5,
    pallet_margin: 1,
    pallet_column: 5,
    pallet_length: 4,
    pallet_quantity: 50,
    scene_width: null,
    scene_length: null,
    container_height: null,
    container_width: null,
    container_length: null,
    flat_width: null,
    flat_length: null,
  }),

  mounted: async function() {
    let element = this.$refs['test'];
    while (!element) {
      await sleep(100);
      element = this.$refs['test'];
    }

    this.makeScene();
  },

  watch: {
    pallet_column: makeScene,
    pallet_height: makeScene,
    pallet_length: makeScene,
    pallet_margin: makeScene,
    pallet_quantity: makeScene,
    pallet_width: makeScene,
  },

  methods: {

    // create escene
    makeScene,

    // funcion que se encarga de organizar las paletas en el contenedor
    setPositionsPallets: function(pallets){
      const containerResource = this.containerResource;
      const container = this.container;
      const pallet_height = this.pallet_height * 1;
      const pallet_width = this.pallet_width * 1;
      const pallet_length = this.pallet_length * 1;
      const pallet_margin = this.pallet_margin * 1;
      const pallet_column = this.pallet_column * 1;
      const height =  -containerResource.attributes.height / 2  ;
      let length = containerResource.length;


      const initX = containerResource.width / 2 - containerResource.containerWall;
      const initZ = containerResource.length / 2;
      const endX = -containerResource.width / 2 + containerResource.containerWall;
      const endZ = -containerResource.length / 2;
      let x = endX;
      let z = endZ;

      console.log({initX, initZ, endX, endZ});

      for(let i = 0; i < pallets.length; i++){
        const pallet = pallets[i].render();
        const y =  height + pallet_height;

        if(i % pallet_column  == 0){
          x = endX + pallet_width / 2 + pallet_margin;
          z = z + pallet_length + pallet_margin;
        }
        else
          x = x + pallet_margin + pallet_width; 
        
        
        const position = { z, y, x };
        console.log(position);
        pallet.setPosition(position);
        container.add( pallet );
      }

    },

    // crean el grafo
    createGraph: async function(element) {
      if(this.graph) delete this.graph;

      const graph = await WebGl({
        element,
        width: element.offsetWidth,
        height: element.offsetHeight,
        color: 'transparent',
      });

      this.graph = graph;
    },

    // creando el contendor
    createContainer: async function() {
      const THREE = require('three');
      const graph = this.graph;

      const containerImg = require('../../assets/container.jpg');
      const textureLoader = new THREE.TextureLoader();
      const boxTexture = textureLoader.load(containerImg);
      boxTexture.wrapS = THREE.RepeatWrapping;
      boxTexture.wrapT = THREE.RepeatWrapping;
      boxTexture.repeat.set(20, 20);

      const containerResource = new Containers(graph, {
        width: this.container_width,
        height: this.container_height,
        length: this.container_length,
        map: boxTexture,
      });

      const container = containerResource.render();
      this.container = container;

      const { containerWall } = containerResource.attributes;
      const y = this.container_height / 2 + containerWall ;
      container.setPosition({ y });
      this.containerResource = containerResource;
    },

    createFlat: function() {
      const graph = this.graph;
      const flatResource = new Flat(graph, { width: this.flat_width, length: this.flat_length });
      const flat = flatResource.render();
      this.flat = flat;
    },

    setCamera: function() {
      const graph = this.graph;
      const camera = graph.camera;

      camera.position.y = this.scene_height;
      camera.position.z = this.scene_length;
      camera.lookAt(graph._scene.position);
    },

    calculateScreen: function(){
      this.scene_height = this.container_height;
      this.scene_length = this.flat_length;
    },

    calculateFlat: function(){
      this.flat_length = this.container_length * 2;
      this.flat_width = this.container_width * 2;
    },

    calculateContainerDimensions: function() {
      let { pallet_width, pallet_length, pallet_margin, pallet_quantity, pallet_column } = this;
      pallet_width = pallet_width * 1;
      
      pallet_length = pallet_length * 1;
      pallet_margin = pallet_margin * 1;
      pallet_quantity = pallet_quantity * 1;
      pallet_column = pallet_column * 1;


      if (pallet_quantity % pallet_column == 0) {
        let a = pallet_quantity / pallet_column;
        let b = pallet_length + pallet_margin * 2;
        this.container_length = a * b;
      } else {
        let a = pallet_quantity / pallet_column + 1;
        let b = pallet_length + pallet_margin * 2;
        this.container_length = (a - (a % 1)) * b;
      }

      this.container_width = (pallet_width + (pallet_margin * 2)) * pallet_column;
      this.container_height = this.container_width;
    },

    createPallets: function() {
      const pallets = new Array();
      const graph = this.graph;
      const { pallet_width, pallet_length, pallet_height, pallet_quantity } = this;

      for (let i = 0; i < pallet_quantity; i++) {
        const palletResource = new Pallets(graph, {
          width: pallet_width,
          height: pallet_height,
          length: pallet_length,
          color: "#" + Math.floor(Math.random()*16777215).toString(16)
        });

        palletResource.render();
        console.log(palletResource.attributes.color);
        pallets.push(palletResource);
      }

      return pallets;
    },
  },
};
</script>
