function colorTransformImageData(imageData, matrix) {
  let r;
  let g;
  let b;
  const { data } = imageData;
  const rPre = matrix[0];
  const rPost = matrix[1];
  const r0 = matrix[2];
  const r1 = matrix[3];
  const r2 = matrix[4];
  const gPre = matrix[5];
  const gPost = matrix[6];
  const g0 = matrix[7];
  const g1 = matrix[8];
  const g2 = matrix[9];
  const bPre = matrix[10];
  const bPost = matrix[11];
  const b0 = matrix[12];
  const b1 = matrix[13];
  const b2 = matrix[14];
  const to$ = data.length;
  for (let offset = 0; offset < to$; offset += 4) {
    r = data[offset] + rPre;
    g = data[offset + 1] + gPre;
    b = data[offset + 2] + bPre;
    data[offset] = r0 * r + r1 * g + r2 * b + rPost;
    data[offset + 1] = g0 * r + g1 * g + g2 * b + gPost;
    data[offset + 2] = b0 * r + b1 * g + b2 * b + bPost;
  }
}

export default colorTransformImageData;
