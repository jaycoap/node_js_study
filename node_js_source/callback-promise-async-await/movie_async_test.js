const axios = require("axios");

async function getTop20Movies(){
    const url = "https://raw.githubusercontent.com/wapj/musthavenodejs/main/movieinfo.json";
    try{
        const result = await axios.get(url);
        const {data} = result;
        if(!data.articleList || data.articleList==0){
            throw new Error("None Data");
        }
        const movieInfos = data.articleList.map((article,idx)=>{
            return {title: article.title, rank: idx + 1};
        });
        for (let movieInfo of movieInfos){
            console.log(`[${movieInfo.rank}위]${movieInfo.title}`);
        }
    } catch(err){
        throw new Error(err);
    }
}


getTop20Movies();