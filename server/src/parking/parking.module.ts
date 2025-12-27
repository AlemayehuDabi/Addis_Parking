import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Spot, SpotSchema } from './parking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Spot.name, schema: SpotSchema } 
    ])],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
