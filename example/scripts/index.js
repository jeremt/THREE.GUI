
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
    fontWeight: "bold"
  });

  this.button.addEventListener('active', function () {
    console.log('activated!');
  });

  this.button.addEventListener('click', function (e) {
    console.log('clicked on button ' + e.id + '!');
  });

  this.button.addEventListener('hover', function () {
    console.log('hover!');
  })

  this.button.addEventListener('unhover', function () {
    console.log('unhovered!');
  })

  this.scene.add(this.button);

});

context.addEventListener("frame", function (event) {
  this.button.update(event.deltaTime, this.camera);
});

context.start();

}();
