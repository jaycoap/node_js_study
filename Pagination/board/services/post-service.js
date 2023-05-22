async function writePost(collection, post) { // 글쓰기 함수
    post.hits = 0;
    post.createddt = new Date().toISOString(); // 날짜는 ISO 포멧으로 저장
    return await collection.insertOne(post); // mongoDB에 POST를 저장 후 결과 반환
}

module.exports = { // require()로 file을 import시 외부로 노출하는 객체
    list,
    writePost,
    getDetailPost,
};

const paginator = require("../utils/paginator");
const {ObjectId} = require("mongodb");

async function list(collection, page, search){
    const perPage = 10;
    const query = {title: new RegExp(search, "i")};
    const cursor = collection.find(query, {limit: perPage, 
        skip:(page -1) * perPage}).sort({
        createdDt: -1,
    });
    const totalCount = await collection.count(query);
    const posts = await cursor.toArray();
    const paginatorObj = paginator({totalCount,page,perPage:perPage});
    return [posts, paginatorObj]; 
}

const projectionOption = {
    projection:{
        password:0,
        "comments.password":0,
    },
};

async function getDetailPost(collection, id){
    return await collection.findOneAndUpdate({ _id: ObjectId(id)}, {$inc:{hits:1}}, projectionOption);
}
