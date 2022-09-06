module.exports = function(DataTypes) {
	return {
		fields: {
			'id': {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			'session-key': {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			'all-steps': {
				type: DataTypes.STRING,
				allowNull: true
			},
			'current-step': {
				type: DataTypes.STRING,
				allowNull: true
			},
			'data': {
				type: DataTypes.TEXT('long'),
				allowNull: true
			}
		},
		associate: []
	}
}
