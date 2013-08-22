
~function () {

var _defaultInfos = {
  from: 0,
  to: 100,
  step: 1,
  value: 0
};

var _style = {
  width: 400,
  height: 80,
  depth: 40,
  cursorStroke: 20,
  backgroundColor: 0xcccccc,
  receiveLight: true
};

THREE.GUI.Range = function (infos, props) {
  var self = this;

  THREE.EventDispatcher.call(this);
  THREE.Object3D.call(this);

  infos || (infos = {});

  for (var key in _defaultInfos)
    if (!infos[key]) infos[key] = _defaultInfos[key];
  this._infos = infos;

  _initializeStyle(this, props)

  this.bar = new THREE.Mesh(
    new THREE.CubeGeometry(
      this._style.width,
      this._style.height,
      this._style.depth
    ),
    _createMaterial(this._style.receiveLight, {
      color: this._style.backgroundColor
    })
  );
  this.add(this.bar);

  var w = (this._infos.to - this._infos.from) / this._infos.step;
  this.cursor = new THREE.GUI.Button("", {
    width: this._style.width / w + this._style.cursorStroke,
    height: this._style.height + this._style.cursorStroke,
    depth: this._style.depth + this._style.cursorStroke
  });
  this.add(this.cursor);

  this.cursorFocused = false;
  this.cursor.addEventListener("focus", function () {
    self.cursorFocused = true;
    self.mouseOffset = THREE.Input.getMouseX();
    self.mouseDiff = 0;
  });

  _placeCursor(this);

}

/**
 * Inherite from Object3D prototype.
 */
THREE.GUI.Range.prototype =
  Object.create(THREE.Object3D.prototype);

/**
 * Update at each frame.
 */
THREE.GUI.Range.prototype.update = function (event) {
  this.cursor.update(event);
  if (!THREE.Input.isMousePressed())
    this.cursorFocused = false;
  if (this.cursorFocused) {
    this.mouseDiff += THREE.Input.getMouseX() - this.mouseOffset;
    // this.cursor.translateX(THREE.Input.getMouseX() - this.mouseOffset);
    _handleLimits(this);
    this.mouseOffset = THREE.Input.getMouseX();
    // TODO - move by step (step = 10 is too fast)
    console.log(this.mouseDiff);
    if (this.mouseDiff > 0 && this._infos.value < this._infos.to) {
      this._infos.value += this._infos.step;
      this.dispatchEvent({type: 'change', value: this._infos.value});
      this.mouseDiff = 0;
    }
    if (this.mouseDiff < 0 && this._infos.value > this._infos.from) {
      this._infos.value -= this._infos.step;
      this.dispatchEvent({type: 'change', value: this._infos.value});
      this.mouseDiff = 0;
    }

    _placeCursor(this);
  }
}

var _placeCursor = function (self) {
  self.cursor.position.x = self.bar.position.x
                         - self.bar.geometry.width / 2;
  var step =  self.bar.geometry.width /
             (self._infos.to - self._infos.from);
  self.cursor.translateX(self._infos.value * step);
}

var _handleLimits = function (self) {
  var offset = self.cursor.backgroundMesh.geometry.width / 2;
  var minCursorX = self.cursor.position.x - offset;
  var maxCursorX = self.cursor.position.x + offset;
  var minBarX = self.bar.position.x
                 - self.bar.geometry.width / 2;
  var maxBarX = self.bar.position.x
                 + self.bar.geometry.width / 2;
  if (minCursorX < minBarX)
    self.cursor.position.x = minBarX + offset;
  if (maxCursorX > maxBarX)
    self.cursor.position.x = maxBarX + offset;
}

var _createMaterial = function (receiveLight, props) {

  if (receiveLight)
    return new THREE.MeshPhongMaterial(props);
  return new THREE.MeshBasicMaterial(props);
}

var _initializeStyle = function (self, props) {
  self._style = {};
  for (var key in _style)
    self._style[key] = _style[key];
  for (var key in props)
    self._style[key] = props[key];
}

}();