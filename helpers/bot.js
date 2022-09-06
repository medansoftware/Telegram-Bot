/**
 * Create progress
 *
 * @param {object} ctx
 * @param {object} progress
 * @param {boolean} update
 * @returns Promise
 */
module.exports.create_progress = async (ctx, progress, update = true) => {
	var has_progress = await Models['user-progress'].findOne({
		where: { 'session-key': BotLocalSession.getSessionKey(ctx) }
	});

	if (has_progress == null) {
		progress = await Models['user-progress'].create({
			'session-key': BotLocalSession.getSessionKey(ctx),
			'all-steps': (progress['all-steps'] !== undefined) ? JSON.stringify(progress['all-steps']) : null,
			'current-step': progress['current-step'],
			'data': (progress['data'] !== undefined) ? JSON.stringify(progress['data']) : null
		});
	} else {
		if (update) {
			progress = await has_progress.update({
				'current-step': progress['current-step'],
				'data': (progress['data'] !== undefined) ? JSON.stringify(progress['data']) : null
			});
		} else {
			progress = has_progress;
		}
	}

	progress = progress.toJSON();

	progress['all-steps'] = (typeof progress['all-steps'] == 'string') ? JSON.parse(progress['all-steps']) : progress['all-steps'];
	progress['data'] = (typeof progress['data'] == 'string') ? JSON.parse(progress['data']) : progress['data'];

	return progress;
}

/**
 * Remove progress
 *
 * @param {object} ctx
 * @param {function} next
 * @returns Promise
 */
module.exports.remove_progress = async (ctx, next) => {
	ctx.session.has_progress = false;
	var progress = await Models['user-progress'].findOne({
		where: { 'session-key': BotLocalSession.getSessionKey(ctx) }
	});

	if (progress !== null) {
		progress.delete();
	}

	return (typeof next === 'function' ? next() : null);
}
