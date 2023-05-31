import http from "k6/http" //K6로 성능 테스트

export const options = { //테스트 옵션
    vus: 10000, // 100명이
    duration: "1s", //10초 동안 계속 요청을 보내는 설정
};

export default function (){
    http.get("https://lighttiger.shop/blog/11/"); // 성능 테스트를 위한 주소
}