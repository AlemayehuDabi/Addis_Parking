import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(status?: string) {
    const query = status ? { status } : {};
    
    return await this.reservationModel
      .find(query)
      .populate('spotId', 'spotNumber') // Shows the spot name/number
      .populate('userId', 'fullName email') // Shows who booked it
      .sort({ startTime: -1 }) // Newest reservations at the top
      .limit(100)
      .exec();
  }

  async findLiveReservations () {
    const now = new Date()

    return await this.reservationModel.find({
      startTime: {$lte: now},
      endTime: {$gte: now},
      status: 'active'
    }).populate('spotId userId')
  }

  async findOne(id: string) {

    const isReservation = await this.reservationModel.findById(id)
    
    if(!isReservation){
      throw new NotFoundException(`Reservation with ID ${id} not found`)
    }

    return isReservation
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {

    const isUpdated = await this.reservationModel.findByIdAndUpdate(id, {
      status: updateReservationDto.status
    })

    if(!isUpdated){
      throw new NotFoundException(`Reservation with ID ${id} not found`)
    }

    return isUpdated
  }

  async remove(id: string) {
    const isUpdated = await this.reservationModel.findByIdAndUpdate(id, {
      status: "cancelled"
    })

    if(!isUpdated){
      throw new NotFoundException(`Reservation with ID ${id} not found`)
    }

    return isUpdated
  }
}
