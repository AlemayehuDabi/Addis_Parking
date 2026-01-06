import { Injectable } from '@nestjs/common';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';

@Injectable()
export class ParkingLotService {
  create(createParkingLotDto: CreateParkingLotDto) {
    return 'This action adds a new parkingLot';
  }

  findAll() {
    return `This action returns all parkingLot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parkingLot`;
  }

  update(id: number, updateParkingLotDto: UpdateParkingLotDto) {
    return `This action updates a #${id} parkingLot`;
  }

  remove(id: number) {
    return `This action removes a #${id} parkingLot`;
  }
}
