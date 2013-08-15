
~function () {

THREE = THREE || {};

/**
 * Create a new context and initialize the application.
 */
THREE.Context = function () {
  var self = this;

  // Inherite from eventDispatcher.

  THREE.EventDispatcher.call(this);

  this.paused = false;
  this.controls = null;

  // Create html container.

  var container = document.createElement('div');
  container.className = "threejs-container";
  document.body.appendChild(container);

  // Create a clock.

  this.clock = new THREE.Clock();
  this.clock.start();

  // Create camera.

  this.camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 1, 2000
  );

  // Create scene.

  this.scene = new THREE.Scene();

  // Create the renderer.

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(this.renderer.domElement);

  window.addEventListener('resize', function () {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);

}

/**
 * Inherite from THREE.EventDispatcher.
 */
THREE.Context.prototype = Object.create(THREE.EventDispatcher.prototype);

/**
 * Reset the context to restart the application.
 */
THREE.Context.prototype.reset = function () {
  // TODO
}

/**
 * Pause the application.
 */
THREE.Context.prototype.pause = function () {
  this.paused = true;
  this.dispatchEvent({type: "pause"});
}

/**
 * Quit the application.
 */
THREE.Context.prototype.quit = function () {
  this.paused = true;
  this.dispatchEvent({type: "quit"});
}

/**
 * Play the application.
 */
THREE.Context.prototype.play = function () {
  this.paused = false;
  this.dispatchEvent({type: "play"});
}

/**
 * Start the application.
 */
THREE.Context.prototype.start = function () {
  var self = this;
  this.dispatchEvent({type: "start"});
  ~function animate() {
    requestAnimationFrame(animate);
    if (self.controls)
      self.controls.update();
    self.dispatchEvent({
      type: "frame",
      deltaTime: self.clock.getDelta()
    });
    if (!this.paused)
      self.renderer.render(self.scene, self.camera);
  }();
}

}();