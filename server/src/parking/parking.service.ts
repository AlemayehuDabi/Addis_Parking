import { Injectable } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';

@Injectable()
export class ParkingService {
  park(createParkingDto: CreateParkingDto) {
    return 'This action adds a new parking';
  }

  reserve(reserveParkingDto: ReserveParkingDto){

  }

  findAll() {
    return `This action returns all parking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parking`;
  }

  update(id: number, updateParkingDto: UpdateParkingDto) {
    return `This action updates a #${id} parking`;
  }

  remove(id: number) {
    return `This action removes a #${id} parking`;
  }
}
