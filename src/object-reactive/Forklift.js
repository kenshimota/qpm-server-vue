const Forklift = function() {
  this.initState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { y: 0 },
  });
  const { onLoader } = this.props;
  const state = this.state;

  const src = `http://${window.location.hostname}:4000/forklift/Forklift.obj`;
  const forklift = this.loaderObject({ src }, (figure) => {
    this.state = { load: true };
    figure.setScale({ x: 0.1, y: 0.1, z: 0.1 });
    onLoader(figure);
  });

  const handleKeyUp = (event) => {
    const getSumPoint = function(rotation) {
      const valueDeg = (Math.PI * 2) / 360;
      const rotationY = Math.abs(rotation.y % (Math.PI * 2));
      const degX = Math.abs(90 - rotationY / valueDeg);
      const degZ = Math.abs(degX - 90);

      let sumX = ((degX % 180) / 90) * 10;
      let sumZ = ((degZ % 180) / 90) * 10;

      if (rotationY / valueDeg > 90 && rotationY / valueDeg < 270) sumX *= -1;
      if (rotationY / valueDeg > 180) sumZ *= -1;

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

  if (state.load) {
    forklift.setPosition(state.position);
    forklift.figure.rotation.y = state.rotation.y;
    forklift.figure.add(this.graph.camera);

    const camera = this.graph.camera;
    camera.position.x = 500;
    camera.position.y = 500;
    camera.fov = 120;
    camera.position.z = 0;

    this.createTimeEffect(() => {
      camera.lookAt(forklift.figure.position);

      const handleFov = (fov) => {
        camera.fov = fov;
        this.graph._renderer.render(this.graph._scene, camera);
      };

      console.log(handleFov);
    });

    // camera.rotation.y = state.rotation.y;
    // camera.updateProjectionMatrix();
  }

  return forklift;
};

export default Forklift;
