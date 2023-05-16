import {Controller, Get} from "@nestjs/common"; // 필요한 함수 임포트, Controller와 Get은 대문자로 시작하지만 모두 함수이며 데코레이터이다.

@Controller() // 컨트롤러 데코레이터, @는 데코레이터를 선언하는 것
export class HelloController{ // 외부에서 사용하므로 export 사용, Controller 클래스는 Module에 포함되어야 하기에 export를 붙여서 다른 클래스에서 불러올 수 있게 함
    @Get() //GET 요청 처리 데코레이터, HTTP 요청 중 GET 방식의 요청을 처리
    hello(){
        return "Hello NEST JS!"
    }
}