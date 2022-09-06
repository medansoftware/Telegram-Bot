/**
 * Sleep
 *
 * @param {integer} miliseconds
 * @returns Promise
 */
module.exports.sleep = function(miliseconds) {
	return new Promise(resolve => setTimeout(resolve, miliseconds));
}

/**
 * Format date
 *
 * @param {integer} date
 * @param {string} month
 * @param {integer} year
 * @param {integer} hours
 * @param {integer} minutes
 * @param {integer} second
 * @returns Date
 */
module.exports.format = (date, month, year, hours, minutes, second) => {
	var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	if (months.indexOf(month.toLowerCase()) !== -1) {
		return new Date(year, months.indexOf(month.toLowerCase()), date, hours, minutes, second);
	}
}
