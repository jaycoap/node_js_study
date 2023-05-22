var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const personSchema = new Schema({ // Schema 객체 생성
    name: String,
    age: Number,
    email: { type: String, required: true}
});

module.exports = mongoose.model('Person',personSchema); // 모델 객체 생성