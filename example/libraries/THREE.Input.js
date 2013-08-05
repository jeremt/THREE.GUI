
~function () {

THREE = THREE || {};
THREE.Input = {};

// Some default alias and modifiers...
var MODIFIERS = ['shift', 'ctrl', 'alt', 'altgr'];
var ALIAS = { // some default aliases...
  'leftArrow'     : [37],
  'upArrow'       : [38],
  'rightArrow'    : [39],
  'downArrow'     : [40],
  'space'         : [32],
  'pageup'        : [33],
  'pagedown'      : [34],
  'tab'           : [9],
  'backspace'     : [8],
  'suppr'         : [46],
  'escape'        : [27],
  'enter'         : [13],
  'F1'            : [112],
  'F2'            : [113],
  'F3'            : [114],
  'F4'            : [115],
  'F5'            : [116],
  'F6'            : [117],
  'F7'            : [118],
  'F8'            : [119],
  'F9'            : [120],
  'F10'           : [121],
  'F11'           : [122],
  'F12'           : [123]
};

var _keyCodes = new Array(256);
var _modifiers = new Array(4);

var _keyDown = {};
var _keyUp = {};

var _isKeyPressed = false;
var _isMousePressed = false;
var _isMouseDown = false;
var _isMouseUp = false;
var _mouseX = Infinity;
var _mouseY = Infinity;
var _mouseButton = "none";

var _onKeyDown    = function (e) {_onKey(e, true)}
var _onKeyUp      = function (e) {_onKey(e, false)}

var _onMouseUp    = function (e) {
  _isMousePressed = false;
  _isMouseUp = true;
  _mouseButton = "none";

}

var _onMouseDown  = function (e) {
  switch (e.button) {
    case 0: _mouseButton = "left"; break;
    case 1: _mouseButton = "middle"; break;
    case 2: _mouseButton = "right"; break;
    break;
  }
  _isMousePressed = true;
  _isMouseDown = false;
}

var _onMouseMove  = function (e) {
  _mouseX = e.clientX;
  _mouseY = e.clientY;
  if (_mouseX < 0)
    _mouseX = 0;
  if (_mouseX > window.innerWidth)
    _mouseX = window.innerWidth;
  if (_mouseY < 0)
    _mouseY = 0;
  if (_mouseY > window.innerHeight)
    _mouseY = window.innerHeight;
}

document.addEventListener("keydown", _onKeyDown, false);
document.addEventListener("keyup", _onKeyUp, false);
document.addEventListener("mousedown", _onMouseDown, false);
document.addEventListener("mouseup", _onMouseUp, false);
document.addEventListener("mousemove", _onMouseMove, false);

function _onKey(e, pressed) {
  _isKeyPressed = pressed;
  _keyCodes[e.keyCode] = pressed;
  switch (e.keyIdentifier) {
    case "U+0000":
      _modifiers['altgr'] = pressed;
      break;
    case "Alt":
      _modifiers['alt'] = pressed;
      break;
    case "Control":
      _modifiers['ctrl'] = pressed;
      break;
    case "Shift":
      _modifiers['shift'] = pressed;
      break;
  }
  var arr = pressed ? _keyUp : _keyDown;
  for (var key in arr)
    arr[key] = false;
}

THREE.Input.isKeyDown = function (keyDesc) {
  if (THREE.Input.isKeyPressed(keyDesc)) {
    if (_keyDown[keyDesc])
      return false;
    _keyDown[keyDesc] = true;
    return true;
  }
  return false;
}

THREE.Input.isKeyUp = function (keyDesc) {
  if (!THREE.Input.isKeyPressed(keyDesc)) {
    if (_keyUp[keyDesc])
      return false;
    _keyUp[keyDesc] = true;
    return true;
  }
  return false;
}

/**
 * Look at keyboard state to know if a key is pressed
 * of not (without args look at all keys)
 *
 * @param {String} keyDesc the description of the key.
 * @return {Boolean} true if the key is pressed, false otherwise
 * @example key.pressed("ctrl+space") == true
*/
THREE.Input.isKeyPressed = function (keyDesc) {
  var keys, pressed, key, modif;

  switch (typeof keyDesc) {
    case "undefined": return _isKeyPressed;
    case "number": return _keyCodes[code];
    case "string": keys = keyDesc.split("+"); break;
    default: throw Error("The key `"+keyDesc+"` have to be undefined, a number or a string.");
  }
  key = keys.length == 1 ? keys[0] : keys[1];
  modif = keys.length == 1 ? null : keys[0];
  if(Object.keys(ALIAS).indexOf(key) !== -1)
    for (i in ALIAS[key]) {
      i = ALIAS[key][i];
      pressed = _keyCodes[i];
      if (pressed == true)
        break;
    }
  else
    pressed = _keyCodes[key.toUpperCase().charCodeAt(0)];

  if (pressed == true && modif !== null && MODIFIERS.indexOf(keys[0]) !== -1) {
    pressed = _modifiers[ modif ];
  }
  return pressed;
}

/**
 * This function allow you to add some aliases to specifiques keycodes
 *
 * @param {String} the alias key
 * @param {Integer} the alias keyCode, you can have multiple keycodes like so:
 * @example key.setAlias('top', 38, 65, 81);
*/
THREE.Input.setAlias = function (key) {
  if (arguments.length < 2)
    return console.error('setAlias need a key and some keyCode values.');
  ALIAS[key] = [];
  for (var i = 1 ; i < arguments.length ; ++i)
    ALIAS[key].push(arguments[i]);
}

/**
 * Return the keyCodes of the alias
 *
 * @param the alias key
 * @return the alias keyCodes
*/
THREE.Input.getAlias = function (key) {
  return ALIAS[key];
}

/**
 * Dump the aliases list
*/
THREE.Input.showAlias = function () {
  console.log(JSON.stringify(ALIAS));
}

/**
 * Return mouse X position on the screen.
 */
THREE.Input.getMouseX = function () {
  return _mouseX;
}

/**
 * Return mouse Y position on the screen.
 */
THREE.Input.getMouseY = function () {
  return _mouseY;
}

/**
 * Return current mouse button.
 */
THREE.Input.getMouseButton = function () {
  return _mouseButton;
}

/**
 * Return true if the mouse is pressed, false otherwise.
 */
THREE.Input.isMousePressed = function () {
  return _isMousePressed;
}

/**
 * Return true if the mouse has just been pressed.
 */
THREE.Input.isMouseDown = function () {
  if (THREE.Input.isMousePressed()) {
    if (_isMouseDown)
      return false;
    _isMouseDown = true;
    return true;
  }
  return false;
}

/**
 * Return true if the mouse has just been released.
 */
THREE.Input.isMouseUp = function () {
  if (!THREE.Input.isMousePressed()) {
    if (_isMouseUp) {
      _isMouseUp = false;
      return true;
    }
  }
  return false;
}

/**
 * TODO - Returns the value of the virtual axis
 * identified by `axisName`.
 */
THREE.Input.getAxis = function (axisName) {
  switch (axisName) {
    case "mouse x":
      // TODO
      return 0;
    case "mouse y":
      // TODO
      return 0;
    case "arrows x":
      // TODO
      return 0;
    case "arrows y":
      // TODO
      return 0;
  }
  return 0;
}

}();
