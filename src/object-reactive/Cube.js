const Cube = function() {
  const props = this.props;

  const material = {
    type: "phong",
    emissive: props.color,
    transparent: true,
    opacity: 0.9,
  };

  if (props.map) {
    material["type"] = "basic";
    material["map"] = props.map;
  }

  const cube = this.createFigure({
    geometry: "BoxGeometry",
    attributes: [props.width, props.height, props.length],
    material: material,
  });

  let cubeParent = null;

  if (this.withParent) {
    material["opacity"] = 0.6;
    material["emissive"] = 0x000000;
    material["wireframe"] = true;

    cubeParent = this.createFigure({
      geometry: "BoxGeometry",
      attributes: [props.width, props.height, props.length],
      material: material,
    });
    cubeParent.add(cube);
  } else cubeParent = cube;

  return cubeParent;
};

export default Cube;
