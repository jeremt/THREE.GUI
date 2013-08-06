
~function () {

/**
 * Main GUI object.
 */
THREE.GUI = {};

/**
 * Current scene camera.
 */
var _camera = null;

THREE.GUI.__defineSetter__("camera", function (camera) {
  if (typeof camera !== "object")
    throw new TypeError("THREE.GUI.camera shoud be a valid THREE.PerspectiveCamera.");
  _camera = camera;
})

THREE.GUI.__defineGetter__("camera", function () {
  if (_camera === null)
    throw new TypeError("THREE.GUI.camera shoud be set to handle click events.");
  return _camera;
});

}();