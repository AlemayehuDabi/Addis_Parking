import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from '../reservation.schema';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    status: ReservationStatus
}
