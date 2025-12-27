import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './reservation.schema';
import { Model, now } from 'mongoose';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation> // Injecting the Model
  ) {}

  
  async create(session: UserSession, createReservationDto: CreateReservationDto) {
    return await this.reservationModel.create({
      userId: session.user.id,
      spotId: createReservationDto.spotId,
      startTime: createReservationDto.startTime,
      endTime: createReservationDto.endTime,
      licensePlate: createReservationDto.licensePlate
    })
  }

  findAll() {
    return `This action returns all reservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return await this.reservationModel.findByIdAndUpdate(id, {
      status: updateReservationDto.status
    }) 
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
