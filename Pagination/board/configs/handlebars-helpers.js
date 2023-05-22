module.exports={
    lengthOfList:(list=[]) => list.length, // 리스트 길이 반환
    eq:(val1, val2) => val1===val2, // 두 값을 비교해 같은지 여부를 반환
    dateString:(isoString)=> new Date(isoString).toLocaleDateString(), // ISO 날짜 문자열에서 날짜만 반환
    // ISO 날짜 문자열 2023-05-22T13:50:24.654Z형태
};