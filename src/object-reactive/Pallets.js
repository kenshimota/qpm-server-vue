import Cube from "./Cube";
const THREE = require("three");

const Pallets = function() {
  const props = this.props;

  const shape = this.createFigure({
    geometry: "Shape",
  });

  shape.figure.moveTo(props.width / -2, props.length / -2);
  shape.figure.lineTo(props.width / -2, props.length / 2);
  shape.figure.lineTo(props.width / 2, props.length / 2);
  shape.figure.lineTo(props.width / 2, props.length / -2);
  shape.figure.lineTo(props.width / -2, props.length / -2);

  const holeWidth = props.width * 0.1;
  const holePath = this.createFigure({ geometry: "Path" });
  holePath.figure.moveTo(
    props.width / -2 + holeWidth,
    props.length / -2 + holeWidth
  );
  holePath.figure.lineTo(
    props.width / -2 + holeWidth,
    props.length / 2 - holeWidth
  );
  holePath.figure.lineTo(
    props.width / 2 - holeWidth,
    props.length / 2 - holeWidth
  );
  holePath.figure.lineTo(
    props.width / 2 - holeWidth,
    props.length / -2 + holeWidth
  );
  holePath.figure.lineTo(
    props.width / -2 + holeWidth,
    props.length / -2 + holeWidth
  );
  shape.figure.holes.push(holePath.figure);

  const widthPallet = holeWidth * 0.9;
  const heightPallet = props.height - 1 * holeWidth;

  const cylinderBottomLeft = this.createNode(
    {
      length: heightPallet,
      width: widthPallet,
      height: props.length,
      color: props.color,
      withParent: false,
    },
    Cube
  );
  cylinderBottomLeft.template.setPosition({
    z: -heightPallet / 2,
    x: props.width / 2 - holeWidth / 2,
  });

  const cylinderBottomRight = this.createNode(
    {
      length: heightPallet,
      width: widthPallet,
      height: props.length,
      color: props.color,
      withParent: false,
    },
    Cube
  );

  cylinderBottomRight.template.setPosition({
    z: -heightPallet / 2,
    x: props.width / -2 + holeWidth / 2,
  });

  const cylinderBottomCenter = this.createNode(
    {
      length: heightPallet,
      width: widthPallet,
      height: props.length,
      color: props.color,
      withParent: false,
    },
    Cube
  );

  cylinderBottomCenter.template.setPosition({ z: -heightPallet / 2 });

  const cylinderTopRight = this.createNode(
    {
      length: holeWidth / 3,
      width: widthPallet,
      height: props.length,
      color: props.color,
      withParent: false,
    },
    Cube
  );

  cylinderTopRight.template.setPosition({
    z: holeWidth + widthPallet / 2 - holeWidth / 2,
    x: props.width / -2 + holeWidth,
  });

  const cylinderTopLeft = this.createNode(
    {
      length: holeWidth / 3,
      width: widthPallet,
      height: props.length,
      color: props.color,
      withParent: false,
    },
    Cube
  );

  cylinderTopLeft.template.setPosition({
    z: holeWidth + widthPallet / 2 - holeWidth / 2,
    x: props.width / 2 - holeWidth,
  });

  const cylinderTopCenter = this.createNode(
    {
      length: holeWidth / 3,
      width: widthPallet,
      height: props.length,
      color: props.color,
      withParent: false,
    },
    Cube
  );
  cylinderTopCenter.template.setPosition({
    z: holeWidth + widthPallet / 2 - holeWidth / 2,
  });

  const cylinderTopCenterCenter = this.createNode(
    {
      length: holeWidth / 3,
      width: props.length - 2 * holeWidth,
      height: widthPallet,
      color: props.color,
      withParent: false,
    },
    Cube
  );

  cylinderTopCenterCenter.template.setPosition({
    z: holeWidth + widthPallet / 2 - holeWidth / 2,
  });

  const shapeGeometry = this.createFigure(
    {
      geometry: "ExtrudeGeometry",
      material: { emissive: props.color, opacity: 1, side: THREE.DoubleSide },
      attributes: [shape.figure, { depth: holeWidth, bevelEnabled: false }],
    },
    (reference) => {
      reference.add(cylinderBottomRight.template);
      reference.add(cylinderBottomLeft.template);
      reference.add(cylinderBottomCenter.template);
      reference.add(cylinderTopRight.template);
      reference.add(cylinderTopLeft.template);
      reference.add(cylinderTopCenter.template);
      reference.add(cylinderTopCenterCenter.template);
    }
  );

  const figure = this.createFigure({ geometry: "Object3D" }, (reference) => {
    shapeGeometry.figure.rotation.x = -Math.PI / 2;
    reference.add(shapeGeometry);
  });

  return figure;
};

export default Pallets;
