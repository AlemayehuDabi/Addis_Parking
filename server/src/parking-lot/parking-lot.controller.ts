import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.create(createParkingLotDto);
  }

  @Get()
  findAll() {
    return this.parkingLotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingLotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParkingLotDto: UpdateParkingLotDto) {
    return this.parkingLotService.update(+id, updateParkingLotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingLotService.remove(+id);
  }
}
