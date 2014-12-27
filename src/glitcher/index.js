var UI = require("./ui");
var Engine = require("./engine");
var engine = null;

function init() {
	var targetCanvas = document.createElement("canvas");
	targetCanvas.width = 32;
	targetCanvas.height = 32;
	targetCanvas.id = "target";
	document.body.appendChild(targetCanvas);

	var sourceImage = new Image();
	sourceImage.src = require("./lenna");

	engine = new Engine(targetCanvas);
	engine.state.loadFromLocalStorage();
	engine.sourceImage = sourceImage;
	UI.init(engine);
	engine.renderLoop();
}

if(typeof window !== "undefined") {
	window.addEventListener("load", init, false);
} else {
	throw new Error("Glitcher requires a browser-like environment.");
}
