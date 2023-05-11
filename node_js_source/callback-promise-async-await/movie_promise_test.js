const axios = require("axios");

const url = "https://raw.githubusercontent.com/wapj/musthavenodejs/main/movieinfo.json";

axios
    .get(url)
    .then((result) => {
        if (result.status != 200) {
            throw new Error("Failed");
        }

        if (result.data) {
            return result.data;
        }
        throw new Error("None Data");
    })
    .then((data) => {
        if (!data.articleList || data.articleList.size == 0) {
            throw new Error("None Art Data");
        }
        return data.articleList;
    })
    .then((articles) => {
        return articles.map((article, idx) => {
            return { title: article.title, rank: idx + 1 };
        });
    })
    .then((result) => {
        for (let movieinfo of result) {
            console.log(`[${movieinfo.rank}위] ${movieinfo.title}`);
        }
    })
    .catch((err) => {
        console.log("Error");
        console.log(err);
    });