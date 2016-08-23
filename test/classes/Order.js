import Betelgeuse, { Types } from 'betelgeuse';

export default class Order extends Betelgeuse {
  static schema = {
    "id": Types.integer64,
    "dishId": Types.integer64,
    "quantity": Types.integer32,
    "shipDate": Types.datetime,
    "status": {
      "type": Types.string,
      "description": "Order Status",
      "enum": [
            "placed",
            "approved",
            "delivered"
          ]
    },
    "complete": {
      "type": Types.boolean,
      "default": false
    }
}
