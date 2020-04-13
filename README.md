# json-validator
Json Validator - validates a json object against defined schema object.

## Install

```
npm install @vasuvanka/json-validator
```

## Docs

* API Documentation: https://vasuvanka.github.io/json-validator

## Example



```js
const {
  validate
} = require('@vasuvanka/json-validator');

const bodySchema = {
    'name': {
        type: String,
        default: "helo"
    },
    'phone':{ type: Number},
    'isLoggedIn':{type: Boolean},
    'address':{
        line: { 
            add : [{type: Number}]
        },
        street: {type: String},
        city: {type: String},
        pincode: { type: Number},
    },
    list: [{type:String}]
}

const body = {
    name: 'vasu',
    phone: 8801810010,
    address:{
        line: {
            add: ["vasu",1]
        },
        street: "streetlk111",
        city: "city",
        pincode: 500005
    },
    isLoggedIn: false,
    list: ['hello','world']

}
const error = validate(body,bodySchema)
console.log(error)

```
