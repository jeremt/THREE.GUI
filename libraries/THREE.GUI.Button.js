
~function () {

THREE     = THREE     || {};
THREE.GUI = THREE.GUI || {};

/**
 * Default button style.
 */
var _style = {

  width: 200,                         /** Button's width. */
  height: 80,                         /** Button's height. */
  depth: 40,                          /** Button's depth. */

  padding: 10,                        /** Padding inside the button. */

  transition: 0.3,                    /** Animation transition. */

  scale: new THREE.Vector3(1, 1, 1),  /** Button scale value. */

  backgroundImage: null,              /** Potential bg image. */
  backgroundColor: 0x222222,          /** Bg color. */

  textColor: 0xffffff,                /** Text color. */
  textDepthColor: 0x555555,           /** Text side color. */
  textDepth: 5,                       /** Text depth. */
  textSmooth: false,                  /** True for smooth text geometry. */
  textAlign: 'center',                /** Text alignement. */

  receiveLight: true,                 /** True for PhongMaterial. */

  fontFamily: "droid sans",           /** Font family. */
  fontWeight: "normal",               /** Font weight. */
  fontStyle: "normal",                /** Font style. */
  fontSize: 40                        /** Font size. */

};

/**
 * Be careful, the following properties are only take in account
 * in default style:
 *
 *   - width
 *   - height
 *   - depth
 *   - padding
 *   - receiveLight
 *   - fontFamily
 *   - fontWeight
 *   - fontStyle
 *   - fontSize
 *
 */

/**
 * Default hovered button style.
 */
var _hoverStyle = {
  backgroundColor: 0x111111
};

/**
 * Default focus button style.
 */
var _focusStyle = {
  backgroundColor: 0x111111,
  scale: new THREE.Vector3(0.95, 0.95, 0.8)
};

var _selectStyle = {
  backgroundColor: 0x111111,
  scale: new THREE.Vector3(1.1, 1.1, 1.1)
}

var _projector = new THREE.Projector();

/**
 * Create a new button.
 */
THREE.GUI.Button = function (text, props) {
  THREE.EventDispatcher.call(this);
  THREE.Object3D.call(this);
  this.text = text;
  this._hovered = false;
  this._transitionDelay = 0;

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
  self._style       = Object.create(_style);
  self._hoverStyle  = Object.create(_hoverStyle);
  self._focusStyle  = Object.create(_focusStyle);
  self._selectStyle = Object.create(_selectStyle);
  for (var key in props)
    self._style[key] = props[key];
  for (var key in self._style) {
    if (self._hoverStyle[key] === undefined)
      self._hoverStyle[key] = self._style[key];
    if (self._focusStyle[key] === undefined)
      self._focusStyle[key] = self._style[key];
    if (self._selectStyle[key] === undefined)
      self._selectStyle[key] = self._style[key];
  }
}

/**
 * Generate the button text.
 */
var _generateText = function (self) {
  // TODO - Generate background image.

  if (/[^ ]/g.test(self.text)) {
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
        _createMaterial(self._style.receiveLight, {
          color: self._style.textColor
        }),
        _createMaterial(self._style.receiveLight, {
          color: self._style.textDepthColor
        })
      ])
    );
  } else {
    self.textMesh = null;
  }
}

/**
 * Place the button text.
 */
var _placeText = function (self) {
  if (self.textMesh === null)
    return ;
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
    if (/'|l|t|i|d|f|h|k|b|[A-Z]|[0-9]/g.test(self.text))
      offset += self.textMesh.height / 10;
    if (/_|q|y|p|g|j/g.test(self.text))
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
 * Set style values.
 */
var _setStyle = function (self, style, progress) {
  switch (progress) {
    case 0:
      return;
    case 1:
      self.scale = style.scale;
      self.backgroundMesh.material.color.setHex(style.backgroundColor);
      if (self.textMesh) {
        self.textMesh.material.materials[0].color.setHex(style.textColor);
        self.textMesh.material.materials[1].color.setHex(style.textDepthColor);
      }
      return;
    default:
      var color = new THREE.Color();
      // self.scale = style.scale;
      self.scale = self.scale.clone().lerp(style.scale, progress);
      color.setHex(style.backgroundColor);
      self.backgroundMesh.material.color.lerp(color, progress);
      if (self.textMesh) {
        color.setHex(style.textColor);
        self.textMesh.material.materials[0].color.lerp(color, progress);
        color.setHex(style.textDepthColor);
        self.textMesh.material.materials[1].color.lerp(color, progress);
      }
      break;
  } 
}

/**
 * Update style.
 */
var _updateStyle = function (self, style, event) {
  if (event === undefined) {
    if (style.transition === 0)
      _setStyle(self, style, 1);
    else {
      self._currentStyle = Object.create(style);
      self._transitionDelay = style.transition;
    }
  } else {
    if (self._transitionDelay > 0) {
      self._transitionDelay -= event.deltaTime;
      var progress = 1 - (self._transitionDelay / style.transition);
      _setStyle(self, style, progress);
    } else {
      self._transitionDelay = 0;
      _setStyle(self, style, 1);
    }
  }
}

/**
 * Regenerate button mesh, be careful about this function because
 * it's gonna regenerate a new Mesh with updated data, and that could
 * be very slow.
 */
THREE.GUI.Button.prototype.regenerate = function (style) {
  if (this.textMesh) {
    this.remove(this.textMesh);
    this.textMesh = null;
  }
  _generateText(this);
  _placeText(this);
  _setStyle(this, style, 1);
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

/**
 * Set button's style when is selected.
 */
THREE.GUI.Button.prototype.selectStyle = function (props) {
  for (var key in props)
    this._selectStyle[key] = props[key];
}

/**
 * Update the button style with the given style.
 * @param {Object} the style to apply.
 * @param {Object} the current frame event.
 */
THREE.GUI.Button.prototype._updateStyle = function (style, event) {
  _updateStyle(this, style, event);
}

/**
 * Check if this object hit the mouse (this method should
 * be implemented to handle click on GUI objects).
 */
THREE.GUI.Button.prototype.hitMouse = function () {
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
  for (var i in this.children)
    objs.push(this.children[i]);
  return raycaster.intersectObjects(objs).length > 0;
}

/**
 * Update button when is selected (this method must be implemented
 * to work with GUI.List).
 */
THREE.GUI.Button.prototype.select = function () {
  _updateStyle(this, this._selectStyle);
}

/**
 * Update button when isnt selected anymore (this method must be
 * implemented to work with GUI.List).
 */
THREE.GUI.Button.prototype.unselect = function () {
  _updateStyle(this, this._style);
}

/**
 * Call this method at each frame to update button behaviour.
 */
THREE.GUI.Button.prototype.update = function (event) {
  if (this._transitionDelay != 0)
    _updateStyle(this, this._currentStyle, event);
  if (!this.hitMouse()) {
    if (this._hovered) {
      this._hovered = false;
      this.dispatchEvent({type: 'unhover', id: this.id});
      _updateStyle(this, this._style);
    }
  } else {
    if (THREE.Input.isMouseDown()) {
      _updateStyle(this, this._focusStyle);
      this.dispatchEvent({type: 'focus', id: this.id});
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