THREE.GUI
=========

Simple 3D GUI for threejs, take a look at the [demo](http://jeremt.github.io/THREE.GUI/).

TODO
----

- (create) GUI.CircularList: like vertical list be move arround a centered axis.
- (create) GUI.ParagraphGeometry: simple multiline text (just specify height and width).
- (update) GUI.TextInput: change geometry generation to not exceed the area.
- (update) GUI.TextInput: add placeholder.
- (update) GUI.TextInput: add word suppresion.
- (update) GUI.TextInput: add cursor.
- (update) GUI.TextInput: add label.
- (create) GUI.Grid: used to create simple grid layout to place items
- (create) GUI.Block: Simple text block.
- (create) GUI.ScrollableBlock: Simple text block with scrollbar if too much text.

THREE.GUI.Button
----------------

`GUI.Button` is a 3D button object.

### Events

- __click__ - triggered when the mouse click on the button.
- __hover__ - triggered when the mouse hovered the button.
- __unhover__ - triggered when the mouse unhovered the button.
- __focus__ - triggered when the button is focused.

THREE.GUI.TextInput
-------------------

`GUI.TextInput` is a special button which allow to type some text like `<input type="text">` html balise.

### Events

- __change__ - triggered when type something.
- __submit__ - triggered when validate selection (pressed enter key).
- __hover__ - triggered when the mouse hovered the button.
- __unhover__ - triggered when the mouse unhovered the button.
- __focus__ - triggered when the button is focused.
- __unfocus__ - triggered when the button isnt focused anymore.

THREE.GUI.VerticalList
----------------------

`GUI.List` generate a vertical list of gui objects automaticaly resized when you add new objects into.

### Events

- __submit__ - triggered when user validate selection.
- __change__ - triggered when user change selection.
