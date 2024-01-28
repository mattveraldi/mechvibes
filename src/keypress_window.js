const $ = require('./assets/jquery');
const iohook = require("iohook");
const log = require("electron-log");
const keycodes = require("./libs/keycodes");

(function(document) {
  $(document).ready(() => {
    const os_keycodes = keycodes[process.platform]
    os_keycodes[57] = "⎵"; // Replace Space with ⎵ for better UX
    os_keycodes[42] = "⇧"; // Replace Shift with ⇧ for better UX
    os_keycodes[54] = "⇧"; // Replace Shift with ⇧ for better UX
    iohook.start();
    log.info("Keypress panel was loaded");
    let keypress_panel = document.getElementById("keypress_panel");
    // store pressed state of multiple keys
    let pressed_keys = {};

    // if key released, clear current key
    iohook.on('keyup', ({ keycode }) => {
      // current_key_down = null;
      pressed_keys[`${keycode}`] = false;
      for (const key in pressed_keys) {
        if(pressed_keys[key]){
          holding = true;
        }
      }
    });

    let debouncer = null;
    iohook.on('keydown', ({ keycode }) => {
      // deactivate the clear function if the user is still typing
      if(debouncer !== null) {
        clearTimeout(debouncer);
      }
      // if hold down a key, don't repeat the sound
      if(pressed_keys[`${keycode}`] !== undefined && pressed_keys[`${keycode}`]){
        return;
      }
      pressed_keys[`${keycode}`] = true;

      // pack current pressed key
      current_key_down = keycode;

      const next_keys = keypress_panel.innerHTML + os_keycodes[current_key_down];
      keypress_panel.innerHTML = next_keys;

      // clear keys history if the user is not typing anymore.
      debouncer = setTimeout(() => {
        keypress_panel.innerHTML = "";
      }, 2000);
    });
  })
})(document)
