import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ParkingModule } from './parking/parking.module';
import { ReservationModule } from './reservation/reservation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { ParkinglotModule } from './parkinglot/parkinglot.module';
import { ParkingLotModule } from './parking-lot/parking-lot.module';

import * as dotenv from "dotenv";

// 1. Load the .env file immediately
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// 2. Check if it exists
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    AuthModule,
    ParkingModule,
    ReservationModule,
    ParkingLotModule,
    ParkinglotModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
