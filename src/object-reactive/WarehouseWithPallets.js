import Flat from "./Flat";
import Forklift from "./Forklift";
import ContainersFullTransparent from "./ContainersFullTransparent";
import containersData from "../components-opengl/containers-warehouse.json";

const serCalculatePosition = function(props, coords = []) {
  const startWidth = props.width / -2;
  const startLength = props.length / -2;
  const result = { y: 195, x: 0, z: 0 };
  const unit = props.unit;
  result.z = unit * coords[0] + startLength;
  result.x = unit * coords[1] + startWidth;
  return result;
};

const createContainers = function(instance) {
  const containers = {};
  const props = instance.props;

  for (const index in containersData) {
    const data = containersData[index];
    containers[index] = instance.createNode(
      {
        color: data.color,
        width: data.col * props.unit,
        length: (data.quantity / data.col) * props.unit,
        palletCol: data.col,
        palletQuantity: data.quantity,
      },
      ContainersFullTransparent
    );

    containers[index].template.setPosition(
      serCalculatePosition(props, data.coords)
    );
  }

  return containers;
};

const WarehouseWidthPallets = function() {
  this.initState({
    position: { x: -10, y: 100, z: 0 },
    rotation: { y: Math.PI / 2 },
  });
  const state = this.state;
  const props = this.props;
  props.widthPixelMax = window.outerWidth;
  props.LengthPixelMax = window.outerWidth;
  props.dividerWidth = 42;
  props.unit = props.widthPixelMax / props.dividerWidth;
  props.length = props.unit * 32;
  props.width = props.unit * props.dividerWidth;

  const containers = createContainers(this);

  const flat = this.createNode(
    { width: props.width, length: props.length },
    Flat
  );

  const figure = this.createFigure({ geometry: "Object3D" }, (figure) => {
    for (const index in containers) {
      const container = containers[index].template;
      flat.template.add(container);
    }

    figure.add(flat.template);
  });

  /*this.createNode(
    {
      position: {
        x: state.position.x + 50,
        y: 0,
        z: state.position.z + 50,
      },
    },
    Forklift
  );*/

  const handleKeyUp = (event) => {
    const getSumPoint = function(rotation) {
      const valueDeg = (Math.PI * 2) / 360;
      const rotationY = Math.abs(rotation.y % (Math.PI * 2));
      const degZ = Math.abs(90 - rotationY / valueDeg);
      const degX = Math.abs(degZ - 90);

      let sumX = ((degX % 180) / 90) * 10;
      let sumZ = ((degZ % 180) / 90) * 10;

      if (rotationY / valueDeg > 90 && rotationY / valueDeg < 270) sumZ *= -1;
      if (rotationY / valueDeg > 180) sumX *= -1;

      const response = { degX, degZ, sumX, sumZ, rotationY };

      return response;
    };

    const events = {
      "83": () => {
        const { position, rotation } = this.state;
        const response = getSumPoint(rotation);
        position.x += response.sumX;
        position.z += response.sumZ;
        this.state = { position: { ...position } };
      },
      "87": () => {
        const { position, rotation } = this.state;
        const response = getSumPoint(rotation);
        position.x += -response.sumX;
        position.z += -response.sumZ;
        this.state = { position: { ...position } };
      },
      "65": () =>
        (this.state = {
          rotation: { ...state.rotation, y: this.state.rotation.y + 0.1 },
        }),
      "68": () =>
        (this.state = {
          rotation: { ...state.rotation, y: this.state.rotation.y - 0.1 },
        }),
    };

    if (events && events[event.keyCode]) events[event.keyCode]();
  };

  this.addEventListener("keydown", handleKeyUp);

  const camera = this.graph.camera;
  camera.position.x = state.position.x;
  camera.position.y = state.position.y;
  camera.position.z = state.position.z;
  camera.rotation.y = state.rotation.y;

  return figure;
};

export default WarehouseWidthPallets;
