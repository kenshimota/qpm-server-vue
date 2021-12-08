import Pallets from "./Pallets";

const createPallets = function(instance = null) {
  const props = instance.props;
  const data = { color: props.color, margin: props.palletMargin };
  data.width =
    (props.width - props.containerWall * 2) / props.palletCol - data.margin * 2;
  data.height = data.width / 2;
  data.length =
    props.length / (props.palletQuantity / props.palletCol) - data.margin * 2;

  const pallets = [];
  for (let i = 0; i < props.palletQuantity; i++)
    pallets.push(instance.createNode(data, Pallets));

  const endX = -props.width / 2 + props.containerWall;
  const endZ = -props.length / 2;
  const height = -props.height / 2;
  let x = endX;
  let z = endZ;

  for (let i = 0; i < pallets.length; i++) {
    const pallet = pallets[i].template;
    const y = height + data.height;

    if (i % props.palletCol == 0) {
      x = endX + data.width / 2 + data.margin;
      z = z + data.length + data.margin;
    } else x = x + data.margin + data.width;

    const position = { z, y, x };
    pallet.setPosition(position);
  }

  return pallets;
};

const ContainersFullTransparent = function() {
  const props = this.props;
  props.height = props.height ? props.height : 400;
  props.width = props.width ? props.width : 400;
  props.length = props.length ? props.length : 400;
  props.map = props.map ? props.map : null;
  props.color = props.color ? props.color : "green";
  props.palletCol = props.palletCol || 4;
  props.palletQuantity = props.palletQuantity || 50;
  props.palletMargin = props.palletMargin || 1;
  props.containerWall = props.width * 0.05;

  const pallets = createPallets(this);
  const figure = this.createFigure({ geometry: "Object3D" }, (figure) => {
    for (let i = 0; i < pallets.length; i++) {
      const pallet = pallets[i].template;
      figure.add(pallet);
    }
  });

  return figure;
};

export default ContainersFullTransparent;
