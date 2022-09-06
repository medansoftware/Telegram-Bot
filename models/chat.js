module.exports = function(DataTypes) {
	return {
		fields: {
			'id': {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			'chat-id': {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			'chat-type': {
				type: DataTypes.ENUM('private', 'group', 'supergroup', 'channel'),
				allowNull: false
			},
			'chat-title': {
				type: DataTypes.STRING,
				allowNull: true
			},
			'language-code': {
				type: DataTypes.CHAR(2),
				defaultValue: 'en'
			},
			'status': {
				type: DataTypes.ENUM('available', 'not-available'),
				allowNull: false,
				defaultValue: 'available'
			}

		},
		associate: []
	}
}
