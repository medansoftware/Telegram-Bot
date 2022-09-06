/**
 * /help command
 */
const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'bantuan', description: 'Bantuan', aliases: [] },
	{ code: 'en', command: 'help', description: 'Help', aliases: [] }
];

module.exports.run = (ctx, next) => {
	ctx.reply('HELP COMMAND');
}
