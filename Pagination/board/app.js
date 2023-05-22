const opn = require('opn'); // 자동으로 웹을 열기 위한 모듈 
const port = 3000; //포트번호
const express = require("express");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service"); // service file loading

const app = express();
// req.body와 POST 요청을 해설하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.engine(// 템플릿 엔진으로 handlebar 등록
    "handlebars",
    handlebars.create({ // handlebars 생성 및 engine 반환
        helpers: require("./configs/handlebars-helpers"),
        
    }).engine,
);
app.set("view engine", "handlebars"); // 웹페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname + "/views"); // view directory를 views로 설정


app.get("/write", (req, res)=>{
    res.render("write", {title:"테스트 게시판", mode:"create"});
});


app.post("/write", async(req, res)=>{
    const post = req.body;
    const result = await postService.writePost(collection, post); // 글쓰기 후 결과 반환
    res.redirect(`/detail/${result.insertedId}`); // 생성된 Document의 _id를 사용해 상세 페이지로 이동
});

app.get("/detail/:id", async(req, res)=>{
    const result = await postService.getDetailPost(collection,req.params.id);
    res.render("detail",{
        title:"테스트 게시판",
        post: result.value,
    });
});

app.get("/", async(req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    try{
        const [posts,paginator] = await postService.list(collection, page, search);
        res.render("home", {title: "테스트 게시판", search, paginator, posts});
    }catch(error){
        console.log(error);
        res.render("home", {title: "테스트 게시판"});
    }
});

app.post("/check-password", async (req,res)=>{
    const {id, password} = req.body;
    const post = await postService.getPostByIdAndPassword(collection, {id, password});
    if (!post){
        return res.status(404).json({isExist:false});
    } else{
        return res.json({isExist:true});
    }
});

let collection;
app.listen(port, async ()=>{
    console.log("Server Started");
    const mongoClient = await mongodbConnection(); //mongodbConnection의 결과는 mongoClient
    collection = mongoClient.db().collection("post"); //mongoClient.db()로 DB선택 후 collection()으로 collection 선택 후 할당
    console.log("connected");

});
opn(`http://localhost:${port}/`); // 서버 동작이후 자동으로 해당 주소로 접근하기위한 코드
console.log("localhost:3000");