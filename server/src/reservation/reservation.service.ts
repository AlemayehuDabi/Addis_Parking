import { ConflictException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './reservation.schema';
import { Model, now } from 'mongoose';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { error } from 'console';

@Injectable()
export class ReservationService {

  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation> // Injecting the Model
  ) {}

  
  async create(session: UserSession, createReservationDto: CreateReservationDto) {

    const {spotId, startTime, endTime, licensePlate} = createReservationDto
    const userId = session.user.id

    // 1. Conflict Check: Find any reservation that OVERLAPS with this range
    const existingConflict = await this.reservationModel.findOne({
      spotId: spotId,
      status: { $in: ['pending', 'active'] }, // Ignore cancelled/expired ones
      $and: [
        { startTime: { $lt: endTime } },   // Existing starts before new one ends
        { endTime: { $gt: startTime } }    // Existing ends after new one starts
      ]
    });

    if (existingConflict) {
      throw new ConflictException("This spot is already booked for the selected time.");
    }

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
