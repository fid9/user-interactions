/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = {
	up: (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
			},
			updated_at: {
				type: Sequelize.DATE,
			},
		});
	},
};
