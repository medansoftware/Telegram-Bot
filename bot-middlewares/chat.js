/**
 * Identify chat
 *
 * @param      {object}    ctx
 * @param      {function}  next
 */
module.exports.identify = async (ctx, next) => {
	// Chat objects
	var chat = ctx[ctx.updateType].chat;

	// Searching for identified chats in database
	Models['chat'].findOne({ where: { 'chat-id': chat.id } }).then((chat_available) => {
		// update chat status if bot left the chat
		var status = ((typeof ctx[ctx.updateType].left_chat_participant !== 'undefined' && ctx[ctx.updateType].left_chat_participant.id == ctx.botInfo.id) ? 'not-available' : 'available');
		if (chat_available == null) {
			Models['chat'].create({
				'chat-id': chat.id,
				'chat-type': chat.type,
				'chat-title': (chat.type == 'private') ? ((chat.last_name !== undefined) ? chat.first_name+' '+chat.last_name : chat.first_name) : chat.title,
				'language-code': (chat.type == 'private') ? (chat.language_code !== undefined) ? chat.language_code : 'en' : 'en',
				'status': status
			});
		} else {
			chat_available.update({ status: status });
		}
	}, (error) => SendLogErrors(__filename, "middleware error", error));

	if (typeof next == 'function') {
		return next();
	}
}

/**
 * Check state
 *
 * @param {double} chat
 * @param {double} from
 */
module.exports.state = async ({ chat, from }, ctx, next) => {
	var where = { 'chat-id': chat};

	if (from !== undefined) {
		where['user-id'] = from;
	}

	Models['user-state'].findOne({ where: where }).then((state) => {
		if (state !== null) {
			if (typeof ctx == 'object') {
				ctx.state = state;
			}
		}
	}, (error) => SendLogErrors(__filename, "middleware error", error));

	if (typeof next == 'function') {
		return next();
	}
}

module.exports.reply_type = async (ctx, next) => {

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
