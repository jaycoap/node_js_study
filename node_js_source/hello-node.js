const http = require("http"); // http 객체 생성

let count = 0;
// node server 객체 생성
const server = http.createServer((req,res) =>{
    log(count) //카운트 1 증가
    res.statusCode = 200; //response 결과 값 
    res.setHeader("Content-type","text/plain"); //헤더 설정
    res.write("hello\n"); //response 응답 값
    //prettier-ignore
    setTimeout(()=>{
        res.end("Node.js");

    },2000);
});
function log(count){
    console.log((count+=1))
}


server.listen(3000,() => console.log("http://localhost:3000"))