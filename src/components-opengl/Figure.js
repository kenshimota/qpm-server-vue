class Figure {
  setPosition(params) {
    if (this.figure) this.figure.setPosition(params);
    else this.positions = params;
  }

  render() {
    if (!this.figure) this.figure = this.create();
    if (this.positions && this.figure) this.figure.setPosition(this.positions);
    return this.figure;
  }
}

export default Figure;
