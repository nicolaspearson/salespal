import { EventSubscriber, On } from 'event-dispatch';
import { Container } from 'typedi';
import AppLogger from '../app/AppLogger';

@EventSubscriber()
export class SocketEventSubscriber {
	private appLogger: AppLogger;

	constructor() {
		this.appLogger = Container.get(AppLogger);
	}

	@On('started')
	public onSocketServerStarted(data: any) {
		this.appLogger.winston.log('socket', data.message);
	}
}
