/**
 * /save command
 */
 const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'simpan', description: 'Simpan', aliases: [] },
	{ code: 'en', command: 'save', description: 'Save', aliases: [] }
];

module.exports.run = (ctx, next) => {
	ctx.reply('SAVE COMMAND');
}
