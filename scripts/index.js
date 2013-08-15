
~function () {

var context = new THREE.Context();

// for debug
window.context = context;

/**
 * Button example.
 */

context.buttonExample = function () {
  var scene = new THREE.Scene();

  this.example = "Button";

  this.button = new THREE.GUI.Button("click me ;)", {
    fontWeight: "bold",
    width: 300,
    height: 120
  });

  this.button.hoverStyle({
    textColor: 0x222222,
    backgroundColor: 0x556611
  });

  this.button.focusStyle({
    textColor: 0x222222,
    backgroundColor: 0x556611
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

  scene.add(this.button);

  return scene;
}

context.updateButton = function (event) {
  this.button.update(event);
}

/**
 * Vertical list example.
 */

context.verticalListExample = function () {
  var scene = new THREE.Scene();
  this.example = "VerticalList";

  var btnStyle = {
    fontWeight: "bold",
    textDepth: 10,
    width: 300
  };
  this.list = new THREE.GUI.VerticalList({margin: 20});
  this.list.append(new THREE.GUI.Button("Play", btnStyle));
  this.list.append(new THREE.GUI.Button("Credits", btnStyle));
  this.list.append(new THREE.GUI.Button("Quit", btnStyle));

  this.list.addEventListener("submit", function (event) {
    console.log("Summit choice " + event.choice);
  });

  this.list.addEventListener("click", function (event) {
    console.log("Click choice " + event.choice);
  });

  scene.add(this.list);

  return scene;
}

context.updateVerticalList = function (event) {
  this.list.update(event);
}

/**
 * TextInput example.
 */
context.textInputExample = function () {
  var scene = new THREE.Scene();
  this.example = "TextInput";

  this.input = new THREE.GUI.TextInput();

  this.input.addEventListener("submit", function (event) {
    console.log("SUBMIT: ", event.text);
  });

  this.input.addEventListener("change", function (event) {
    console.log("CHANGE: ", event.text);
  });

  scene.add(this.input);

  return scene;
}

context.updateTextInput = function (event) {
  this.input.update(event);
}

/**
 * Common stuffs.
 */

context.commonSettings = function () {

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
  var directionalLight = new THREE.PointLight(0xcccccc);
  directionalLight.position.set(-500, 1000, 1500);
  this.scene.add(directionalLight);

  // Add controls.

  this.controls = new THREE.OrbitControls(
    this.camera,
    this.renderer.domElement
  );
}

context.addEventListener("start", function () {

  // set camera.
  THREE.GUI.camera = this.camera;

  this.scene = this.verticalListExample();
  this.commonSettings();

});

context.addEventListener("frame", function (event) {

  // Update current example.

  this["update" + this.example] &&
    this["update" + this.example](event);

  // Switch examples.

  // if (THREE.Input.isKeyDown("1"))
  //   this.scene = this.buttonExample();
  // else if (THREE.Input.isKeyDown("2"))
  //   this.scene = this.verticalListExample();
  // else if (THREE.Input.isKeyDown("3"))
  //   this.scene = this.textInputExample();
  // else
  //   return;
  // this.commonSettings();

});

context.switchScene = function (name) {
  this.scene = this[name + "Example"]();
  this.commonSettings();
}

context.start();

~function buildNav(examples) {
  var elems = [];
  for (var i = 0; i < examples.length; ++i) {
    var el = document.querySelector("#" + examples[i]);
    elems.push(el);
    el.addEventListener("click", function () {
      context.switchScene(this.innerHTML);
      for (var j = 0; j < elems.length; ++j)
        elems[j].className = "";
      this.className = "selected";
    });
  }
}([
  'verticalList',
  'button',
  'textInput'
]);

}();

// - RIB
// - justificatif domicil
// - check barre