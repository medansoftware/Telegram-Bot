/**
 * /train command
 */
const { Markup } = require('telegraf');

i18next.init({
	lng: 'en',
	resources: {
		id: {
			translation: {
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
	{ code: 'id', command: 'ajarkan_bot', description: 'Ajarkan bot', aliases: ['belajar'] },
	{ code: 'en', command: 'train_bot', description: 'Train bot', aliases: ['train', 'learn'] }
];

module.exports.run = async (ctx, next) => {

	var type = true;
	var is_reply = false

	if (ctx[ctx.updateType].reply_to_message !== undefined) {
		is_reply = true;
		if (ctx[ctx.updateType].reply_to_message.text !== undefined) {
			type = 'text';
		} else if (ctx[ctx.updateType].reply_to_message.animation !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.audio !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.document !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.photo !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.sticker !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.video_note !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.voice !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.contact !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.dice !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.game !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.poll !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.venue !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.location !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.video_chat_started !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.video_chat_ended !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.video_chat_participants_invited !== undefined) {
		} else if (ctx[ctx.updateType].reply_to_message.reply_markup !== undefined) {}
		else {
			type = false;
		}
	} else {
		if (ctx[ctx.updateType].text !== undefined) {
			type = 'text';
		} else if (ctx[ctx.updateType].animation !== undefined) {
		} else if (ctx[ctx.updateType].audio !== undefined) {
		} else if (ctx[ctx.updateType].document !== undefined) {
		} else if (ctx[ctx.updateType].photo !== undefined) {
		} else if (ctx[ctx.updateType].sticker !== undefined) {
		} else if (ctx[ctx.updateType].video_note !== undefined) {
		} else if (ctx[ctx.updateType].voice !== undefined) {
		} else if (ctx[ctx.updateType].contact !== undefined) {
		} else if (ctx[ctx.updateType].dice !== undefined) {
		} else if (ctx[ctx.updateType].game !== undefined) {
		} else if (ctx[ctx.updateType].poll !== undefined) {
		} else if (ctx[ctx.updateType].venue !== undefined) {
		} else if (ctx[ctx.updateType].location !== undefined) {
		} else if (ctx[ctx.updateType].video_chat_started !== undefined) {
		} else if (ctx[ctx.updateType].video_chat_ended !== undefined) {
		} else if (ctx[ctx.updateType].video_chat_participants_invited !== undefined) {
		} else if (ctx[ctx.updateType].reply_markup !== undefined) {}
		else {
			type = false;
		}
	}

	switch (type) {
		case true :
			ctx.reply('Not understand');
		break;

		case false :
			ctx.reply('UNKNOW');
		break;

		case 'text' :
			if (is_reply) {
				ctx.reply('Langguage?');
			} else {
				ctx.session.has_progress = true;
				ctx.session.progress = { type: 'command', name: 'train' }

				await Helpers.bot.create_progress(ctx, {
					'all-steps': ['define-language', 'define-data'],
					'current-step': 'define-language',
					'data': { rand: Helpers.string.random(12) }
				});
				ctx.reply('Send me something');
			}
		break;

		default:
			if (is_reply) {
				ctx.reply('Langguage?');
			} else {
				ctx.reply('Send me something');
			}
		break;
	}
}

module.exports.execute = (ctx, next) => {
	console.log('execyute');
}


