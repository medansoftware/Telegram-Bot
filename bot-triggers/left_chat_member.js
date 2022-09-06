/**
 * Left chat member
 */
const { Markup } = require('telegraf');

module.exports = async (ctx, next) => {
	// Set variable alias
	ctx[ctx.updateType].user = ctx[ctx.updateType].left_chat_participant;
	ctx[ctx.updateType].participant = ctx[ctx.updateType].left_chat_participant;

	if (ctx[ctx.updateType].left_chat_participant.id !== ctx.botInfo.id) {
		Helpers.string.twig_render("TRIGGER LEAVES CHAT MEMBER EVENT {{ user.first_name ~' '~ user.last_name }}", ctx[ctx.updateType]).then((compiled_string) => {
			ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string);
		}, (error) => SendLogErrors(__filename, "twing error render", error));
	} else {
		// Middleware identify chat
		BotMiddlewares.chat.identify(ctx, next);
	}

	console.log(__filename, ctx[ctx.updateType]); // debug
}
