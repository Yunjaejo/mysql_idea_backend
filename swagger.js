const swaggerAutogen = require('swagger-autogen')();


const doc = {
  info: {
    version: '1.0.0',
    title: 'IDEA',
    description: 'Documentation automatically generated by the <b>swagger-autogen</b> module.'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: [ 'http', 'https' ],
  consumes: [ 'application/json' ],
  produces: [ 'application/json' ],
  tags: [
    {
      'name': 'User',
      'description': 'Endpoints'
    }
  ],
  securityDefinitions: {
    'Bearer': {
      type: 'apiKey',
      in: 'header',       // can be "header", "query" or "cookie"
      name: 'Authorization',  // name of the header, query parameter or cookie
      description: 'token'
    }
  },
  definitions: {
    Parents: {
      father: 'Simon Doe',
      mother: 'Marie Doe'
    },
    User: {
      name: 'Jhon Doe',
      age: 29,
      parents: {
        $ref: '#/definitions/Parents'
      },
      diplomas: [
        {
          school: 'XYZ University',
          year: 2020,
          completed: true,
          internship: {
            hours: 290,
            location: 'XYZ Company'
          }
        }
      ]
    },
    AddUser: {
      $name: 'Jhon Doe',
      $age: 29,
      about: ''
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routers/*.js', './app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);