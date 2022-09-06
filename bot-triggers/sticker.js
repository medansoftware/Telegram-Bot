/**
 * Sticker
 */
const { Markup } = require('telegraf');

module.exports = async (ctx, next) => {
	Helpers.string.twig_render("TRIGGER STICKER EVENT {{ from.first_name ~' '~ from.last_name }}", ctx[ctx.updateType]).then((compiled_string) => {
		ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string);
	}, (error) => SendLogErrors(__filename, "twing error render", error));

	console.log(__filename, ctx[ctx.updateType]); // debug
}
