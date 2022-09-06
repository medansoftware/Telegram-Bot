/**
 * New chat member
 */
const { Markup } = require('telegraf');

module.exports = async (ctx, next) => {
	// Middleware identify chat
	BotMiddlewares.chat.identify(ctx, next);

	// Set variable alias
	ctx[ctx.updateType].user = ctx[ctx.updateType].new_chat_participant;
	ctx[ctx.updateType].participant = ctx[ctx.updateType].new_chat_participant;

	if (ctx[ctx.updateType].new_chat_participant.id !== ctx.botInfo.id) {
		Helpers.string.twig_render("TRIGGER NEW CHAT MEMBER EVENT {{ user.first_name ~' '~ user.last_name }}", ctx[ctx.updateType]).then((compiled_string) => {
		ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string);
	}, (error) => SendLogErrors(__filename, "twing error render", error));
	} else {
		Helpers.string.twig_render("TRIGGER NEW CHAT MEMBER EVENT (BOT JOINED) {{ user.first_name ~' '~ user.last_name }}", ctx[ctx.updateType]).then((compiled_string) => {
			ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string);
		}, (error) => SendLogErrors(__filename, "twing error render", error));
	}

	console.log(__filename, ctx[ctx.updateType]); // debug
}
