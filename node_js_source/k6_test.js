import http from "k6/http" //K6로 성능 테스트

export const options = { //테스트 옵션
    vus: 100, // 100명이
    duration: "10s", //10초 동안 계속 요청을 보내는 설정
};

export default function (){
    http.get("http://localhost:3000"); // 성능 테스트를 위한 주소
}