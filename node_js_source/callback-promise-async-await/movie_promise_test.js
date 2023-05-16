const axios = require("axios"); //axios import

//영화 순위 정보 url
const url = "https://raw.githubusercontent.com/wapj/musthavenodejs/main/movieinfo.json";

axios
    .get(url) //get 요청
    .then((result) => { // 결과값 처리
        if (result.status != 200) { //연결이 실패일 경우 에러 발생
            throw new Error("Failed");
        }

        if (result.data) { //result.data가 있는경우 
            return result.data; // data를 return
        }
        throw new Error("None Data"); // data가 없는 경우
    })
    .then((data) => { //위 result.data에서 받는 data 처리
        if (!data.articleList || data.articleList.size == 0) { // return data가 0이면 에러
            throw new Error("None Art Data");
        }
        return data.articleList; // 영화 리스트 return
    })
    .then((articles) => {
        return articles.map((article, idx) => { // 영화 리스트를 제목과 순위 정보로 분리
            return { title: article.title, rank: idx + 1 };
        });
    })
    .then((result) => { // 받은 영화 리스트 정보 출력
        for (let movieinfo of result) {
            console.log(`[${movieinfo.rank}위] ${movieinfo.title}`);
        }
    })
    .catch((err) => { // 중간에 발생한 에러들을 처리하는 곳
        console.log("Error");
        console.log(err);
    });