
~function () {

THREE = THREE || {};
THREE.GUI = THREE.GUI || {};

var _style = {

  width: 200,
  height: 80,
  depth: 40,

  backgroundColor: 0x222222,

  textColor: 0xffffff,
  textDepth: 5,
  textSmooth: true,
  textColor: 0xffffff,
  textDepthColor: 0x555555,

  receiveLight: false,

  fontFamily: "droid sans",
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: 40

};

var _hoverStyle = {
  backgroundColor: 0x444444
};

var _focusStyle = {
  depth: 10
};

/**
 * Create a new button.
 */
THREE.GUI.Button = function (text, props) {
  THREE.EventDispatcher.call(this);
  THREE.Object3D.call(this);
  this.text = text;
  _initializeStyles(props);
  _generate(this, _style);
}

THREE.GUI.Button.prototype = Object.create(THREE.Object3D.prototype);

/**
 * 
 */
var _createMaterial = function (receiveLight, props) {
  if (receiveLight)
    return new THREE.MeshPhongMaterial(props);
  return new THREE.MeshBasicMaterial(props);
}

/**
 * Initalize styles for each button states.
 */
var _initializeStyles = function (props) {
  for (var key in props)
    _style[key] = props[key];
  for (var key in _style) {
    if (_hoverStyle[key] === undefined)
      _hoverStyle[key] = _style[key];
    if (_focusStyle[key] === undefined)
      _focusStyle[key] = _style[key];
  }
}

/**
 * Generate the button from the given properties.
 */
var _generate = function (self, style) {
  var text = new THREE.Mesh(
    new THREE.TextGeometry(self.text, {
      size: style.fontSize,
      height: style.textDepth,
      curveSegments: 4,

      font: style.fontFamily,
      weight: style.fontWeight,
      style: style.fontStyle,

      bevelThickness: 2,
      bevelSize: 1.5,
      bevelEnabled: style.textSmooth,

      extrudeMaterial: 1

    }),
    new THREE.MeshFaceMaterial([
      _createMaterial(style.receiveLight, {color: style.textColor}),
      _createMaterial(style.receiveLight, {color: style.textDepthColor})
    ])
  );
  text.translateX(-style.width / 4);
  text.translateY(-style.height / 4);
  text.translateZ(style.depth / 2);
  self.add(text);

  var bg = new THREE.Mesh(
    new THREE.CubeGeometry(style.width, style.height, style.depth),
    _createMaterial(style.receiveLight, {
      color: style.backgroundColor
    })
  );
  self.add(bg);

}

/**
 * Set button's normal style.
 */
THREE.GUI.Button.prototype.style = function (props) {
  for (var key in props)
    _style[key] = props[key];
}

/**
 * Set button's style when is hovered.
 */
THREE.GUI.Button.prototype.hoverStyle = function (props) {
  for (var key in props)
    _hoverStyle[key] = props[key];
}

/**
 * Set button's style when is focused.
 */
THREE.GUI.Button.prototype.focusStyle = function (props) {
  for (var key in props)
    _focusStyle[key] = props[key];
}

/**
 * Call this button at each frame to update button behaviour.
 */
THREE.GUI.Button.prototype.update = function (deltaTime) {
  if (THREE.Input.isMouseDown())
    this.dispatchEvent({type: 'focus'});
  if (THREE.Input.isMouseUp())
    this.dispatchEvent({type: 'click'});
}

}();