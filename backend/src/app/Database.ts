import * as config from 'config';
import * as Koa from 'koa';
import * as path from 'path';
import { Inject } from 'typedi';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import User from '../models/User';
import UserService from '../services/UserService';
import AppLogger from './AppLogger';

export class Database {
	@Inject() private appLogger: AppLogger;

	@Inject() private userService: UserService;

	private connection: Connection;

	constructor() {
		// Empty constructor
	}

	public async setupDatabase(app: Koa): Promise<Connection> {
		// Create the database connection
		try {
			if (!this.connection) {
				this.connection = await createConnection(this.getConnectionOptions());
			}
			const user: User | undefined = await this.userService.createTestAccount();
			if (user && user !== undefined) {
				this.appLogger.winston.debug('Database: Test User Added!');
			}
		} catch (error) {
			throw error;
		}
		this.appLogger.winston.debug('Database: Connected');
		return this.connection;
	}

	private getConnectionOptions(): ConnectionOptions {
		let connectionUrl = `mongodb://${config.get('server.db.host')}:${config.get(
			'server.db.port'
		)}/${config.get('server.db.database')}`;
		if (config.get('server.db.auth') === true) {
			connectionUrl = `mongodb://${config.get(
				'server.db.username'
			)}:${config.get('server.db.password')}@${config.get(
				'server.db.host'
			)}:${config.get('server.db.port')}/${config.get('server.db.database')}`;
		}
		const options: ConnectionOptions = {
			authSource: config.get('server.db.authSource'),
			database: config.get('server.db.database'),
			entities: [path.resolve('dist/models/*.js')],
			logging: this.getDatabaseLogLevel(),
			name: config.get('server.db.name'),
			type: 'mongodb',
			url: connectionUrl
		};
		return options;
	}

	// Get the desired log level from config, unfortunately the type is not exposed
	// therefore we need to compose an ugly type definition in the declaration
	private getDatabaseLogLevel() {
		let logLevel = false as
			| boolean
			| 'all'
			| Array<
					'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration'
				>;
		if (config.get('server.db.logging')) {
			if (
				config.get('server.db.logging') === 'all' ||
				config.get('server.db.logging') === true
			) {
				logLevel = config.get('server.db.logging');
			} else {
				logLevel = [config.get('server.db.logging')];
			}
		}
		return logLevel;
	}
}
