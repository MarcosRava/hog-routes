'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _handler = require('./handler.js');

var _handler2 = _interopRequireDefault(_handler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HOGRoute = function () {
  _createClass(HOGRoute, null, [{
    key: 'verbs',
    get: function get() {
      return {
        DELETE: 'DELETE',
        POST: 'POST',
        PUT: 'PUT',
        GET: 'GET',
        PATCH: 'PATCH'
      };
    }
  }, {
    key: 'frameworks',
    get: function get() {
      return _handler2.default.frameworks;
    }
  }]);

  function HOGRoute(options) {
    _classCallCheck(this, HOGRoute);

    this.name = options.name;
    this.framework = HOGRoute.frameworks[options.use] || HOGRoute.frameworks.express;
    this.defaultErrors = options.errors;
    this.schemas = {};
    this.swaggerJSON = {
      swagger: '2.0',
      info: getInfo(options),
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

  _createClass(HOGRoute, [{
    key: 'req',
    value: function req(verb) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var opts = args[0];
      if (typeof args[0] === 'string') {
        this.lastUrl = args[0];
        opts = args[1];
      }
      parseToSwagger(this, opts);
      return this;
    }
  }, {
    key: 'del',
    value: function del() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.req.apply(this, [HOGRoute.Verbs.DELETE].concat(args));
    }
  }, {
    key: 'post',
    value: function post() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.req.apply(this, [HOGRoute.verbs.POST].concat(args));
    }
  }, {
    key: 'put',
    value: function put() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.req.apply(this, [HOGRoute.verbs.PUT].concat(args));
    }
  }, {
    key: 'get',
    value: function get() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return this.req.apply(this, [HOGRoute.verbs.GET].concat(args));
    }
  }, {
    key: 'patch',
    value: function patch() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return this.req.apply(this, [HOGRoute.verbs.PATCH].concat(args));
    }
  }, {
    key: 'swagger',
    value: function swagger() {
      var swaggerResp = this.swaggerJSON;
      return _handler2.default.handling(this.framework, function (req, res) {
        res.json(swaggerResp);
      });
    }
  }, {
    key: 'express',
    value: function express() {}
  }]);

  return HOGRoute;
}();

exports.default = HOGRoute;


function getInfo() {}

function parseToSwagger(ref, opts) {
  var responses = opts.responses;
  var requestModel = opts.request.body || opts.request.query || {};
  var reponseModels = responses ? responses.statuses : {};

  parseSwaggerDefinitions(ref, reponseModels);
  parseSwaggerDefinitions(ref, { 200: requestModel });
  //parseSwaggerPaths(ref, response);
}

function parseSwaggerDefinitions(ref, models) {
  var defaultErrors = ref.defaultErrors;

  var i = void 0;
  for (i in models) {
    var model = parseInt(i) >= 400 ? models[i].model || defaultErrors : models[i].model;
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

  var modelName = void 0;
  for (modelName in schemas) {
    var model = schemas[modelName];
    linked[modelName] = schemas[modelName].validateSchema;
    var schema = model.schema;
    parseSchema(linked, modelName, schema);
  }

  return linked;
}

function parseSchema(linked, modelName, schema) {
  var needADefinition = {};

  var attr = void 0;
  for (attr in schema) {
    var modelAttribute = schema[attr];
    if (modelAttribute.ref) {
      if (modelAttribute.type === 'array') {
        linked[modelName].properties[attr] = {
          items: {
            $ref: '#/definitions/' + modelAttribute.ref.name
          }
        };
      } else {
        linked[modelName].properties[attr] = {
          $ref: '#/definitions/' + modelAttribute.ref.name
        };
      }
      if (!linked[modelAttribute.ref.name]) {
        needADefinition[modelAttribute.ref.name] = modelAttribute.ref;
      }
    }
  }

  linkDefinitions(linked, needADefinition);

  return linked;
}