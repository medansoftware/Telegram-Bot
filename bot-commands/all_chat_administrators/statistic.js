/**
 * /statistic command
 */
 const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'statistik', description: 'Statistik', aliases: [] },
	{ code: 'en', command: 'statistic', description: 'Statistic', aliases: [] }
];

module.exports.run = (ctx, next) => {
	ctx.reply('STATISTIC COMMAND');
}
