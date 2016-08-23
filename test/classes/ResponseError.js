import Betelgeuse, { Types } from 'betelgeuse';

export default class ResponseError extends Betelgeuse {
  static schema = {
    url: Types.string,
    msg: Types.string,
    stack: Types.string,
    statusCode: Types.integer
  }
}
