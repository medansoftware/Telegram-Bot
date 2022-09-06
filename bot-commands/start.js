/**
 * /start command
 */
const { Markup } = require('telegraf');

i18next.init({
	lng: 'en',
	resources: {
		id: {
			translation: {
				"start": "Start bot",
				"reply": "Halo <b>{{ from.first_name ~' '~ from.last_name }}</b>",
				"inline_buttons": {
					"notes": "Catatan",
					"contacts": "Kontak",
					"reminders": "Pengingat",
					"new_post": "Postingan Baru"
				}
			}
		},
		en: {
			translation: {
				"start": "Mulai bot",
				"reply": "Hello <b>{{ from.first_name ~' '~ from.last_name }}</b>",
				"inline_buttons": {
					"notes": "Notes",
					"contacts": "Contacts",
					"reminders": "Reminders",
					"new_post": "New Post"
				}
			}
		}
	}
});

module.exports.languages = [
	{ code: 'id', command: 'mulai', description: i18next.t('start'), aliases: [] },
	{ code: 'en', command: 'start', description: i18next.t('start'), aliases: [] }
];

module.exports.run = async (ctx, next) => {
	ctx.session.has_progress = false;
	ctx.session.progress = {}

	// Middleware identify chat
	BotMiddlewares.chat.identify(ctx);

	if (ctx[ctx.updateType].from) {
		i18next.changeLanguage(ctx[ctx.updateType].from.language_code);
	}

	Helpers.string.twig_render(i18next.t('reply'), ctx[ctx.updateType]).then((compiled_string) => {
		ctx.reply(compiled_string, Object.assign({
			parse_mode: 'HTML',
		}, Markup.inlineKeyboard(
			[
				[
					Markup.button.callback(i18next.t('inline_buttons.notes'), 'notes')
				],
				[
					Markup.button.callback(i18next.t('inline_buttons.contacts'), 'contacts')
				],
				[
					Markup.button.callback(i18next.t('inline_buttons.reminders'), 'reminders')
				],
				[
					Markup.button.callback(i18next.t('inline_buttons.new_post'), 'new-post')
				]
			]
		)));
	}, (error) => SendLogErrors(__filename, "twing error render", error));
}
