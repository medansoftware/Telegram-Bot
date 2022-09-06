/**
 * Callback query
 */
const { Markup } = require('telegraf');

i18next.init({
	lng: 'en',
	resources: {
		id: {
			translation: {}
		},
		en: {
			translation: {}
		}
	}
});

module.exports = async (ctx, next) => {
	switch (ctx.callbackQuery.data) {
		case 'notes':
			ctx.telegram.answerCbQuery(ctx.callbackQuery.id, 'Loaded notes', true);
			Helpers.string.twig_render("TRIGGER CALLBACK QUERY EVENT {{ from.first_name ~' '~ from.last_name }}", ctx.callbackQuery).then((compiled_string) => {
				ctx.telegram.sendMessage(ctx.callbackQuery.message.chat.id, compiled_string);
			}, (error) => SendLogErrors(__filename, "twing error render", error));
		break;

		case 'contacts':
		break;

		case 'reminders':
		break;

		case 'new_post':
		break;

		default:
		break;
	}

	console.log(__filename, ctx.callbackQuery) // debug
}
