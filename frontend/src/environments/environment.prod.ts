const packageJson = require('../../package.json');

export const environment = {
	appName: 'SalesPal',
	appStoragePrefix: 'SP-PROD-APP-',
	api: {
		endpoint: 'http://34.251.192.53:3010/api/v1',
		accessToken: 'SecretAccessToken'
	},
	envName: 'PROD',
	production: true,
	versions: {
		app: packageJson.version,
		angular: packageJson.dependencies['@angular/core'],
		ngrx: packageJson.dependencies['@ngrx/store'],
		material: packageJson.dependencies['@angular/material'],
		bootstrap: packageJson.dependencies.bootstrap,
		rxjs: packageJson.dependencies.rxjs,
		angularCli: packageJson.devDependencies['@angular/cli'],
		typescript: packageJson.devDependencies['typescript']
	}
};
