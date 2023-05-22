const { MongoClient } = require('mongodb');
const uri = "MongoDB정보 입력";

module.exports = function(callback){
    return MongoClient.connect(uri, callback);
};


