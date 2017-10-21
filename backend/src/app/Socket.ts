import * as config from 'config';
import { defaultMetadataRegistry } from 'event-dispatch/MetadataRegistry';
import * as glob from 'glob';
import { Server } from 'http';
import * as path from 'path';
import * as ioServer from 'socket.io';
import * as ioClient from 'socket.io-client';
import { Inject } from 'typedi';
import AppLogger from './AppLogger';

export class Sockets {
	@Inject() private appLogger: AppLogger;

	// Include subscribers dynamically
	private subscribers = glob.sync('./dist/subscribers/*.js');

	constructor() {
		this.subscribers.map(f => {
			return require(path.resolve(f));
		});
	}

	public async setupSockets(app: Server): Promise<SocketIO.Server> {
		const socketServer: SocketIO.Server = ioServer(
			app,
			this.getSocketServerOptions()
		);

		socketServer.use((socket, next) => {
			// Add middleware
			next();
		});

		socketServer.on('connection', socket => {
			// Bind applicable subscribers to the socket
			defaultMetadataRegistry.collectEventsHandlers.forEach(
				(eventHandler: any) => {
					const eventNamesForThisHandler = Object.keys(eventHandler);
					eventNamesForThisHandler.forEach(eventName => {
						const callback = eventHandler[eventName];
						socket.on(eventName, data => {
							callback(Object.assign({ socket }, data));
						});
					});
				}
			);
		});

		this.setupSocketTestClient();

		this.appLogger.winston.debug('Sockets: Web Sockets Initialized');

		return socketServer;
	}

	private getSocketServerOptions(): SocketIO.ServerOptions {
		return {
			path: config.get('server.socket.path')
		};
	}

	private setupSocketTestClient() {
		const socketServerUrl = `http://${config.get(
			'server.socket.host'
		)}:${config.get('server.socket.port')}`;
		const socketServerPath: string = config.get('server.socket.path');

		const client = ioClient.connect(socketServerUrl, {
			path: socketServerPath
		});

		client.emit('started', {
			message: `Socket server is listening on: ${socketServerUrl}${socketServerPath}`
		});
	}
}
