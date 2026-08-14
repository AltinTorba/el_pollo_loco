import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

// This project loads every class/function as a plain <script> in index.html
// (no ES modules/bundler), so classes/functions defined in one file are
// used as globals in others. This means:
//  - no-redeclare must ignore collisions with predefined browser globals
//    (e.g. our `Keyboard` class vs. the native Keyboard API), since that's
//    an expected, harmless naming choice in this architecture.
//  - no-unused-vars must only check LOCAL usage ("vars: local"), since a
//    class/function that looks "unused" in its own file is normally used
//    from a different <script> file - flagging every top-level declaration
//    as unused would be 100% false positives here.
const projectGlobals = {
  World: "writable",
  Level: "writable",
  Keyboard: "writable",
  DrawableObject: "writable",
  MovableObject: "writable",
  Character: "writable",
  Chicken: "writable",
  Chick: "writable",
  Endboss: "writable",
  Cloud: "writable",
  bgObject: "writable",
  Coin: "writable",
  Bottle: "writable",
  ThrowableObject: "writable",
  StatusBar: "writable",
  SoundManager: "writable",
  soundManager: "writable",
  level1: "writable",
  initLevel: "writable",
  aboutHTML: "writable",
  infoHTML: "writable",
  controlsHTML: "writable",
  world: "writable",
  canvas: "writable",
  keyboard: "writable",
  openOverlay: "writable",
  closeOverlay: "writable",
  startGame: "writable",
  restartGame: "writable",
  backToMenu: "writable",
  toggleMuteUI: "writable",
  toggleFullScreen: "writable",
};

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...projectGlobals },
    },
    rules: {
      "no-redeclare": ["error", { builtinGlobals: false }],
      "no-unused-vars": ["error", { vars: "local" }],
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
]);
