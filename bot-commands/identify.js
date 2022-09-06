/**
 * /identify command
 */
const { Markup } = require('telegraf');

module.exports.languages = [
	{ code: 'id', command: 'identifikasi', description: 'Identifikasi', aliases: [] },
	{ code: 'en', command: 'identify', description: 'Identify', aliases: [] }
];

module.exports.run = (ctx, next) => {
	ctx.session.has_progress = false;
	ctx.session.progress = {}

	var html = "";
	html += "<b>MessageID</b> : <code>{{ message_id }}</code>\n";
	html += "<b>Chat</b> : <code>{{ chat.id }}</code> | {{ chat.first_name ~' '~ chat.last_name }}\n\n";
	html += "<b>From</b> : <code>{{ from.id }}</code> | {{ from.first_name ~' '~ from.last_name }}\n";
	html += "<b>Data</b> : \n<code>"+JSON.stringify(ctx[ctx.updateType], null, '\t')+"</code>";

	Helpers.string.twig_render(html, ctx[ctx.updateType]).then((compiled_string) => {
		ctx.telegram.sendMessage(ctx.message.chat.id, compiled_string, {
			parse_mode: 'HTML'
		});
	}, (error) => SendLogErrors(__filename, "twing error render", error));
}
