const express = require("express"); //express 할당
const app = express(); //express 초기화 및 변수로 할당
let posts = []; // 게시글 리스트로 사용할 posts에 빈 리스트 할당 

//req.body를 사용하려면 JSON middleware를 사용
app.use(express.json()); //JSON middleware 활성화

//POST 요청시 컨텐트 타입이 appication/x-www-form-urlencoded인 경우 parsing
app.use(express.urlencoded({extended:true})); // JSON middleware와 함께 사용

// "/"로 요청이 오면 실행
app.get("/",(req,res)=>{
    res.json(posts); // 게시글 리스트를 JSON 형식으로 보여줌
});

app.post("/posts",(req,res)=>{ // /posts로 요청이 오면 실행
    console.log(req.body); //HTTP 요청의 body 데이터를 변수에 할당
    const{title,name,text}=req.body;
    // 게시글 리스트에 새로운 게시글 정보 추가
    posts.push({id:posts.length+1,title,name,text,createdDt:Date()});
    res.json({title,name,text});
});

app.delete("/posts/:id",(req,res)=>{
    const id = req.params.id; // app.delete에 설정한 path 정보에서 id 값을 가져옴
    const filteredPosts = posts.filter((post)=>post.id !== +id); // 글 삭제 로직
    const isLengthChanged = posts.length !== filteredPosts.length; // 삭제 확인
    posts = filteredPosts;
    if(isLengthChanged){ //posts의 데이터 개수가 변경되었다면 삭제 성공
        res.json("OK");
        return;
    }

    res.json("Not Changed"); // 변경되지 않음
});

app.listen(3000,()=> {
    console.log("http://localhost:3000")
})