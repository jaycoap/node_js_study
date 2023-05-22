const {BSON,ObjectId} = require('bson');

ex={
    name:"jaycoap",
    company:"NIT Service"
};

const exBSON = BSON.serialize({_id: new ObjectId()});
console.log(exBSON);