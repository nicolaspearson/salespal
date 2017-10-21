import * as config from 'config';
import { Server } from 'http';
import * as Koa from 'koa';
import 'reflect-metadata';
import 'source-map-support/register';
import 'ts-helpers';
import { Container, Inject, Service } from 'typedi';
import AppLogger from './AppLogger';
import { Database } from './Database';
import { KoaConfig } from './KoaConfig';
import { Sockets } from './Socket';

@Service()
export class Application {
	@Inject() private appLogger: AppLogger;

	private static app: Koa;

	private static server: Server;

	constructor() {
		// Empty constructor
	}

	public static getApp(): Koa {
		return Application.app;
	}

	public static getServer(): Server {
		return Application.server;
	}

	public async setupApplication(options: IApplicationOptions): Promise<Server> {
		// Return an the instance if the app and server are already configured
		if (Application.getApp() && Application.getServer()) {
			return Application.getServer();
		}

		this.appLogger.winston.debug('Application: Configuration Started');

		const port = config.get('server.api.port');
		const basePath = config.get('server.api.basePath');

		// Configure the webserver
		const koaConfig: KoaConfig = Container.get(KoaConfig);
		Application.app = await koaConfig.setupKoa(options);

		// Connect to the database
		const database: Database = Container.get(Database);
		await database.setupDatabase(Application.app);

		// Start the webserver
		Application.server = Application.app.listen(port, () => {
			this.appLogger.winston.debug(`
	------------------------------------------------
	Server Started:
	------------------------------------------------
	API: http://localhost:${port}${basePath}
	API Docs: http://localhost:${port}${basePath}/api-docs.json
	------------------------------------------------
			`);
		});

		// Start Websockets
		const sockets: Sockets = Container.get(Sockets);
		await sockets.setupSockets(Application.server);
		return Application.server;
	}
}

export interface IApplicationOptions {
	// Enable / Disable Koa Logger
	useKoaLogger: boolean;
}
