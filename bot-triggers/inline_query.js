/**
 * Inline query
 */
const { Markup } = require('telegraf');

module.exports = async (ctx, next) => {
	console.log(__filename, ctx.inlineQuery); // debug
}
