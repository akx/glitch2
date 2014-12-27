function colorTransformImageData(imageData, matrix) {
	var data, offset, rPre, rPost, r0, r1, r2, gPre, gPost, g0, g1, g2, bPre, bPost, b0, b1, b2, to$, r, g, b;
	data = imageData.data;
	rPre = matrix[0]; rPost = matrix[1]; r0 = matrix[2]; r1 = matrix[3]; r2 = matrix[4];
	gPre = matrix[5]; gPost = matrix[6]; g0 = matrix[7]; g1 = matrix[8]; g2 = matrix[9];
	bPre = matrix[10]; bPost = matrix[11]; b0 = matrix[12]; b1 = matrix[13]; b2 = matrix[14];
	for (offset = 0, to$ = data.length; offset < to$; offset += 4) {
		r = data[offset] + rPre;
		g = data[offset + 1] + gPre;
		b = data[offset + 2] + bPre;
		data[offset] = (r0 * r + r1 * g + r2 * b) + rPost;
		data[offset + 1] = (g0 * r + g1 * g + g2 * b) + gPost;
		data[offset + 2] = (b0 * r + b1 * g + b2 * b) + bPost;
	}
}
module.exports = colorTransformImageData;
