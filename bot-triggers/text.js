/**
 * Text
 */
const { Markup, Composer } = require('telegraf');

module.exports = async (ctx, next) => {
	var replied_message = ctx[ctx.updateType].reply_to_message;
	if (ctx.has_progress) {
		// has progress
		if (replied_message !== undefined) {
			console.log(ctx.state);
		} else {
		}
	} else {
		// no progress
		if (replied_message !== undefined) {
		} else {
		}
	}

	console.log(__filename, ctx[ctx.updateType]); // debug

	if (typeof next == 'function') {
		return next();
	}
}
