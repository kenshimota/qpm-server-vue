import WebGl from "webgl-show";

let countNode = 0;
let graph = null;
const nodes = [];
const setBodyEvent = new Set(["keyup", "keydown", "keypress"]);

const Node = (key) => ({
  key: key,
  children: [],
  countChildren: 0,
  object3D: new Map(),
  propsObject3D: new Map(),
  firstRender: false,
  quantityTimeEffect: 0,
  timeEffectEvent: new Map(),
  domEvent: new Map(),
  countCreateFigure: 0,

  addEventListener: function(type, callback) {
    if (this.domEvent.get(type) || typeof this.template == "function")
      return null;

    if (!setBodyEvent.has(type))
      graph._domElement.addEventListener(type, callback);
    else document.addEventListener(type, callback);

    this.domEvent.set(type, callback);
  },

  // funcion de carga de archivo
  loaderObject: function(params, onCreated) {
    const key = this.countCreateFigure;
    const children = this.object3D;
    let child = children.get(key);

    if (!child) {
      child = this.graph.loadFigure(params);
      this.object3D.set(key, child);
      this.propsObject3D.set(key, params);
      if (typeof onCreated == "function")
        child.then((figure) => {
          this.object3D.set(key, figure);
          onCreated(figure);
        });
    }

    this.countCreateFigure += 1;
    return child;
  },

  // funcion que se encargar de establecer el primer estado
  initState(data = {}) {
    if (!this.firstRender) this.$state = data;
  },

  createTimeEffect(callback) {
    const events = this.timeEffectEvent;
    if (!events.get(this.quantityTimeEffect)) {
      events.set(this.quantityTimeEffect, true);
      callback();
      this.quantityTimeEffect += 1;
    }
  },

  // agregando un nodo actualmente
  appendChild: function(prototypes = {}, node) {
    const key = this.countChildren;
    const children = this.children;
    let child = children[key];

    if (!child) {
      child = node;
      child.parent = this;
      this.children[key] = child;
    }

    this.countChildren += 1;
    child.props = prototypes;
    if (!child.template) child.template = child.render();

    return child;
  },

  // funcion que se encarga de
  createFigure: function(params, onCreated = null) {
    const key = this.countCreateFigure;
    const children = this.object3D;
    let child = children.get(key);

    if (!child) {
      child = this.graph.createFigure(params);
      if (typeof child.figure.setMatrixAutoUpdate == "function")
        child.setMatrixAutoUpdate(true);
      this.object3D.set(key, child);
      this.propsObject3D.set(key, params);

      if (typeof onCreated == "function") onCreated(child);
    } else {
      let update = false;
      const props = this.propsObject3D.get(key);
      const attributes = Object.keys(props);

      for (let i = 0; !update && i < attributes.length; i++) {
        const key = attributes[i];
        if (!props[key] || props[key] != params[key]) update = true;
      }

      if (update) {
        for (const index in params.material) {
          if (child.figure.material[index] && child.figure.material[index].set)
            child.figure.material[index].set(params.material[index]);
        }

        child.setAttributes(params.attributes);
      }
    }

    this.countCreateFigure += 1;
    return child;
  },

  removeObjectNotUse: function() {},

  // creando un nuevo nodo;
  createNode: function(prototypes = {}, callback) {
    const key = this.countChildren;
    const children = this.children;
    let child = children[key];

    if (!child) {
      child = TreeNode();
      child.render = callback;
      child.parent = this;
      this.children[key] = child;
    }

    this.countChildren += 1;
    child.props = prototypes;
    if (!child.template) child.template = child.render();

    return child;
  },

  render: null,
  $props: {},
  $state: {},
});

export const TreeNode = (props = {}) => {
  const node = Node(countNode);
  node.graph = graph;
  nodes.push(node);

  Object.defineProperty(node, "state", {
    set: function(newState = {}) {
      let update = false;
      const attributes = Object.keys(newState);
      const state = this.$state;

      for (let i = 0; i < attributes.length; i++) {
        const key = attributes[i];
        if (!state[key] || state[key] != newState[key]) {
          state[key] = newState[key];
          update = true;
        }
      }

      if (update) {
        this.countCreateFigure = 0;
        this.quantityTimeEffect = 0;
        this.countChildren = 0;
        // console.log("Actualizando Nodo #" + this.key + "- Change State");

        this.template = typeof this.render == "function" ? this.render() : null;
        this.removeObjectNotUse();

        if (this.template === undefined)
          throw new Error("Exists an Node #" + this.key + " return undefined ");
        if (!this.firstRender) this.firstRender = true;
      }
    },

    get: function() {
      return this.$state;
    },
  });

  Object.defineProperty(node, "props", {
    set: function(newProps = {}) {
      let update = false;
      const attributes = Object.keys(newProps);
      const props = this.$props;

      for (let i = 0; i < attributes.length; i++) {
        const key = attributes[i];
        if (
          newProps[key] != undefined &&
          (!props[key] || props[key] != newProps[key])
        ) {
          props[key] = newProps[key];
          update = true;
        }
      }

      if (update) {
        this.countCreateFigure = 0;
        this.quantityTimeEffect = 0;
        this.countChildren = 0;
        // console.log("Actualizando Nodo #" + this.key + " - Change Prototypes");

        this.template = typeof this.render == "function" ? this.render() : null;
        this.removeObjectNotUse();

        if (this.template === undefined)
          throw new Error("Exists an Node #" + this.key + " return undefined ");
        if (!this.firstRender) this.firstRender = true;
      }
    },

    get: function() {
      return this.$props;
    },
  });

  node.props = props;
  countNode += 1;
  return node;
};

export const renderTHREE = async function(props = {}) {
  const { element, node, callback } = props;

  graph = await WebGl({
    ...props,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  const root = TreeNode({});

  root.render = function() {
    const state = this.state;

    const childRoot = node
      ? this.appendChild({}, node)
      : callback
      ? this.createNode({}, callback)
      : null;

    const response = childRoot && childRoot.template;
    if (response) graph.addFigure(response);

    return true;
  };

  for (let i = 0; i < nodes.length; i++) nodes[i].graph = graph;

  root.props = { element };
  return root;
};

const THREE = require("three");
window.THREE = THREE;
