function createTVDisplacementMap(width, height) {
	var canvas, context, context, data, y, x, ix, iy, cdis, an, xd, yd, offset;
	width == null && (width = 256);
	height == null && (height = 224);
	canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext("2d");
	context.fillStyle = "black";
	context.fillRect(0, 0, width, height);
	data = context.getImageData(0, 0, width, height);
	for (y = 0; y < height; ++y) {
		for (x = 0; x < width; ++x) {
			ix = (x / width - 0.5) * 2;
			iy = (y / height - 0.5) * 2;
			cdis = 1.0 - (ix * ix + iy * iy);
			cdis = Math.cos(cdis * 3.141 / 2.0);
			an = Math.atan2(iy, ix);
			xd = -Math.cos(an) * 125 * cdis;
			yd = -Math.sin(an) * 125 * cdis;
			offset = y * width * 4 + x * 4;
			data.data[offset] = 127 + xd;
			data.data[offset + 1] = 127 + yd;
			data.data[offset + 2] = 127;
		}
	}
	context.putImageData(data, 0, 0);
	return canvas;
}

module.exports = createTVDisplacementMap;
