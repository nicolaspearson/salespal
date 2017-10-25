# SALESPAL #

This is a SalesPal demo app that use NodeJS, Koa, Typescript, and MongoDB to serve an API, and AngularJS to provide the user interface.

### How do I get set up? ###

* Install a text editor, e.g. Visual Studio Code is recommended
* Install Node, e.g. brew install node
* Clone the repository
* Install Docker

# Frontend #

The frontend was built using AngularJS.

### Running the project ###

1. Run `npm install / yarn install`
2. Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
3. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
4. Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
5. Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Generating new Components ###

* Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Frontend technologies used: ##

### For the application ###

* [AngularJS](https://angular.io/)
* [Angular Material](https://material.angular.io)
* [Socket.IO](https://www.npmjs.com/package/socket.io)
* [Typescript](https://www.typescriptlang.org/)

### For testing

* [Jasmine](https://jasmine.github.io/)
* [Karma](https://karma-runner.github.io)
* [Protractor](http://www.protractortest.org/)

### Screenshots

### Login: ###

![Alt text](https://s1.postimg.org/17d5weac33/Screen_Shot_2017-10-24_at_11.09.42_PM.png "Login")

### View Items: ###

![Alt text](https://s1.postimg.org/87qy6mnpdb/Screen_Shot_2017-10-24_at_11.10.15_PM.png "Stock Items")

### Edit / Delete Items: ###

![Alt text](https://s1.postimg.org/3vs4z35o5r/Screen_Shot_2017-10-24_at_11.10.34_PM.png "Edit / Delete")

### Create Items : ###

![Alt text](https://s1.postimg.org/5iveei6b8f/Screen_Shot_2017-10-25_at_6.54.23_PM.png "Create")

# Backend #

The backend is a NodeJS API, built using Koa, Typescript, and MongoDB.

### Running the project ###

1. Navigate into the backend folder `cd ./backend`
2. Run `yarn install`
3. Run `docker-compose up`, this will run the container for the MongoDB.
4. Run `docker ps` to find the name of the docker container.
5. Run `docker exec -i -t <docker-container-name> /bin/bash` to open a bash in the container, e.g. `docker exec -i -t salespal /bin/bash`
6. Run `npm run build` to compile the typescript into the dist folder.
7. Run `npm start` to run the application.
8. Run `npm run test:unit` to execute the unit tests.
9. To customize, update the configuration parameters in `./config/default.yml` and the docker compose .yml files

### Auth and Credentials ###

The server automatically creates the following test credentials if there are no users in the database:

* Username: `Tester`
* Password: `hello123`

You can use these credentials to execute the `../users/login` api call and retrieve a JWT token.

### Generating new Controllers, Models, Repositories, and Services ###

There is generate command available via npm run

This is just helper to get going quicker, if you have a new table 'Fish' in your database,
you can use this command to help generate all of the boilerplate scaffolding required when using
the repository pattern:

* Run `npm run generate`
* Select the component that you would like to generate, e.g. `All` will generate a Controller, Model, Repository, and Service
* Provide a name for the component, e.g. `Fish`

## Backend technologies used: ##

### For the application ###

* [Class Validator](https://www.npmjs.com/package/class-validator)
* [Config](https://www.npmjs.com/package/config)
* [Docker](https://www.docker.com/)
* [Event Dispatch](https://www.npmjs.com/package/event-dispatch)
* [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken)
* [Koa](https://www.npmjs.com/package/koa)
* [MongoDB](https://www.npmjs.com/package/mongodb)
* [Routing Controllers](https://www.npmjs.com/package/routing-controllers)
* [Socket.IO](https://www.npmjs.com/package/socket.io)
* [Type DI](https://www.npmjs.com/package/typedi)
* [Typescript](https://www.typescriptlang.org/)
* [Type ORM](https://www.npmjs.com/package/typeorm)
* [Swagger JS Doc](https://www.npmjs.com/package/swagger-jsdoc)
* [Winston](https://www.npmjs.com/package/winston)

### For testing

* [Chai](https://www.npmjs.com/package/chai)
* [Mocha](https://www.npmjs.com/package/mocha)
* [Sinon](https://www.npmjs.com/package/sinon)
* [Supertest](https://www.npmjs.com/package/supertest)
* [TS-Mockito](https://www.npmjs.com/package/ts-mockito)
