async function writePost(collection, post) { // 글쓰기 함수
    post.hits = 0;
    post.createddt = new Date().toISOString(); // 날짜는 ISO 포멧으로 저장
    return await collection.insertOne(post); // mongoDB에 POST를 저장 후 결과 반환
}


const paginator = require("../utils/paginator");
const {ObjectId} = require("mongodb");

async function list(collection, page, search){
    const perPage = 10;
    const query = {title: new RegExp(search, "i")};
    const cursor = collection.find(query, {limit: perPage, skip:(page -1) * 
        perPage}).sort({
        createdDt: -1,
    });
    const totalCount = await collection.count(query);
    const posts = await cursor.toArray();
    const paginatorObj = paginator({totalCount,page,perPage:perPage});
    return [posts, paginatorObj]; 
}

const projectionOption = { // 비밀번호는 제외
    projection:{
        password:0,
        "comments.password":0,
    },
};

async function getDetailPost(collection, id){ // 상세페이지 입장시 데이터 불러오기 + 조회수 업데이트
    return await collection.findOneAndUpdate({ _id: ObjectId(id)}, {$inc:{hits:1}}, projectionOption);
}

async function getPostById(collection, id){ //id로 데이터 불러오기
    return await collection.findOne({_id: ObjectId(id)},projectionOption);
}

async function getPostByIdAndPassword(collection, { id, password}){ // findOne 함수로 password가 일치하면 post 객체를 돌려준다. 단, projectionOption으로 인해 비밀번호를 제외한 데이터를 가져온다.
    return await collection.findOne({_id: ObjectId(id), password: password},projectionOption);
}



async function updatePost(collection, id ,post){ // 게시글 수정(업데이트)
    const toUpdatePost={
        $set: {
            ...post,
        },
    };
    return await collection.updateOne({ _id: ObjectId(id) }, toUpdatePost);
}




module.exports = { // require()로 file을 import시 외부로 노출하는 객체
    list,
    writePost,
    getDetailPost,
    getPostById,
    getPostByIdAndPassword,
    updatePost,
};


