const url = require("url");
const express = require("express"); // express 모듈
const app = express(); // express 초기화 후 app 변수에 할당
const port = 3000;

app.listen(port,()=>{
    console.log(`START SERVER : use http://localhost:${port}`);
});

app.get("/",(_,res)=>{ res.end("HOME");});
app.get("/user", user);
app.get("feed",feed);

function user(req,res){
    const user = url.parse(req.url, true).query;
    res.json(`[user] nama:${user.name}, age:${user.age}`);

}

function feed(_,res){
    res.json(`<ul>
    <li>p1</li>
    <li>p2</li>
    <li>p3</li>
    </ul>`);
}