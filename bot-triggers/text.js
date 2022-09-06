/**
 * Text
 */
const { Markup } = require('telegraf');

module.exports = async (ctx, next) => {
	if (ctx[ctx.updateType].text == 'Single Button') {
		ctx.telegram.sendMessage(ctx.message.chat.id, 'Received', Markup.removeKeyboard()).then((response) => {
			ctx.telegram.deleteMessage(response.chat.id, response.message_id);
		});
	}

	if (ctx[ctx.updateType].from.is_bot === true) {
		if (ctx[ctx.updateType].sender_chat.type == 'channel') {
			Helpers.string.twig_render("TRIGGER TEXT EVENT {{ sender_chat.title }}", ctx[ctx.updateType]).then((compiled_string) => {
				ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string);
			}, (error) => SendLogErrors(__filename, "twing error render", error));
		}
	} else {
		Helpers.string.twig_render("TRIGGER TEXT EVENT {{ from.first_name ~' '~ from.last_name }}", ctx[ctx.updateType]).then((compiled_string) => {
			ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string);
		}, (error) => SendLogErrors(__filename, "twing error render", error));
	}

	console.log(__filename, ctx[ctx.updateType]); // debug

	if (typeof next == 'function') {
		return next();
	}
}
