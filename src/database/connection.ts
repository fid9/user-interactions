import { Sequelize } from 'sequelize';

export const database = new Sequelize(
    process.env.DB_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
		port: Number(process.env.DB_PORT),
        dialect: 'mysql',
        pool: {
			max: 3,
			min: 0,
			idle: 20 * 1000,
			acquire: 30 * 1000,
		},
    }
);

export const drainDbConnections = (): void => {
	(database.connectionManager as any).pool.destroyAllNow();
};
