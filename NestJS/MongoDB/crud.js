const MongClient = require('mongodb').MongoClient;

const url = "";

// MongoClient 생성
const client = new MongClient(url,{useNewUrlParser: true});

async function main(){
    try{
        await client.connect(); // Connection 생성 및 연결 시도
        console.log('connect Success');

        const collection = client.db('test').collection('person'); //test DB의 person Collection 가져오기
        await collection.insertOne({name: 'jaycoap', age: 26}); // 문서 하나 추가

        console.log("post Success");

        const documents = await collection.find({name:'jaycoap'}).toArray(); // 문서 찾기
        console.log("find:", documents);

        await collection.updateOne({name:"jaycoap"}, {$set: {age:27}}); // 문서 갱신하기
        console.log("update post");

        const updateDocuments = await collection.find({name: "jaycoap"}).toArray(); // 갱신된 문서 확인하기
        console.log("update Documents:", updateDocuments);

        await client.close(); // 연결 끊기
    } catch(err){
        console.error(err);
    }
}

main();