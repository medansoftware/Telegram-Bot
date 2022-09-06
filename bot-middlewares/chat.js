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
