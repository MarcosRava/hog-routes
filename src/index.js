import Handler from './handler.js';

export default class HOGRoute {

  static get verbs() {
    return {
      DELETE: 'DELETE',
      POST: 'POST',
      PUT:'PUT',
      GET:'GET',
      PATCH:'PATCH'
    }
  }

  static get frameworks() {
    return Handler.frameworks;
  }

  constructor(options) {

    this.name = options.name;
    this.framework = HOGRoute.frameworks[options.use] || HOGRoute.frameworks.express;
    this.defaultErrors = options.errors;
    this.schemas = {};
    this.swaggerJSON = {
      swagger: '2.0',
      info : getInfo(options),
      host: '',
      basePath: '',
      tags: [],
      schemes: [],
      paths: {},
      securityDefinitions: {},
      definitions: {},
      externalDocs: {}
    };
  }

  req(verb, ...args) {
    let opts = args[0];
    if (typeof args[0] === 'string') {
      [this.lastUrl, opts] = args;
    }
    parseToSwagger(this, opts) ;
    return this;
  }

  del(...args) {
    return this.req(HOGRoute.Verbs.DELETE, ...args);
  }

  post(...args) {
    return this.req(HOGRoute.verbs.POST, ...args);
  }

  put(...args) {
    return this.req(HOGRoute.verbs.PUT, ...args);
  }

  get(...args) {
    return this.req(HOGRoute.verbs.GET, ...args);
  }

  patch(...args) {
    return this.req(HOGRoute.verbs.PATCH, ...args);
  }

  swagger () {
    const swaggerResp = this.swaggerJSON;
    return Handler.handling(this.framework, (req, res) => {
      res.json(swaggerResp);
    });
  }

  express() {

  }
}


function getInfo() {

}

function parseToSwagger(ref, opts) {
  const responses = opts.responses;
  const requestModel = opts.request.body || opts.request.query || {};
  const reponseModels = responses ? responses.statuses : {};

  parseSwaggerDefinitions(ref, reponseModels);
  parseSwaggerDefinitions(ref, {200: requestModel});
  //parseSwaggerPaths(ref, response);

}

function parseSwaggerDefinitions(ref, models) {
  const defaultErrors = ref.defaultErrors;

  let i;
  for(i in models) {
    let model = parseInt(i) >= 400 ? (models[i].model || defaultErrors) : models[i].model;
    if (model.type === 'array') {
      model = model.ref;
    }
    if (model && !ref.swaggerJSON.definitions[model.name]) {
      ref.schemas[model.name] = model;
    }
  }

  ref.swaggerJSON.definitions = linkDefinitions(ref.swaggerJSON.definitions, ref.schemas);
}

function linkDefinitions(linked, schemas) {
  linked = linked || {};

  let modelName;
  for(modelName in schemas) {
    const model = schemas[modelName];
    linked[modelName] = schemas[modelName].validateSchema;
    const schema = model.schema;
    parseSchema(linked, modelName, schema);
  }

  return linked;

}

function parseSchema(linked, modelName, schema) {
  let needADefinition = {};

  let attr;
  for(attr in schema) {
    const modelAttribute = schema[attr];
    if(modelAttribute.ref) {
      if (modelAttribute.type === 'array') {
        linked[modelName].properties[attr] = {
          items: {
            $ref: `#/definitions/${modelAttribute.ref.name}`
          }
        }
      }
      else {
        linked[modelName].properties[attr] = {
          $ref: `#/definitions/${modelAttribute.ref.name}`
        }
      }
      if (!linked[modelAttribute.ref.name]) {
        needADefinition[modelAttribute.ref.name] = modelAttribute.ref;
      }
    }
  }

  linkDefinitions(linked, needADefinition);

  return linked;
}
