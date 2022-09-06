# Telegram Bot Starter | Medan Software

## TelegrafJs References :

- [Telegraf.js Documentation](https://telegrafjs.org)
- [Telegraf.js API Documentation](https://telegraf.js.org)

## Bot Command

Create [bot command](https://core.telegram.org/bots/api#botcommand) inside directory [`bot-commands`](bot-commands/) within [command scope](https://core.telegram.org/bots/api#botcommandscope)

- [Chat Scope](https://core.telegram.org/bots/api#determining-list-of-commands)
- Language Code [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

### Examples of Bot Command

**/start**

file [bot-commands/start.js](bot-commands/start.js)

```javascript
module.exports.languages = [
	{ code: 'id', command: 'mulai', description: 'Mulai bot', aliases: [] },
	{ code: 'en', command: 'start', description: 'Start bot', aliases: [] }
];

module.exports.run = (ctx, next) => {
	ctx.reply('Hello let\'s start build now!');
}
```

## Bot Event Trigger

Create [Event Trigger](https://telegraf.js.org/classes/Telegraf.html#on) inside directory [`bot-triggers`](bot-triggers/)

## User Progress

### Create Progress by session

```javascript
ctx.session.has_progress = true;
ctx.session.progress = { type: 'command', name: 'start' }

await Helpers.bot.create_progress(ctx, {
	'all-steps': ['step1', 'step2', 'step3'],
	'current-step': 'step2',
	'data': { rand: Helpers.string.random(12) }
});
```

### Execute progress

```javascript
module.exports.execute = async function(ctx, next) {
	switch (ctx.progress.current_step) {
		case 'step2':
			ctx.reply('You have progress');
		break;

		default:
			return next();
		break;
	}
}
```
