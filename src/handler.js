export default class Handler {

  static get frameworks () {
    return {
      express: 'express',
      hapi: 'hapi'
    };
  }

  static handling(framework, handler) {
    framework = Handler.frameworks[framework] || Handler.frameworks.express;
    if (framework === Handler.frameworks.express) {
      return function (...args) {
        let req, res, next;
        [req, res, next] = args;
        return handler(req, res, next);
      }
    }
  }

}
