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
    const graph = this.graph;
    const cube = graph.createFigure({
      geometry: 'BoxGeometry',
      attributes: [this.width, this.height, this.length],
      material: {
        type: (this.map && 'basic') || 'phong',
        map: this.map,
        emissive: this.color,
        transparent: true,
        opacity: 0.9,
      },
    });

    let cubeParent = null;

    if (this.withParent) {
      cubeParent = graph.createFigure({
        geometry: 'BoxGeometry',
        attributes: [this.width, this.height, this.length],
        material: {
          type: (this.map && 'basic') || 'phong',
          emissive: 0x000000,
          transparent: true,
          opacity: 0.6,
          map: this.map,
          wireframe: true,
        },
      });
      cubeParent.add(cube);
    } else cubeParent = cube;

    return cubeParent;
  }
}

export default Boxes;
