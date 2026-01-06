import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';

@Module({
  controllers: [ParkingLotController],
  providers: [ParkingLotService],
})
export class ParkingLotModule {}
