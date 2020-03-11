/* global window */
/* global navigator */

export default class ControlPad {
  constructor(onButtonPress) {
    this.buttonCache = {};
    this.onButtonPress = onButtonPress;
    this.eventListener = () => this._loop();
    console.log('constructor cp');
    window.addEventListener('gamepadconnected', this.eventListener);
  }

  // clean up the event listener and
  remove() {
    console.log('deconstructor cp');
    window.removeEventListener('gamepadconnected', this.eventListener);
    if (this.controlPadTimeout) {
      clearTimeout(this.controlPadTimeout);
    }
  }

  _loop() {
    // make sure there is only one loop being called
    if (this.controlPadTimeout) {
      clearTimeout(this.controlPadTimeout);
    }

    // need to retrieve every time for Chrome
    const gamepads = navigator.getGamepads();
    // assume there is only one gamepad hooked up
    if (gamepads && gamepads.length > 0 && gamepads[0] && gamepads[0].buttons) {
      gamepads[0].buttons.forEach((button, i) => {
        // if currently pressed and cache doesn't show that it was being pressed, fire event
        if (button.pressed && !this.buttonCache[i]) {
          // fires once per press
          this.onButtonPress(i);
        }
        this.buttonCache[i] = button.pressed;
      });
    }

    this.controlPadTimeout = setTimeout(() => this._loop(), 20);
  }
}
