# H.O.G. Routes
A route tools to express/hapi with validations and swagger docs generator based on [Betelgeuse](https://github.com/MarcosRava/betelgeuse) instances

## Usage

```js
import Betelgeuse, { Types } from 'betelgeuse';

class ResponseError extends Betelgeuse {
  static schema = {
    url: Types.string,
    msg: Types.string,
    stack: Types.string,
    statusCode: Types.integer
  }
}

class MilliwayDish extends Betelgeuse {
  static schema = {
    id: Types.integer,
    name: {
      type: Types.string,
      minLength: 3
    },
    price: {
      type: Types.number.
      minimum: 0
    }
  }
}

import HOG from 'hog-tools';

let route = new HOG({use:'express', validations:true});

route
  .get('/milliways/dishes/', {
    reponses: {
      json: true, //default
      xml: false, //default
      status: {
        200: Types.ArrayOf(MilliwayDish),
        500: ResponseError
      }
    },
    handler: function (req, res) {
      //...
    }
  })
  .post({
    responses: {
      status: {
        500: {
          model: ResponseError,
        }
        201: { }
      }
    },
    request: {
      body: MilliwayDish,
    },
    handler: function (req, res) {
      //...
    }
  })

app.use(route);
app.use('/milliways/docs.json', route.swagger);

```


