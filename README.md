# SALESPAL #

This is a SalesPal demo app that use NodeJS, Koa, Typescript, and MongoDB to serve an API, and AngularJS to provide the user interface.

### How do I get set up? ###

* Install a text editor, e.g. Visual Studio Code is recommended
* Install Node, e.g. brew install node
* Clone the repository
* Install Docker

### Contribution guidelines ###
* Code reviews are done via pull requests
* Never commit directly to develop, staging, or master

# Frontend #

The frontend was built using AngularJS

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

## Technologies used: ##

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
