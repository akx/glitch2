Glitch2
=======

More glitches than ever!

Pull requests for any purpose are more than welcome.

Building Glitcher
-----------------

Make sure you have Node.js and NPM properly installed, then just

```
npm i
npm build:ui
```

should get you a fresh `dist/index.html`.

If you're tweaking and experimenting, use the `dev` Npm task.

Building the standalone Libglitch2 library
------------------------------------------

```
npm build:lib
```

should get you `dist/libglitch`, which exposes `Glitch` as a global JS object.
