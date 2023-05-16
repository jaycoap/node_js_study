const http = require("http");
const url = require("url"); //url 모듈 로딩

http.createServer((req, res)=>{
    const path = url.parse(req.url,true).pathname // request받은 pathname을 얻어냄
    res.setHeader("Content-Type", "text/html");

    if(path in urlMap){
        urlMap[path](req,res);
    } else{
        notFound(req, res);
    }
}).listen("3000",()=>console.log("http://localhost:3000/user?name=jaycoap&age=26"));



const user = (req,res)=>{ //user에 대한 결과값 설정
    const userInfo = url.parse(req.url,true).query //query string에 데이터를 userInfo에 할당
    res.end(`[user] name:${userInfo.name},age:${userInfo.age}`); //결과값으로 이름과 나이를 설정
};

const feed = (req,res) =>{
    res.end(`<ul>
        <li>picture1</li>
        <li>picture2</li>
        <li>picture3</li>
        </ul>
        `); // /feed에 대한 결과값 설정
}

const notFound = (req,res)=>{
    res.statusCode = 404;
    res.end("404 Page not found");
}
const urlMap = {
    "/": (req,res)=> res.end("HOME"),
    "/user":user,
    "/feed":feed,
};