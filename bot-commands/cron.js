/**
 * /cron command
 */
const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'kron', description: 'Kronjob', aliases: [] },
	{ code: 'en', command: 'cron', description: 'Cron', aliases: [] }
];

module.exports.run = (ctx, next) => {
	// every seconds
	Cron.schedule('* * * * * *', () => {
		ctx.reply('CRON COMMAND');
	});
}
