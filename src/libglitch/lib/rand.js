function randint(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function birandint(min, max) {
  const sign = (Math.random() <= 0.5 ? -1 : +1);
  return randint(min, max) * sign;
}

function rand(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

module.exports = {
  randint,
  birandint,
  rand,
};
