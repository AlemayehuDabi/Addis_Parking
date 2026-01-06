import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingLotDto } from './create-parking-lot.dto';

export class UpdateParkingLotDto extends PartialType(CreateParkingLotDto) {}
