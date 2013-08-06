
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
  if (camera instanceof THREE.PerspectiveCamera)
    _camera = camera;
  else
    throw new TypeError("THREE.GUI.camera shoud be a valid THREE.PerspectiveCamera.");
})

THREE.GUI.__defineGetter__("camera", function () {
  if (_camera === null)
    throw new TypeError("THREE.GUI.camera shoud be set to handle click events.");
  return _camera;
});

}();