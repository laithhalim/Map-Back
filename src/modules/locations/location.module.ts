import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { LocationController } from "./controllers/location.controllers";
import { LocationService } from "./services/location.service";
import { Location } from "./entities/location.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Location]),AuthModule],
    controllers:[LocationController],
    providers:[LocationService],
})
export class LocationModule{}