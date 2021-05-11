# Glitch2

More glitches than ever!

Pull requests for any purpose are more than welcome.

## Development

Make sure you have Node.js and Yarn (1.x) properly installed, then install dependencies with

```
yarn
```

You can then use

```
yarn dev
```

to start up the development server.



### Building the Glitcher UI

```
yarn build:ui
```

should get you a fresh `dist/index.html`.

### Building the standalone Libglitch2 library

**NOTE:** The standalone library is not necessarily maintained, but the option to build it still remains.

```
yarn build:lib
```

should get you `dist/libglitch`, which exposes `Glitch` as a global JS object.

## Deployment

GitHub Actions automatically builds and deploys the `master` branch to https://akx.github.io/glitch2/ .