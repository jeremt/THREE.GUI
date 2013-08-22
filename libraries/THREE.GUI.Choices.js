
~function () {

var _style = {
  width: 400,             /** Choices's width.  */
  height: 80,             /** Choices's height. */
  depth: 40,              /** Choices's depth.  */
  textColor: 0x222222     /** Text color */
};

/**
 * Create a choice GUI object.
 */
THREE.GUI.Choices = function (choices, props) {
  var self = this;

  THREE.EventDispatcher.call(this);
  THREE.Object3D.call(this);

  _initializeStyle(this, props);

  var btnStyle = {
    width: this._style.width / 5,
    height: this._style.height,
    depth: this._style.depth
  };

  this.choices = choices || [];

  this.leftButton = new THREE.GUI.Button("<", btnStyle);
  this.leftButton.translateX(-this._style.width / 2);
  this.add(this.leftButton);
  this.rightButton = new THREE.GUI.Button(">", btnStyle);
  this.rightButton.translateX(this._style.width / 2);
  this.add(this.rightButton);

  // get style from button
  this.style = this.leftButton.style; // method
  for (var key in this.leftButton._style) {
    if (!this._style[key])
      this._style[key] = this.leftButton._style[key];
  }

  this.current = 0;
  this.previous = 0;
  
  this.leftButton.addEventListener('click', function () {
    self.previous = self.current;
    self.current--;
    if (self.current < 0)
      self.current = self.choices.length - 1;
    _updateText(self);
  });

  this.rightButton.addEventListener('click', function () {
    self.previous = self.current;
    self.current++;
    if (self.current > self.choices.length - 1)
      self.current = 0;
    _updateText(self);
  });

  _generateText(this);
  _updateText(this, true);

}

/**
 * Inherite from Object3D prototype.
 */
THREE.GUI.Choices.prototype =
  Object.create(THREE.Object3D.prototype);

/**
 * Update at each frames.
 */
THREE.GUI.Choices.prototype.update = function (event) {
  this.leftButton.update(event);
  this.rightButton.update(event);
}

/**
 * Initialize style.
 */
var _initializeStyle = function (self, props) {
  self._style = {};
  for (var key in _style)
    self._style[key] = _style[key];
  for (var key in props)
    self._style[key] = props[key];
}

var _createMaterial = function (receiveLight, props) {
  return new THREE[
    'Mesh' + (receiveLight ? 'Phong' : 'Basic') + 'Material'
  ](props);
}

/**
 * Generate all text meshes.
 */
var _generateText = function (self) {
  self.textMeshes = [];
  for (var i = 0; i < self.choices.length; ++i) {
    var mesh = new THREE.Mesh(
      new THREE.TextGeometry(self.choices[i], {
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

    mesh.geometry.computeBoundingBox();
    var width =
        mesh.geometry.boundingBox.max.x
      - mesh.geometry.boundingBox.min.x;
    var height =
        mesh.geometry.boundingBox.max.y
      - mesh.geometry.boundingBox.min.y;
    mesh.translateX(-width / 2);
    mesh.translateY(-height / 2);
    mesh.visible = false;
    self.textMeshes.push(mesh);
    self.add(mesh);
  }
}

/**
 * Change current text mesh.
 */
var _updateText = function (self, isFirst) {
  self.textMeshes[self.previous].visible = false;
  self.textMeshes[self.current].visible = true;
  if (!isFirst)
    self.dispatchEvent({type: 'change', value: self.current});
}

}();