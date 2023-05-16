import { Module } from "@nestjs/common";
import { HelloController } from "./hello.contoller";

@Module({
    controllers:[HelloController],
})
export class HelloModule{}