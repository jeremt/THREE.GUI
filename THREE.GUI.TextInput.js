
~function () {

var _style = {
  backgroundColor: 0xcccccc,
  textColor: 0x444444,
  width: 500,
  textAlign: 'left'
}

var _hoverStyle = {
  backgroundColor: 0xaaaaaa,
  textColor: 0x222222
}

var _focusStyle = {
  backgroundColor: 0xaaaaaa,
  textColor: 0x222222,
  scale: new THREE.Vector3(1, 1, 1)
}

/**
 * Create a new text input.
 */
THREE.GUI.TextInput = function (text, props) {

  if (typeof text === "object") {
    text = "";
    props = text;
  } else if (text === undefined) {
    text = "";
    props = {};
  }

  for (var key in _style)
    props[key] = _style[key];

  THREE.GUI.Button.call(this, text, props);
  this.hoverStyle(_hoverStyle);
  this.focusStyle(_focusStyle);

  this._focused = false;
  this.text = text;

}

/**
 * Inherite from GUI.Button.
 */
THREE.GUI.TextInput.prototype =
  Object.create(THREE.GUI.Button.prototype);

var _updateText = function (self) {
  if (self._focused === false || !THREE.Input.isKeyPressed())
    return ;
  if (THREE.Input.isKeyDown("backspace")) {
     self.text = self.text.slice(0, -1);
     self.dispatchEvent({
      type   : 'change',
      id     : self.id,
      text   : self.text
    });
  } else if (THREE.Input.isKeyDown("enter")) {
    THREE.Input.getTextEntered(); // do not call change after
    if (self.text !== "") {
      self.dispatchEvent({
        type   : 'submit',
        id     : self.id,
        text   : self.text
      });
      self.text = "";
      _unfocus(self);
    }
  } else {
    var txt = THREE.Input.getTextEntered();
    if (txt !== null) {
      self.text += txt;
      self.dispatchEvent({
        type   : 'change',
        id     : self.id,
        text   : self.text
      });
    }
  }
  self.regenerate(self._focusStyle);
}

var _unfocus = function (self) {
  self._focused = false;
  self._hovered = false;
  self.dispatchEvent({
    type   : 'unfocus',
    id     : self.id,
    text   : self.text
  });
  self._updateStyle(self._style);
}

/**
 * Update text input on each frame.
 */
THREE.GUI.TextInput.prototype.update = function (event) {
  if (this._transitionDelay != 0)
    this._updateStyle(this._currentStyle, event);
  _updateText(this);
  if (THREE.Input.isMouseDown()) {
    if (this.hitMouse() && !this._focused) {
      this._focused = true;
      this._hovered = false;
      this.dispatchEvent({
        type   : 'focus',
        id     : this.id,
        text   : this.text
      });
      this._updateStyle(this._focusStyle);
    } else if (!this.hitMouse() && this._focused) {
      _unfocus(this);
    }
  } else {
    if (this.hitMouse() && !this._focused && !this._hovered) {
      this._hovered = true;
      this.dispatchEvent({
        type   : 'hover',
        id     : this.id,
        text   : this.text
      });
      this._updateStyle(this._hoverStyle);
    } else if (!this.hitMouse() && !this._focused && this._hovered) {
      this._hovered = false;
      this.dispatchEvent({
        type   : 'unhover',
        id     : this.id,
        text   : this.text
      });
      this._updateStyle(this._style);
    }
  }
}

}();