/**
 * Chosen inline result
 */
const { Markup } = require('telegraf');

module.exports = async (ctx, next) => {
	console.log(__filename, ctx.chosenInlineResult); // debug
}
