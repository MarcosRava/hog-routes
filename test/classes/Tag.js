import Betelgeuse, { Types } from 'betelgeuse';

export default class Tag extends Betelgeuse {
  static schema = {
    "id": {
      "type": Types.integer,
      "format": "int64"
    },
    "name": Types.string
  }
}
