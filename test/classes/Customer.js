import Betelgeuse, { Types } from 'betelgeuse';

export default class Customer extends Betelgeuse {
  static schema = {
    "id": {
      "type": Types.integer,
      "format": "int64"
    },
    "username": Types.string,
    "firstName": Types.string,
    "lastName": Types.string,
    "email": Types.string,
    "password": Types.string,
    "phone": Types.string,
    "customerStatus": {
      "type": Types.integer,
      "format": "int32",
      "description": "User Status"
    }
  }

}
