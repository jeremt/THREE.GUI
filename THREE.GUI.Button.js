
~function () {

THREE     = THREE     || {};
THREE.GUI = THREE.GUI || {};

var _style = {

  width: 200,
  height: 80,
  depth: 40,

  padding: 10,

  scale: new THREE.Vector3(1, 1, 1),

  backgroundImage: null,
  backgroundColor: 0x222222,

  textColor: 0xffffff,
  textDepth: 5,
  textSmooth: false,
  textColor: 0xffffff,
  textDepthColor: 0x555555,
  textAlign: 'center',

  receiveLight: true,

  fontFamily: "droid sans",
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: 40

};

var _hoverStyle = {
  backgroundColor: 0x111111
};

var _focusStyle = {
  backgroundColor: 0x111111,
  scale: new THREE.Vector3(0.95, 0.95, 0.8)
};

var _projector = new THREE.Projector();

/**
 * Create a new button.
 */
THREE.GUI.Button = function (text, props) {
  THREE.EventDispatcher.call(this);
  THREE.Object3D.call(this);
  this.text = text;
  this._hovered = false;

  _initializeStyles(this, props);
  _generateText(this);
  _generateBackground(this);
  _placeText(this);

  // needed for GUI.List placement.
  this.geometry = new THREE.Geometry();
  this.geometry.height = this.backgroundMesh.geometry.height;
}

THREE.GUI.Button.prototype = Object.create(THREE.Object3D.prototype);

/**
 * Create button material.
 */
var _createMaterial = function (receiveLight, props) {
  if (receiveLight)
    return new THREE.MeshPhongMaterial(props);
  return new THREE.MeshBasicMaterial(props);
}

/**
 * Initalize styles for each button states.
 */
var _initializeStyles = function (self, props) {
  self._style      = Object.create(_style);
  self._hoverStyle = Object.create(_hoverStyle);
  self._focusStyle = Object.create(_focusStyle);
  for (var key in props)
    self._style[key] = props[key];
  for (var key in self._style) {
    if (self._hoverStyle[key] === undefined)
      self._hoverStyle[key] = self._style[key];
    if (self._focusStyle[key] === undefined)
      self._focusStyle[key] = self._style[key];
  }
}

/**
 * Generate the button text.
 */
var _generateText = function (self) {
  // TODO - Generate background image.
  self.textMesh = new THREE.Mesh(
    new THREE.TextGeometry(self.text, {
      size: self._style.fontSize,
      height: self._style.textDepth,
      curveSegments: 4,

      font: self._style.fontFamily,
      weight: self._style.fontWeight,
      style: self._style.fontStyle,

      bevelThickness: 2,
      bevelSize: 1.5,
      bevelEnabled: self._style.textSmooth,

      extrudeMaterial: 1

    }),
    new THREE.MeshFaceMaterial([
      _createMaterial(self._style.receiveLight, {color: self._style.textColor}),
      _createMaterial(self._style.receiveLight, {color: self._style.textDepthColor})
    ])
  );
}

/**
 * Place the button text.
 */
var _placeText = function (self) {
  self.textMesh.geometry.computeBoundingBox();
  self.textMesh.width  = self.textMesh.geometry.boundingBox.max.x
                       - self.textMesh.geometry.boundingBox.min.x;
  self.textMesh.height = self.textMesh.geometry.boundingBox.max.y
                       - self.textMesh.geometry.boundingBox.min.y;
  switch (self._style.textAlign)
  {
    case 'center':
      self.textMesh.translateX(-self.textMesh.width / 2);
      break;
    case 'right':
      self.textMesh.translateX(self._style.width / 2 - self._style.padding);
      self.textMesh.translateX(-self.textMesh.width);
      break;
    case 'left':
    default:
      self.textMesh.translateX(-self._style.width / 2 + self._style.padding);
      break;
  }
  var offset = -self.textMesh.height / 2;

  //!\\ dirty fix for good alignement.
  if (/\(|\)|\||\[|\]/g.test(self.text))
    offset += self.textMesh.height / 5;
  else {
    if (/l|t|i|d|f|h|k|b|[A-Z]|[0-9]/g.test(self.text))
      offset += self.textMesh.height / 10;
    if (/q|y|p|g|j/g.test(self.text))
      offset += self.textMesh.height / 10;
  }

  self.textMesh.translateY(offset);
  self.textMesh.translateZ(self._style.depth / 2);
  self.add(self.textMesh);
}

/**
 * Generate the button background.
 */
var _generateBackground = function (self) {
  self.backgroundMesh = new THREE.Mesh(
    new THREE.CubeGeometry(self._style.width, self._style.height, self._style.depth),
    _createMaterial(self._style.receiveLight, {
      color: self._style.backgroundColor
    })
 );
  self.add(self.backgroundMesh);
  self.scale = self._style.scale;
}

/**
 * Update style.
 */
var _updateStyle = function (self, style) {
  self.scale = style.scale;
  self.backgroundMesh.material.color.setHex(style.backgroundColor);
  self.textMesh.material.materials[0].color.setHex(style.textColor);
  self.textMesh.material.materials[1].color.setHex(style.textDepthColor);
}

/**
 * Set button's normal style.
 */
THREE.GUI.Button.prototype.style = function (props) {
  for (var key in props)
    this._style[key] = props[key];
}

/**
 * Set button's style when is hovered.
 */
THREE.GUI.Button.prototype.hoverStyle = function (props) {
  for (var key in props)
    this._hoverStyle[key] = props[key];
}

/**
 * Set button's style when is focused.
 */
THREE.GUI.Button.prototype.focusStyle = function (props) {
  for (var key in props)
    this._focusStyle[key] = props[key];
}

var _hasMouseCollision = function (obj) {
  var vector = new THREE.Vector3(
     THREE.Input.getMouseX() / window.innerWidth  * 2 - 1,
    -THREE.Input.getMouseY() / window.innerHeight * 2 + 1,
    0.5
  );
  _projector.unprojectVector(vector, THREE.GUI.camera);
  var raycaster = new THREE.Raycaster(
    THREE.GUI.camera.position,
    vector.sub(THREE.GUI.camera.position).normalize()
  );
  var objs = [];
  for (var i in obj.children)
    objs.push(obj.children[i]);
  return raycaster.intersectObjects(objs).length > 0;
}

/**
 * Focus on this button (this method must be implemented
 * to work with GUI.List).
 */
THREE.GUI.Button.prototype.focus = function () {
  _updateStyle(this, this._focusStyle);
  this.dispatchEvent({type: 'focus', id: this.id});
}

/**
 * Lost focus on this button (this method must be implemented
 * to work with GUI.List).
 */
THREE.GUI.Button.prototype.unfocus = function () {
  _updateStyle(this, this._style);
}

/**
 * Call this method at each frame to update button behaviour.
 */
THREE.GUI.Button.prototype.update = function (event) {
  if (!_hasMouseCollision(this)) {
    if (this._hovered) {
      this._hovered = false;
      this.dispatchEvent({type: 'unhover', id: this.id});
      this.unfocus();
    }
  } else {
    if (THREE.Input.isMouseDown()) {
      this.focus();
    } else if (THREE.Input.isMouseUp()) {
      _updateStyle(this, this._hoverStyle);
      this.dispatchEvent({type: 'click', id: this.id});
    } else if (!this._hovered) {
      this._hovered = true;
      _updateStyle(this, this._hoverStyle);
      this.dispatchEvent({type: 'hover', id: this.id});
    }
  }
}

}();