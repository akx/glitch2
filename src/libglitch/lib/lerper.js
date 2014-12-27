var lerperCache = {
	_a: function (a, b) {
		return a;
	},
	_b: function (a, b) {
		return b;
	}
};

function lerper(alpha) {
	var key, cached, beta;
	if (alpha <= 0) {
		return lerperCache._a;
	}
	if (alpha >= 1) {
		return lerperCache._b;
	}
	key = 0 | alpha * 100;
	if (cached = lerperCache[key]) return cached;
	beta = 1 - alpha;
	return lerperCache[key] = new Function("a", "b", "return b * " + alpha + " + a * " + beta);
}
module.exports = lerper;
