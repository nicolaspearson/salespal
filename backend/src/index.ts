import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { Application, IApplicationOptions } from './app/Application';

async function createApp() {
	try {
		if (!Application.getApp() || !Application.getServer()) {
			routingUseContainer(Container);
			ormUseContainer(Container);
			const application: Application = Container.get(Application);
			await application.setupApplication({
				useKoaLogger: true
			} as IApplicationOptions);
		}
	} catch (error) {
		/* tslint:disable no-console */
		console.log(error);
	}
}

createApp();
