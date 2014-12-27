Glitch2
=======

More glitches than ever!

Pull requests for any purpose are more than welcome.

Building Glitcher
-----------------

Make sure you have Node.js and NPM properly installed, then just

```
npm i
node_modules/.bin/gulp app
# (or `gulp app` if you have gulp globally installed)
```

should get you a fresh `dist/glitcher.html`.

If you're tweaking and experimenting, use the `watchapp` Gulp task.

Building the standalone Libglitch2 library
------------------------------------------

This hasn't really been tested, but using the `lib` Gulp task should
get you `build/libglitch.js` which exposes `Glitch` as a global JS object.

Like with the Glitcher app itself, there's a watch task, `watchlib`.
