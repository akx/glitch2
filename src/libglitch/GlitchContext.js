function GlitchContext(canvas) {
	this._canvas = canvas;
	this._context = canvas.getContext("2d");
	this._imageData = null;
	this.clock = +new Date();
}

GlitchContext.prototype.getImageData = function() {
	if(this._imageData) return this._imageData;
	return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

GlitchContext.prototype.copyImageData = function() {
	this._commitImageData();
	return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
};

GlitchContext.prototype.setImageData = function(newImageData) {
	if(this._imageData === newImageData) return;
	this._commitImageData();
	this._imageData = newImageData;
};

GlitchContext.prototype._commitImageData = function() {
	if(this._imageData) {
		this._context.putImageData(this._imageData, 0, 0);
		this._imageData = null;
	}
};

GlitchContext.prototype.getContext = function() {
	this._commitImageData();
	return this._context;
};

GlitchContext.prototype.finalize = function() {
	this._commitImageData();
};


module.exports = GlitchContext;
