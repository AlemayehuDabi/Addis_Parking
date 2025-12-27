import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingDto } from './create-parking.dto';

export class UpdateParkingDto extends PartialType(CreateParkingDto) {}
