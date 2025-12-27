import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from 'lib/auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AuthenticationModule } from './auth/auth.module';
import { ParkingModule } from './parking/parking.module';
import { ReservationModule } from './reservation/reservation.module';
import { MongooseModule } from '@nestjs/mongoose';

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
    AuthModule.forRoot({auth}),
    AuthenticationModule,
    ParkingModule,
    ReservationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
