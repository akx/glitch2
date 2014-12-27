function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function birandint(min, max) {
	var sign = (Math.random() <= 0.5 ? -1 : +1);
	return randint(min, max) * sign;
}

function rand(min, max) {
	min == null && (min = 0);
	max == null && (max = 1);
	return Math.random() * (max - min) + min;
}

module.exports = {
	randint: randint,
	birandint: birandint,
	rand: rand,
};
