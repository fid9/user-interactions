/* eslint-disable @typescript-eslint/explicit-function-return-type */

module.exports = {
	up: (queryInterface, Sequelize) => {
		await queryInterface.createTable('likes', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			sender_user: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			receiver_user: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
			},
			updated_at: {
				type: Sequelize.DATE,
			},
		});

		await queryInterface.addIndex(
			'likes',
			['sender_user', 'receiver_user'],
			{
				name: 'like_index',
			}
		);
	},
};
