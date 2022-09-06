/**
 * /user_guide command
 */
const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'panduan_pengguna', description: 'Panduan pengguna', aliases: ['panduan'] },
	{ code: 'en', command: 'user_guide', description: 'User guide', aliases: ['guide'] }
];

module.exports.run = (ctx, next) => {
	ctx.reply('USER GUIDE COMMAND');
}
