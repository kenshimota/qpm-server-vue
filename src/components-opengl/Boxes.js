import Figure from './Figure';

class Boxes extends Figure {
  constructor(graph = null, params = {}) {
    super();
    this.graph = graph;
    this.width = params.width ? params.width : 300;
    this.height = params.height ? params.height : 300;
    this.length = params.length ? params.length : 300;
    this.color = params.color ? params.color : 'blue';
    this.withParent = params.withParent == undefined ? true : params.withParent;
    this.map = params.map;
  }

  create() {
    const material = {
      type: 'phong',
      emissive: this.color,
      transparent: true,
      opacity: 0.9,
    };

    if(this.map){
      material["type"] = "basic";
      material["map"] = this.map;
    }

    const graph = this.graph;
    const cube = graph.createFigure({
      geometry: 'BoxGeometry',
      attributes: [this.width, this.height, this.length],
      material: material,
    });

    let cubeParent = null;

    if (this.withParent) {
      material["opacity"] = 0.6;
      material["emissive"] = 0x000000;
      material["wireframe"] = true;

      cubeParent = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [this.width, this.height, this.length],
        material: material,
      });
      cubeParent.add(cube);
    } else cubeParent = cube;

    return cubeParent;
  }
}

export default Boxes;
