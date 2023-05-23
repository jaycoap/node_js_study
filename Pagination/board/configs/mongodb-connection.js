const { MongoClient } = require('mongodb');
const uri = "";

module.exports = function(callback){
    return MongoClient.connect(uri, callback);
};


