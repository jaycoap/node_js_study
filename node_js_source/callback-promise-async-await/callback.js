const DB = []

/*Promise는 각각 이행, 거정, 대기 3가지로 나뉘며,
어느 시점에 실행 시키기 위해 사용되는 것*/

function saveDB(user) {
    const beforeDB = DB.length+1;
    DB.push(user);
    console.log(`save ${user.name} to DB`);
    return new Promise((resolve, reject) => {
        if (DB.length > beforeDB) {
            resolve(user); // Promise 객체 반환
        } else {
            reject(new Error("Save DB error")); //실패 시 에러 발생
        }
    });
}

function sendEmail(user) {
    console.log(`email to ${user.email}`);
    return new Promise((resolve) => { // Promise 객체를 반환, 실패 처리가 없음
        resolve(user);
    });
}

function getResult(user) {
    return new Promise((resolve, reject) => { //Promise 객체 반환
        resolve(`success register ${user.name}`); // 성공 시 성공 메세지와 유저명 반환
    });
}

// then을 사용함으로써 호출되는 함수를 순서대로 호출
function registerByPromise(user) {
    //비동기 호출이지만, 순서를 지켜서 실행
    const result = saveDB(user)
    .then(sendEmail)
    .then(getResult)
    .catch(error => new Error(error))
    .finally(()=>console.log("finish"));//성공, 실패 여부에 관계없이 실행
    console.log(result); // 아직 완료되지 않았음으로 지연(panding) 상태
    return result;
}

const myUser = { email: "", password: "", name: "" };
const result = registerByPromise(myUser);
//결과 값이 Promise이기에 then()메소드에 함수를 넣어 결과 값을 볼 수 있음.
result.then(console.log);

//const allResult = Promise.all([saveDB(myUser), sendEmail(myUser), getResult(myUser)]);
//allResult.then(console.log);
