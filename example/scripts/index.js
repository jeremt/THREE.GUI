
~function () {

var context = new THREE.Context();

// for debug
window.context = context;

context.addEventListener("start", function () {

  // Place camera.

  this.camera.position.z = 500;

  // Create lights.

  var ambient = new THREE.AmbientLight(0x202010);
  this.scene.add(ambient);
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(50, 100, 150);
  this.scene.add(directionalLight);
  var directionalLight = new THREE.DirectionalLight(0xccddff);
  directionalLight.position.set(-50, -100, -150);
  this.scene.add(directionalLight);
  var directionalLight = new THREE.PointLight(0xffffff);
  directionalLight.position.set(-50, 100, 150);
  this.scene.add(directionalLight);
  // Add controls.

  this.controls = new THREE.OrbitControls(
    this.camera,
    this.renderer.domElement
  );

  // Create simple button.

  this.button = new THREE.GUI.Button("Play", {
    receiveLight: true,
    textSmooth: false,
    fontWeight: "bold"
  });

  this.button.addEventListener('focus', function () {
    console.log('focused !');
  });

  this.button.addEventListener('click', function () {
    console.log('clicked !');
  });

  this.scene.add(this.button);

});

context.addEventListener("frame", function (event) {
  this.button.update(event.deltaTime);
});

context.start();

}();
