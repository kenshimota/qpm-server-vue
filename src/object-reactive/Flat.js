const Flat = function() {
  const props = this.props;
  const { background, repeat = 20, length = 300, width = 300 } = props;
  const floor = background ? background : require("../assets/floor.jpg");

  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load(floor);
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(props.repeat || repeat, props.repeat || repeat);

  const planeGeometry = this.createFigure({
    geometry: "PlaneGeometry",
    attributes: [props.width || width, props.length || length],
    material: { type: "basic", color: props.color, map: floorTexture },
    positions: props.positions,
  });

  planeGeometry.figure.rotation.x = -0.5 * Math.PI;
  planeGeometry.figure.position.x = 0;
  planeGeometry.figure.position.y = 0;
  planeGeometry.figure.position.z = 0;

  const figure = this.createFigure({ geometry: "Object3D" }, (reference) => {
    reference.add(planeGeometry);
  });

  return figure;
};

export default Flat;
