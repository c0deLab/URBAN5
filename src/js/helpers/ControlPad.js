/* global window */
/* global navigator */

export default class ControlPad {
  constructor() {
    this.controlPadButtonPressMap = {};
  }

  init(onButtonPress) {
    this.onButtonPress = onButtonPress;
    this.eventListener = e => this._addControlPad(e);
    window.addEventListener('gamepadconnected', this.eventListener);
  }

  remove() {
    window.removeEventListener('gamepadconnected', this.eventListener);
    if (this.controlPadTimeout) {
      clearTimeout(this.controlPadTimeout);
    }
  }

  _addControlPad(e) {
    this._inputLoop();
  }

  _inputLoop() {
    const gamepads = navigator.getGamepads(); // need to retrieve every time for Chrome
    if (gamepads && gamepads.length > 0 && gamepads[0].buttons) {
      const controlPad = gamepads[0];
      for (let i = 0; i < controlPad.buttons.length; i += 1) {
        const isPressed = controlPad.buttons[i].pressed;
        if (isPressed && !this.controlPadButtonPressMap[i]) {
          // button down (fires once per press)
          this.onButtonPress(i);
        }
        this.controlPadButtonPressMap[i] = isPressed;
      }
    }

    this.controlPadTimeout = setTimeout(() => this._inputLoop(), 20);
  }
}
