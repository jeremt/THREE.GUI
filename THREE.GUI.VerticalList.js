
~function () {

THREE     = THREE     || {};
THREE.GUI = THREE.GUI || {};

var _style = {
  margin: 10
};

/**
 * Create a new VerticalList.
 */
THREE.GUI.VerticalList = function (props) {
  this._list = [];
  this._current = 0;
  this._needUpdate = true;
  this._style = Object.create(_style);
  this.style(props);
  THREE.EventDispatcher.call(this);
  THREE.Object3D.call(this);
}

/**
 * Inherite from Object3d.
 */
THREE.GUI.VerticalList.prototype =
  Object.create(THREE.Object3D.prototype);

/**
 * Set list style.
 */
THREE.GUI.VerticalList.prototype.style = function (props) {
  for (var key in props)
    this._style[key] = props[key];
}

/**
 * Append an object to the list.
 */
THREE.GUI.VerticalList.prototype.append = function (obj) {
  this.add(obj);
  this._list.push(obj);
  _updatePositions(this);
}

/**
 * Prepend an object to the list.
 */
THREE.GUI.VerticalList.prototype.prepend = function (obj) {
  this.add(obj);
  this._list.unshift(obj);
  _updatePositions(this);
}

/**
 * Remove an object from the list.
 */
THREE.GUI.VerticalList.prototype.removeAt = function (index) {
  this.remove(this._list[index]);
  this._list.splice(index, 1);
  _updatePositions(this);
}

/**
 * Call this method at each frame to update list behaviour.
 */
THREE.GUI.VerticalList.prototype.update = function (event) {

  // If has event listener sumbit, then update keyboard events.

  if (this._listeners["submit"] !== undefined) {
    if (THREE.Input.isKeyRepeat("upArrow", 0.2, event.deltaTime))
      _goPrevious(this);
    if (THREE.Input.isKeyRepeat("downArrow", 0.2, event.deltaTime))
      _goNext(this);
    if (THREE.Input.isKeyDown("enter"))
      this.dispatchEvent({type: 'submit', choice: this._current});

    if (this._needUpdate) {
      this._needUpdate = false;
      _updateMove(this);
    }

  }

  // If has event listener click, then update click events.

  if (this._listeners["click"] !== undefined) {

    if (THREE.Input.getMouseButton() === 'left')
      this._leftButtonClicked = true;
    else if (THREE.Input.getMouseButton() !== 'none')
      this._leftButtonClicked = false;

    for (var i = 0; i < this._list.length; ++i) {
      if (
        this._list[i].hitMouse() &&
        THREE.Input.isMouseUp() &&
        this._leftButtonClicked
      ) {
        this.dispatchEvent({type: 'click', choice: i});
      }
      this._list[i].update(event);
    }

  }

}

/**
 * Compute vertical offset to translate for each element.
 */
var _verticalOffset = function (self, index) {
  var res = 0;
  for (var i = index; i < self._list.length; ++i)
    res += self._list[i].geometry.height + self._style.margin;
  return res;
}

/**
 * Place all elements according list center.
 */
var _updatePositions = function (self) {

  if (self._list.length < 2)
    return ;

  // Compute offset.

  var offset = self._style.margin; // remove bottom margin.
  for (var i = 0; i < self._list.length; ++i)
    offset += self._list[i].geometry.height + self._style.margin;
  offset += self._list[0].geometry.height;
  offset /= 2;

  // Place list items.

  for (var i = 0; i < self._list.length; ++i) {
    self._list[i].position.set(0, -offset, 0);
    self._list[i].translateY(_verticalOffset(self, i));
  }
}

/**
 * Update style and event according current position in list.
 */
var _updateMove = function (self) {
  for (var i = 0; i < self._list.length; ++i) {
    if (i === self._current)
      self._list[i].select();
    else
      self._list[i].unselect();
  }
  self.dispatchEvent({type: 'change', choice: this._current});
}

/**
 * Go to the previous element.
 */
var _goPrevious = function (self) {
  --self._current;
  if (self._current < 0)
    self._current = self._list.length - 1;
  _updateMove(self);
}

/**
 * Go to the next element.
 */
var _goNext = function (self) {
  ++self._current;
  if (self._current >= self._list.length)
    self._current = 0;
  _updateMove(self);
}

}();