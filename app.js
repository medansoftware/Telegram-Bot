require('dotenv').config(); // get .env config
console.clear(); // clear console

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const async = require('async');
const cookie_parser  = require('cookie-parser');
const express_session = require('express-session');
const app_session = express_session({
	secret: process.env.ENCRYPTION_KEY,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false, maxAge: Date.now() + (30 * 86400 * 1000) }
});
const request_ip = require('request-ip');
const http_errors = require('http-errors');
const cors = require('cors');
const compression = require('compression');
const { Telegraf, Markup, session } = require('telegraf');
const TelegrafLocalSession = require('telegraf-session-local');
const moment = require('moment');
const moment_duration_format = require('moment-duration-format');
const node_nlp = require('node-nlp');
const node_cron = require('node-cron');

global.DB;
global.Bot = new Telegraf(process.env.BOT_TOKEN);
global.NLP = new Object;
global.Cron = node_cron;
global.Helpers = require('./helpers');
global.i18next = require('i18next');
global.Models;
global.BotMiddlewares = require('./bot-middlewares');
global.BotTriggers = require('./bot-triggers');
global.BotCommands = require('./bot-commands');
global.BotLocalSession = new TelegrafLocalSession({
	database: 'bot-sessions.json',
	format: {
		serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
		deserialize: (str) => JSON.parse(str)
	}
});
global.SendLogErrors = (file, message, error) => {
	var developers = JSON.parse(process.env.DEVELOPERS_ID);
	if (developers.length > 0 && Array.isArray(developers)) {
		developers.forEach((chat) => {
			var html = '<b>ERROR REPORT</b>\n\n';
			html += 'File : '+file+'\n';
			html += 'Message : '+message+'\n';
			html += 'Error : \n <code>'+error+'</code>\n';
			Bot.telegram.sendMessage(chat, html, { parse_mode: 'HTML' });
		});
	}
}
global.moment = moment;

async.waterfall([
	// Initialize database using sequelize
	function(callback) {
		const Sequelize = require('./libraries/Sequelize');
		Sequelize.then(DB_Connection => callback(null, DB_Connection), error => callback(error));
	}
], async function(error, result) {
	if (!error) {

		DB = result;

		var BotLanguages = ['en', 'id'];
		var ScopeNames = ['all_chat_administrators', 'all_group_chats', 'all_private_chats', 'chat_administrators', 'chat_member', 'chat', 'default'];

		// nlp_manager: node_nlp.NlpManager
		// nlu_manager: node_nlp.NluManager,
		// ner_manager: node_nlp.NerManager
		NLP.nlp_manager = new node_nlp.NlpManager({
			languages: BotLanguages,
			nlu: { log: false }
		});

		// NLP.nlp_manager.addDocument('en', 'goodbye for now', 'greetings.bye');
		// NLP.nlp_manager.addDocument('en', 'bye bye take care', 'greetings.bye');
		// NLP.nlp_manager.addDocument('en', 'okay see you later', 'greetings.bye');
		// NLP.nlp_manager.addDocument('en', 'bye for now', 'greetings.bye');
		// NLP.nlp_manager.addDocument('en', 'i must go', 'greetings.bye');
		// NLP.nlp_manager.addDocument('en', 'hello', 'greetings.hello');
		// NLP.nlp_manager.addDocument('en', 'hi', 'greetings.hello');
		// NLP.nlp_manager.addDocument('en', 'howdy', 'greetings.hello');

		// // Train also the NLG
		// NLP.nlp_manager.addAnswer('en', 'greetings.bye', 'Till next time');
		// NLP.nlp_manager.addAnswer('en', 'greetings.bye', 'see you soon!');
		// NLP.nlp_manager.addAnswer('en', 'greetings.hello', 'Hey there!');
		// NLP.nlp_manager.addAnswer('en', 'greetings.hello', 'Greetings!');

		// // Train and save the model.
		// (async() => {
		// 	await NLP.nlp_manager.train();
		// 	NLP.nlp_manager.save();
		// 	const response = await NLP.nlp_manager.process('en', 'I should fuck hello');
		// 	console.log(response);
		// })();

		await Bot.telegram.deleteMyCommands();

		var BotCommandWithScope = new Object();
		var BotCommandsWithoutScope = new Array();

		Bot.use((BotLocalSession).middleware());

		/**
		 * Check user progress
		 */
		Bot.use(async (ctx, next) => {
			ctx.has_progress = false;
			if (ctx.session.has_progress === true) {
				var progress = await Models['user-progress'].findOne({
					where: { 'session-key': BotLocalSession.getSessionKey(ctx) }
				});

				if (progress !== null) {
					ctx.has_progress = true;
					ctx.progress = new Object;

					if (progress.get('all-steps') !== null) {
						ctx.progress.all_steps = JSON.parse(progress.get('all-steps'));
					}

					ctx.progress.current_step = progress.get('current-step');

					if (progress.get('data') !== null) {
						ctx.progress.data = JSON.parse(progress.get('data'));

					}
				}
			}

			return next();
		});

		/**
		 * Execute user progress
		 */
		Bot.use(async (ctx, next) => {
			if (ctx.has_progress) {
				switch (ctx.session.progress.type) {
					case 'command':
						var execute = BotCommands[ctx.session.progress.name].execute;
						if (typeof execute !== 'undefined') {
							ctx.state.execute = execute;
						}

						return next();
					break;

					case 'middleware':
						BotMiddlewares[ctx.session.progress.name].execute(ctx, next);
					break;

					default:
						return next();
					break;
				}
			} else {
				console.log('not has progress')
				return next();
			}
		});

		/**
		 * Error handling
		 */
		Bot.catch((error, ctx) => SendLogErrors(__filename, `Ooops, encountered an error for ${ctx.updateType}`, error));

		/**
		 * Load bot commands
		 */
		Object.keys(BotCommands).forEach((name, index) => {
			if (ScopeNames.indexOf(name) === -1) {
				for (key = 0; key < BotCommands[name].languages.length; key++) {
					var find_language = Helpers.array.find_object_value(BotCommandsWithoutScope, 'language_code', BotCommands[name].languages[key].code);
					if (find_language === false) {
						BotCommandsWithoutScope.push({ commands: [], language_code: BotCommands[name].languages[key].code });
					}

					// Hears command
					Bot.hears('!'+BotCommands[name].languages[key].command, BotCommands[name].run);

					// Listen command
					Bot.command(BotCommands[name].languages[key].command, BotCommands[name].run);

					// Listen to alias command
					if (typeof BotCommands[name].languages[key].aliases !== 'undefined' && Array.isArray(BotCommands[name].languages[key].aliases)) {
						for (var alias = 0; alias < BotCommands[name].languages[key].aliases.length; alias++) {
							// Hears command
							Bot.hears('!'+BotCommands[name].languages[key].aliases[alias], BotCommands[name].run);

							// Listen command
							Bot.command(BotCommands[name].languages[key].aliases[alias], BotCommands[name].run);
						}
					}
				}

				for (key = 0; key < BotCommands[name].languages.length; key++) {
					var find_language = Helpers.array.find_object_value(BotCommandsWithoutScope, 'language_code', BotCommands[name].languages[key].code);
					var find_command = Helpers.array.find_object_value(BotCommandsWithoutScope[find_language].commands, 'command', BotCommands[name].languages[key].command);

					if (find_command === false) {
						BotCommandsWithoutScope[find_language].commands.push({ command: BotCommands[name].languages[key].command, description: BotCommands[name].languages[key].description });
					}
				}
			} else {
				var scope = name;
				var commands = Object.keys(BotCommands[scope]);

				if (Object.keys(BotCommandWithScope).indexOf(scope) == -1) {
					BotCommandWithScope[scope] = new Array();
				}

				if (commands.length > 0) {
					for (var command = 0; command < commands.length; command++) {
						for (key = 0; key < BotCommands[scope][commands[command]].languages.length; key++) {
							var find_language = Helpers.array.find_object_value(BotCommandWithScope[scope], 'language_code', BotCommands[scope][commands[command]].languages[key].code);
							if (find_language === false) {
								BotCommandWithScope[scope].push({ commands: [], language_code: BotCommands[scope][commands[command]].languages[key].code });
							}

							// Hears command
							Bot.hears('!'+BotCommands[scope][commands[command]].languages[key].command, BotCommands[scope][commands[command]].run);

							// Listen command
							Bot.command(BotCommands[scope][commands[command]].languages[key].command, BotCommands[scope][commands[command]].run);

							// Listen to alias command
							if (typeof BotCommands[scope][commands[command]].languages[key].aliases !== 'undefined' && Array.isArray(BotCommands[scope][commands[command]].languages[key].aliases)) {
								for (var alias = 0; alias < BotCommands[scope][commands[command]].languages[key].aliases.length; alias++) {
									// Listen to command
									Bot.command(BotCommands[scope][commands[command]].languages[key].aliases[alias], BotCommands[scope][commands[command]].run);

									// Hears alias command
									Bot.hears('!'+BotCommands[scope][commands[command]].languages[key].aliases[alias], BotCommands[scope][commands[command]].run);
								}
							}
						}

						for (key = 0; key < BotCommands[scope][commands[command]].languages.length; key++) {
							var find_language = Helpers.array.find_object_value(BotCommandWithScope[scope], 'language_code', BotCommands[scope][commands[command]].languages[key].code);
							var find_command = Helpers.array.find_object_value(BotCommandWithScope[scope][find_language].commands, 'command', BotCommands[scope][commands[command]].languages[key].command);

							if (find_command === false) {
								BotCommandWithScope[scope][find_language].commands.push({ command: BotCommands[scope][commands[command]].languages[key].command, description: BotCommands[scope][commands[command]].languages[key].description });
							}
						}
					}
				}
			}
		});

		// Set commands
		for (var command_language = 0; command_language < BotCommandsWithoutScope.length; command_language++) {
			var setMyCommands = await Bot.telegram.setMyCommands(BotCommandsWithoutScope[command_language].commands, {
				language_code: BotCommandsWithoutScope[command_language].language_code,
				scope: { type: 'default' }
			});
		}

		// Set commands
		Object.keys(BotCommandWithScope).forEach(async (scope_type, index) => {
			if (BotCommandWithScope[scope_type].length > 0) {
				for (command_language = 0; command_language < BotCommandWithScope[scope_type].length; command_language++) {
					if (scope_type.match(/all/)) {
						var setMyCommands = await Bot.telegram.setMyCommands(BotCommandWithScope[scope_type][command_language].commands, {
							language_code: BotCommandWithScope[scope_type][command_language].language_code,
							scope: { type: scope_type }
						});
					}
				}
			}
		});

		// Trigger event
		Object.keys(BotTriggers).forEach((event) => Bot.on(event, BotTriggers[event]));

		/**
		 * API setup
		 */
		app.set('trust proxy', 1);

		/**
		 * Global middleware
		 */
		app.use(
			app_session,
			express.json(),
			express.urlencoded({ extended: true }),
			request_ip.mw(),
			cookie_parser(process.env.ENCRYPTION_KEY),
			cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }),
			compression(),
			(req, res, next) => {
				// Custom middleware...
				next();
		});

		/**
		 * API Routing V1
		 */
		app.use('/v1', (req, res, next) => {
			next();
		},
			express.Router().use('/', require(__dirname+'/routes/v1/index'))
		);

		/**
		 * Error handling
		 */
		app.use((req, res, next) => next(http_errors(404)), (error, req, res, next) => {
			error_status = error.status || 500;
			error_message = error.message;
			res.status(error_status);
			res.json({ status: 'error', code: error_status, message: error_message });
		});
	} else {
		console.log(error)
	}
});


process.once('SIGINT', () => Bot.stop('SIGINT'));
process.once('SIGTERM', () => Bot.stop('SIGTERM'));
process.once('SIGUSR2', function () {
	console.log(process.pid)
	gracefulShutdown(function () {
		process.kill(process.pid, 'SIGUSR2');
	});
});

Bot.launch();

/**
 * On listening event
 */
http.on('listening', () => {
	var addr = http.address();
	var bind = typeof addr === 'string'
	? 'pipe ' + addr
	: 'port ' + addr.port;

	console.table({
		'App Name': process.env.APP_NAME,
		'DB Mode': process.env.DB_MODE,
		'DB Sync': process.env.DB_SYNC,
		'Running on Port': addr.port
	});
});

/**
 * On error event
 */
http.on('error', (error) => console.log('application error', error));

/**
 * Start listen on port
 */
http.listen(process.env.PORT || 8080);
