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
    position: { x: -20, y: 50, z: -20 },
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

  const camera = this.graph.camera;

  const handleKeyUp = (event) => {
    const cosDeg = (deg) => {
      const angle = deg % 45;
      return Math.cos((angle * Math.PI) / 180);
    };

    const checkBusy = function(position) {
      for (const i in containers) {
        const { length, width } = containers[i].props;
        const coords = containers[i].template.figure.position;
        const minX = coords.x - width / 2;
        const maxX = coords.x + width / 2;
        const minZ = coords.z - length / 2;
        const maxZ = coords.z + length / 2;
        if (
          minX <= position.x &&
          maxX >= position.x &&
          minZ <= position.z &&
          maxZ >= position.z
        )
          return true;
      }

      return false;
    };

    const getSumPoint = function(rotation) {
      const valueDeg = (Math.PI * 2) / 360;
      const unit = 5;
      const rotationY = rotation.y % (Math.PI * 2);
      const deg =
        rotationY > 0
          ? rotationY / valueDeg
          : 360 - Math.abs(rotationY) / valueDeg;

      let sumX = unit;
      let sumZ = unit;

      if (deg >= 315 || deg <= 45) {
        const hypotenuse = sumZ / cosDeg(deg >= 315 ? 360 - deg : deg);
        const oppositive = Math.sqrt(hypotenuse * hypotenuse - sumZ * sumZ);
        sumX = deg > 45 ? -oppositive : oppositive;
      } else if (deg > 45 && deg <= 135) {
        const hypotenuse = sumX / cosDeg(deg <= 90 ? 90 - deg : deg);
        const oppositive = Math.sqrt(hypotenuse * hypotenuse - sumX * sumX);
        sumZ = deg > 90 ? -oppositive : oppositive;
      } else if (deg > 135 && deg <= 225) {
        const hypotenuse = sumZ / cosDeg(deg <= 180 ? 180 - deg : deg);
        const oppositive = Math.sqrt(hypotenuse * hypotenuse - sumZ * sumZ);
        sumX = deg > 180 ? -oppositive : oppositive;
        sumZ = -sumZ;
      } else {
        const hypotenuse = sumX / cosDeg(deg <= 270 ? 270 - deg : deg);
        const oppositive = Math.sqrt(hypotenuse * hypotenuse - sumX * sumX);
        sumZ = deg > 270 ? oppositive : -oppositive;
        sumX = -sumX;
      }

      return { sumX: sumX, sumZ: sumZ };
    };

    const events = {
      "83": () => {
        const { position, rotation } = this.state;
        const response = getSumPoint(rotation);
        position.x += response.sumX;
        position.z += response.sumZ;

        if (checkBusy(position)) {
          position.x -= response.sumX;
          position.z -= response.sumZ;
        }

        this.state = { position: { ...position } };
      },
      "87": () => {
        const { position, rotation } = this.state;
        const response = getSumPoint(rotation);
        position.x += -response.sumX;
        position.z += -response.sumZ;
        if (checkBusy(position)) {
          position.x += response.sumX;
          position.z += response.sumZ;
        }

        this.state = { position: { ...position } };
      },
      "65": () =>
        (this.state = {
          rotation: { ...state.rotation, y: camera.rotation.y + 0.1 },
        }),
      "68": () =>
        (this.state = {
          rotation: { ...state.rotation, y: camera.rotation.y - 0.1 },
        }),
    };

    if (events && events[event.keyCode]) events[event.keyCode]();
  };

  this.addEventListener("keydown", handleKeyUp);

  camera.position.x = state.position.x;
  camera.position.y = state.position.y;
  camera.position.z = state.position.z;
  camera.rotation.y = state.rotation.y;

  return figure;
};

export default WarehouseWidthPallets;
