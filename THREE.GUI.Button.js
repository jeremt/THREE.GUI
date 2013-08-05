
~function () {

THREE = THREE || {};
THREE.GUI = THREE.GUI || {};

var _style = {

  width: 200,
  height: 80,
  depth: 40,

  scale: new THREE.Vector3(1, 1, 1),

  backgroundColor: 0x222222,

  textColor: 0xffffff,
  textDepth: 5,
  textSmooth: false,
  textColor: 0xffffff,
  textDepthColor: 0x555555,

  receiveLight: true,

  fontFamily: "droid sans",
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: 40

};

var _hoverStyle = {
  backgroundColor: 0x111111
};

var _activeStyle = {
  backgroundColor: 0x111111,
  scale: new THREE.Vector3(0.95, 0.95, 0.8)
};

var _currentStyle = _style;

var _projector = new THREE.Projector();

var _hovered = false;

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
    if (_activeStyle[key] === undefined)
      _activeStyle[key] = _style[key];
  }
}

/**
 * Generate the button from the given properties.
 */
var _generate = function (self, style) {
  self.text = new THREE.Mesh(
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
  self.text.translateX(-style.width / 4);
  self.text.translateY(-style.height / 4);
  self.text.translateZ(style.depth / 2);
  self.add(self.text);

  self.bg = new THREE.Mesh(
    new THREE.CubeGeometry(style.width, style.height, style.depth),
    _createMaterial(style.receiveLight, {
      color: style.backgroundColor
    })
 );
  self.add(self.bg);
  self.scale = style.scale;
}

/**
 * Update style.
 */
var _updateStyle = function (self, style) {
  if (style === _currentStyle)
    return;
  _currentStyle = style;
  self.scale = style.scale;
  self.bg.material.color.setHex(style.backgroundColor);
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
THREE.GUI.Button.prototype.activeStyle = function (props) {
  for (var key in props)
    _activeStyle[key] = props[key];
}

var _hasMouseCollision = function (obj, camera) {
  var vector = new THREE.Vector3(
     THREE.Input.getMouseX() / window.innerWidth  * 2 - 1,
    -THREE.Input.getMouseY() / window.innerHeight * 2 + 1,
    0.5
  );
  _projector.unprojectVector(vector, camera);
  var raycaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );
  var objs = [];
  for (var i in obj.children)
    objs.push(obj.children[i]);
  return raycaster.intersectObjects(objs).length > 0;
}

/**
 * Call this button at each frame to update button behaviour.
 */
THREE.GUI.Button.prototype.update = function (deltaTime, camera) {
  if (!_hasMouseCollision(this, camera)) {
    if (_hovered) {
      _hovered = false;
      this.dispatchEvent({type: 'unhover', id: this.id});
    }
    _updateStyle(this, _style);
  } else {

    // Events

    if (THREE.Input.isMouseDown())
      this.dispatchEvent({type: 'active', id: this.id});
    else if (THREE.Input.isMouseUp())
      this.dispatchEvent({type: 'click', id: this.id});
    else if (!_hovered) {
      _hovered = true;
      this.dispatchEvent({type: 'hover', id: this.id});
    }

    // TODO - hover

    // Style

    _updateStyle(this,
      THREE.Input.isMousePressed() ?
      _activeStyle : _hoverStyle
    );

  }

}

}();