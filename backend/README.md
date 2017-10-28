# Node SALESPAL #

A demo MANK stack (MonogoDB, AngularJS, NodeJS, Koa) stock item app that provides CRUD operations to store vehicle information. It makes use of NodeJS, Koa, and MongoDB to serve a RESTful API. This project has been written in Typescript.

### How do I get set up? ###

* Install a text editor, e.g. Visual Studio Code is recommended
* Install Node, e.g. brew install node
* Clone the repository
* Install Docker

### Running the project ###

1. Run `npm install / yarn install`
2. Run `docker-compose up`, this will run the container for the MongoDB.
3. Run `docker ps` to find the name of the docker container.
4. Run `docker exec -i -t <docker-container-name> /bin/bash` to open a bash in the container, e.g. `docker exec -i -t salespal /bin/bash`
5. Run `npm run build` to compile the typescript into the dist folder.
6. Run `npm start` to run the application.
7. Run `npm run test:unit` to execute the unit tests.
10. To customize, update the configuration parameters in `./config/default.yml` / `./config/production.yml`  and the docker compose .yml files

### Generating new Controllers, Models, Repositories, and Services ###

There is local a generate script available via `npm run`, that will assist in generating new Controllers, Models, Repositories, and Services. For example, if you have a new table called 'Fish' in your database, you can use this command to help generate all of the boilerplate scaffolding required when using the repository pattern:

* Run `npm run generate`
* Select the component that you would like to generate, e.g. `All` will generate a Controller, Model, Repository, and Service
* Provide a name for the component, e.g. `Fish`, if you need to generate a multi-word component please use LetterCasing, e.g. `GoldFish`.

The templates can customized as required in `./src/templates/`

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

