/**
 * Array object find value
 *
 * @param      {array}    array   Array
 * @param      {string}   key     Search key
 * @param      {string}   val     Search value
 * @return     {boolean}  Return false if not found
 */
module.exports.find_object_value = (array, key, val) => {
	let find = array.findIndex(i => i[key] == val);
	return (find !== -1) ? find : false;
}

/**
 * Foreach array object
 *
 * @param {object} obj
 * @param {string} iterator
 */
module.exports.foreach = (obj, iterator) => {
	if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
		obj.forEach(iterator)
	} else if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			iterator(obj[i], i, obj)
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				iterator(obj[key], key, obj)
			}
		}
	}
}

/**
 * Array shuffle
 *
 * @param {array} array
 * @returns Array
 */
module.exports.shuffle = function(array) {
	var j, x, i;
	for (i = array.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = array[i];
		array[i] = array[j];
		array[j] = x;
	}

	return array;
}

/**
 * Array random
 *
 * @param {array} array
 * @returns Mixed
 */
module.exports.random = function(array) {
	var random = Math.floor(Math.random() * array.length);
	return array[random];
}

/**
 * Chunks array
 *
 * @param {array} array
 * @param {integer} chunk_size
 * @returns Array
 */
module.exports.chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));
