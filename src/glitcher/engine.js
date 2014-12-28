var Glitch = require("../libglitch");
var State = require("./state");

var Engine = function(targetCanvas) {
	this.rate = 40;
	this.state = new State(Glitch.modules);
	this.sourceImage = null;
	this.targetCanvas = targetCanvas;
	this.glitchContext = new Glitch.Context(targetCanvas);
	this.renderTime = 0;
};


Engine.prototype.renderFrame = function() {
	var sourceImage = this.sourceImage;
	var targetCanvas = this.targetCanvas;
	var glitchContext = this.glitchContext;
	if(!sourceImage.complete) return;
	var t0 = +new Date();
	targetCanvas.width = 0 | sourceImage.width;
	targetCanvas.height = 0 | sourceImage.height;
	glitchContext.clock = +new Date();
	glitchContext.getContext().drawImage(sourceImage, 0, 0);
	var state = this.state;
	if(state) {
		state.defs.forEach(function (def) {
			if (!def.enabled) return;
			if (def.probability <= 0) return;
			if (def.probability < Math.random()) return;
			var t0 = +new Date();
			def.module(glitchContext, def.options);
			var t1 = +new Date();
			def.renderTime = (t1 - t0);
		});
	}
	glitchContext.finalize();
	var t1 = +new Date();
	this.renderTime = (t1 - t0);
};

Engine.prototype.renderLoop = function() {
	try {
		if(this.rate > 0) this.renderFrame();
	} finally {
		var self = this;
		setTimeout(function(){self.renderLoop();}, Math.max(2, 4000 / this.rate));
	}
};

Engine.prototype.toDataURL = function() {
	return this.targetCanvas.toDataURL();
};

module.exports = Engine;
