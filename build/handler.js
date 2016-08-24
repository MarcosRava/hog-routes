'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Handler = function () {
  function Handler() {
    _classCallCheck(this, Handler);
  }

  _createClass(Handler, null, [{
    key: 'handling',
    value: function handling(framework, handler) {
      framework = Handler.frameworks[framework] || Handler.frameworks.express;
      if (framework === Handler.frameworks.express) {
        return function () {
          var req = void 0,
              res = void 0,
              next = void 0;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          req = args[0];
          res = args[1];
          next = args[2];

          return handler(req, res, next);
        };
      }
    }
  }, {
    key: 'frameworks',
    get: function get() {
      return {
        express: 'express',
        hapi: 'hapi'
      };
    }
  }]);

  return Handler;
}();

exports.default = Handler;