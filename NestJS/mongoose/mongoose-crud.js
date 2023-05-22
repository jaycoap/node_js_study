const express = require("express"); // express 선언
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Person = require("./person-model"); // Schema를 설정한 코드와 연동

mongoose.set("strictQuery",false); // true로 설정 되어 있으면 Schema에 지정된 필드만 DB에 저장되기에 strictQuery 필터로 해당 문제를 방지

const app = express();
app.use(bodyParser.json()); // HTTP에서 Body를 Parsing하기 위한 설정
app.listen(3000, async ()=>{
    console.log("Start Server");
    const mongooseUri = ""; 
    mongoose.connect(mongooseUri, {useNewUrlParser: true}) //MongoDB와 Connetion
    .then(console.log("Connection Success"));
});

app.get("/person",async(req, res)=>{ // person에 모든 데이터 출력
    const person = await Person.find({});
    res.send(person);
});

app.get("/person/:email",async (req,res)=>{ // 특정 이메일로 person찾기
    const person = await Person.findOne({email: req.params.email});
    res.send(person);
});

app.post("/person", async (req, res)=>{ // person 데이터 추가
    const person = new Person(req.body);
    await person.save();
    res.send(person);
});

app.put("/person/:email", async (req, res)=>{ // person 데이터 수정
    const person = await Person.findOneAndUpdate(
        { email: req.params.email },
        { $set: req.body},
        { new: true}
    );
    console.log(person);
    res.send(person);
});

app.delete("/person/:email", async (req, res) => { // person 데이터 삭제
    await Person.deleteMany({email: req.body.email});
    res.send({success:true});
});