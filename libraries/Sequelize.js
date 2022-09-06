var string_to_boolean = function(str) {
	switch (str.toLowerCase().trim()) {
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(str);
	}
}

module.exports = new Promise((resolve, reject) => {
	var config = require(__dirname+'/../database');
	const { host, port, username, password, database, dbdriver, timezone, debug } = config;
	const { Sequelize, Op, Model, DataTypes } = require('sequelize');
	const connection = new Sequelize.Sequelize(database, username, password, {
		host: host,
		port: (port !== 3306)?port:3306,
		dialect: dbdriver,
		logging: string_to_boolean(debug),
		timezone: timezone
	});

	// load models
	const models = require(__dirname+'/../models/');
	const models_name = Object.keys(models);

	for (var key = 0; key < models_name.length; key ++) {
		var name = models_name[key];
		var model = models[name](DataTypes);

		name = (model.config !== undefined && model.config.modelName !== undefined) ? model.config.modelName : name;
		connection.define(name, model.fields, Object.assign({
			freezeTableName: true,
			underscored: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			charset: 'utf8mb4',
			collate: 'utf8mb4_unicode_ci'
		}, model.config));
	}

	for (var key = 0; key < models_name.length; key ++) {
		var name = models_name[key];
		var model = models[name](DataTypes);

		if (model.associate !== undefined && model.associate.length > 0) {
			model.associate.forEach((relation, key) => {
				// removing object keys : type & model to show associations config only
				var associate = model.associate.map((associate, k) => {
					var new_object = {}
					var object_keys  = Object.keys(associate);
					for (var i = 0; i < object_keys.length; i++) {
						if (['type', 'model'].indexOf(object_keys[i]) == -1) {
							new_object[object_keys[i]] = associate[object_keys[i]];
						}
					}

					return new_object;
				});

				connection.models[name][relation.type](connection.models[[model.associate[key].model]], associate[key]);
			});
		}
	}

	connection.sync({ [process.env.DB_MODE]: string_to_boolean(process.env.DB_SYNC) }).then((conn) => {
		global.Models = Object.assign(connection.models, global.Models);
		resolve({ connection, Sequelize, Op, Model, DataTypes });
	});
});
