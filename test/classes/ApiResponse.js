import Betelgeuse, { Types } from 'betelgeuse';

export default class ApiResponse extends Betelgeuse {
  static schema = {
    "code": {
      "type": Types.integer,
      "format": "int32"
    },
    "type": Types.string,
    "message": Types.string
  }
}
