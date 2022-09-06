const { TwingEnvironment, TwingLoaderArray } = require('twing');

/**
 * Random string
 *
 * @param {integer} length
 * @returns Integer
 */
module.exports.random = (length) => {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
	if (!length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}

	return str;
}

/**
 * Convert string to boolean
 *
 * @param {string} string
 * @returns Boolean
 */
module.exports.to_boolean = (string) => {
	switch (string.toString().toLowerCase().trim()) {
		case "true":
		case "yes":
		case "1":
		return true;

		case "false":
		case "no":
		case "0":
		case null:
		return false;

		default: return Boolean(string);
	}
}

/**
 * Twing render string
 *
 * @param {string} text
 * @param {object} data
 * @returns String
 */
module.exports.twig_render = (text, data) => {
	var twing = new TwingEnvironment(new TwingLoaderArray({ 'text': text }));
	return twing.render('text', data);
}
