/**
 * /cron command
 */
const { Markup } = require('telegraf');
const cron = require('node-cron');

module.exports.languages = [
	{ code: 'id', command: 'kron', description: 'Kronjob', aliases: [] },
	{ code: 'en', command: 'cron', description: 'Cron', aliases: [] }
];

module.exports.run = (ctx, next) => {
	// every seconds
	cron.schedule('* * * * * *', () => {
		ctx.reply('CRON COMMAND');
	});
}
