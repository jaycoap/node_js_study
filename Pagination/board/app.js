const opn = require('opn'); // 자동으로 웹을 열기 위한 모듈 
const port = 4368; //포트번호
const express = require("express");
const handlebars = require("express-handlebars");
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service"); // service file loading
const mime = require("mime");
const {ObjectId} = require("mongodb"); //DB에 있는 데이터를 저장, 불러오기위해 사용

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
app.use("/home.css", (req,res, next)=>{
    res.setHeader("Content-Type", mime.getType('css'));
    next();
}, express.static('public'));
app.set("view engine", "handlebars"); // 웹페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname + "/views"); // view directory를 views로 설정



app.get("/", async(req, res)=>{ // 메인 페이지 화면은 아무 path가 없기때문에 "/"을 쓴다.
    const page = parseInt(req.query.page) || 1; //현재 페이지 데이터
    const search = req.query.search || ""; // 검색어 데이터
    try{
        const [posts,paginator] = await postService.list(collection, page, search); //postService.list에서 글 목록과 Paginator를 가져온다.
        res.render("home", {title: "node js와 mongoDB 스터디", search, paginator, posts}); // 메인 페이지 렌더링
    }catch(error){
        console.log(error);
        res.render("home", {title: "node js와 mongoDB 스터디"}); // 에러일 경우 빈값을 렌더링
    }
});


app.get("/write", (req, res)=>{
    res.render("write", {title:"테스트 게시판", mode:"create"});
});

app.post("/write", async(req, res)=>{
    const post = req.body;
    const result = await postService.writePost(collection, post); // 글쓰기 후 결과 반환
    res.redirect(`/detail/${result.insertedId}`); // 생성된 Document의 _id를 사용해 상세 페이지로 이동
});

app.get("/detail/:id", async(req, res)=>{ // 상세페이지로 이동
    const result = await postService.getDetailPost(collection,req.params.id);
    res.render("detail",{
        title:"node js와 mongoDB 스터디",
        post: result.value,
    });
});


app.get("/modify/:id", async(req,res)=>{ // 수정 페이지로 이동
    const { id } = req.params.id;
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", {title:"node js와 mongoDB 스터디", mode:"modify", post});
});


 
app.post("/modify/", async (req, res)=>{ //게시물 수정 API
    const {id,title,writer,password,content} = req.body;
    const post = {
        title,
        writer,
        password,
        content,
        createddt: new Date().toISOString(),
    };
    const result = await postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);
});

app.delete("/delete", async (req, res)=>{ // 게시물 삭제
    const {id,password} = req.body;
    try{
        const result = await collection.deleteOne({ _id:ObjectId(id), password:password}); //deleteOne을 사용해 게시글 하나 삭제

        if (result.deletedCount !==1){ // 삭제 결과가 비정상적일 때
            console.log("삭제 실패");
            return res.json({isSuccess: false});
        }
        return res.json({isSuccess:true});// 정상일때
    }catch (error){ // 에러가 난 경우
        console.error(error);
        return res.json({isSuccess:false});
    }
});

app.post("/write-comment", async (req, res)=>{ //댓글추가
    const { id, name, password, comment} = req.body; // body에서 데이터 가져오기
    const post = await postService.getPostById(collection, id); // id로 게시글 정보 가져오기
    if (post.comments){ // 게시물에 기존 댓글 리스트가 있으면 추가
        post.comments.push({
            idx: post.comments.length+1,
            name,
            password,
            comment,
            createddt: new Date().toISOString(),
        });
    }else{
        post.comments=[ // 없으면 리스트에 댓글 정보 추가
            {
                idx: 1,
                name,
                password,
                comment,
                createddt: new Date().toISOString(),
            },
        ];
    }
    postService.updatePost(collection, id, post); // 업데이트, 업데이트 이후에는  상세페이지로 redirect
    return res.redirect(`/detail/${id}`);
});

app.delete("/delete-comment", async (req, res)=>{ // 댓글 삭제
    const {id, idx , password} = req.body; 

    const post = await collection.findOne({ //게시글(post)의 commets 안에 있는 특정 댓글 데이터를 찾기
        _id: ObjectId(id), // id를 DB에서 검색 (ObjectId는 mongoDB 모듈 사용)
        
        comments: { $elemMatch:{idx: parseInt(idx), password}}, // $elemMatch는 document 안에 있는 리스트에서 조건에 해당하는 데이터가 있으면 document를 결과값으로 주는 연산자
    },
    postService.ProjectionOption,// ProjectionOption은 비밀번호를 제외하는 것
    );
    if(!post){
        return res.json({isSuccess: false});
    }
    post.comments = post.comments.filter((comment) => comment.idx != idx); // 댓글 삭제할 번호 이외 인 것만 comments에 다시 할당 후 저장
    console.log(idx);
    postService.updatePost(collection, id, post);
    return res.json({isSuccess: true});
});





app.post("/check-password", async (req,res)=>{
    const {id, password} = req.body; //id, password를 가져옴
    const post = await postService.getPostByIdAndPassword(collection, {id, password}); // service에서 getPostByIdAndPassword를 불러옴
    if (!post){
        return res.status(404).json({isExist:false}); // 오류시 404
    } else{
        return res.json({isExist:true});
    }
});

let collection;
app.listen(port, async ()=>{
    console.log("Server Started");
    const mongoClient = await mongodbConnection(); //mongodbConnection의 결과는 mongoClient
    collection = mongoClient.db().collection("post"); //mongoClient.db()로 DB선택 collection()으로 collection DB정보를 할당
    console.log("connected");

});

opn(`http://localhost:${port}/`); // 서버 동작이후 자동으로 해당 주소로 접근하기위한 코드
console.log("localhost:3000");