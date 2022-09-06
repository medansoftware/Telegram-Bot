/**
 * Is valid JSON
 *
 * @param {string|object} string_or_object
 * @returns Boolean
 */
module.exports.is_valid_json = function(string_or_object) {
	if (typeof string_or_object == 'object') {
		return true;
	} else {
		try {
			var o = JSON.parse(string_or_object);
			if (o && typeof o === "object") {
				return o;
			}
		} catch (e) {
			return false;
		}
	}
};

/**
 * Is valid UTF-8
 *
 * @param {string} text
 * @returns Boolean
 */
module.exports.is_valid_utf8 = function(text) {
	try {
		decodeURIComponent(escape(text));
		return true;
	} catch(e) {
		return false;
	}
}
