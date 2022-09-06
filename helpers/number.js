/**
 * Random integer
 *
 * @param {integer} min
 * @param {integer} max
 * @returns Integer
 */
module.exports.random_integer = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
