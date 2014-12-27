function makeDrawable(obj) {
	if(obj.data && obj.width && obj.height) { // Quacks like an ImageData, so wrap it in a canvas
		var canvas = document.createElement("canvas");
		canvas.width = obj.width;
		canvas.height = obj.height;
		canvas.getContext("2d").putImageData(obj, 0, 0);
		return canvas;
	}
	if(obj.getContext) { // Quacks like a Canvas
		return obj;
	}
	if(/HTML(Image|Video|Canvas)Element/.test((""+obj))) { // Quacks like something drawable
		return obj;
	}
	throw new Error("Can't make a drawable out of " + obj);
}

module.exports = makeDrawable;
