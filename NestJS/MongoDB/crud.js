const MongClient = require('mongodb').MongoClient;

const url = "";

const client = new MongClient(url,{useNewUrlParser: true});

async function main(){
    try{
        await client.connect();
        console.log('connect Success');

        const collection = client.db('test').collection('person');
        await collection.insertOne({name: '', age: 26});

        console.log("post Success");

        const documents = await collection.find({name:''}).toArray();
        console.log("find:", documents);

        await collection.updateOne({name:""}, {$set: {age:27}});
        console.log("update post");

        const updateDocuments = await collection.find({name: ""}).toArray();
        console.log("update Documents:", updateDocuments);

        await client.close();
    } catch(err){
        console.error(err);
    }
}

main();