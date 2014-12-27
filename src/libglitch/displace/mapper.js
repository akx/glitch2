var makeDrawable = require("../lib/makeDrawable");
var clamp = require("../lib/num").clamp;

function displacementMapper(imageData, displacementMap, scaleX, scaleY) {
	if (scaleX == 0 && scaleY == 0) return;
	var width = imageData.width;
	var height = imageData.height;
	// Rescale displacement map
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = width;
	tempCanvas.height = height;
	var tempContext = tempCanvas.getContext("2d");
	tempContext.drawImage(makeDrawable(displacementMap), 0, 0, width, height);
	var displacementData = tempContext.getImageData(0, 0, width, height).data;
	var sourceBuf = imageData.data;
	var destBuf = new Uint8ClampedArray(sourceBuf);
	for (var y = 0; y < height; ++y) {
		var yoff = y * width * 4;
		for (var x = 0; x < width; ++x) {
			var offset = yoff + x * 4;
			var disZ = displacementData[offset + 2] / 127.0;
			var disX = (displacementData[offset] - 127) / 128.0 * scaleX * disZ;
			var disY = (displacementData[offset + 1] - 127) / 128.0 * scaleY * disZ;
			var sourceX = 0 | Math.round(x + disX);
			var sourceY = 0 | Math.round(y + disY);
			var sourceOffset = clamp(sourceY, height) * width * 4 + clamp(sourceX, width) * 4;
			destBuf[offset++] = sourceBuf[sourceOffset++];
			destBuf[offset++] = sourceBuf[sourceOffset++];
			destBuf[offset++] = sourceBuf[sourceOffset++];
		}
	}
	imageData.data.set(destBuf);
	return imageData;
}

module.exports = displacementMapper;
