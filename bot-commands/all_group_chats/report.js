/**
 * /report command
 */
 const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'lapor', description: 'Laporkan', aliases: [] },
	{ code: 'en', command: 'report', description: 'Report', aliases: [] }
];

module.exports.run = (ctx, next) => {
	ctx.reply('REPORT COMMAND');
}
