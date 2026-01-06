import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum ReservationStatus {
  PENDING = 'pending',    // Booked but not yet arrived
  ACTIVE = 'active',      // Car is physically in the spot
  COMPLETED = 'completed', // Car has left
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'     // User never showed up (No-show)
}
  
  @Schema({ timestamps: true })
  export class Reservation extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;
  
    @Prop({ type: Types.ObjectId, ref: 'ParkingSpot', required: true, index: true })
    spotId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'ParkingLot', required: true })
    parkingLotId: Types.ObjectId; // Denormalized for faster query performance
  
    @Prop({ required: true })
    startTime: Date;
  
    @Prop({ required: true })
    endTime: Date;

    @Prop()
    actualEntryTime: Date; // Populated when Arduino detects car

    @Prop()
    actualExitTime: Date; // Populated when Arduino detects car leaving
  
    @Prop({ type: String, enum: ReservationStatus, default: ReservationStatus.PENDING })
    status: ReservationStatus;

    @Prop({ default: 0 })
    totalFee: number;
  
    @Prop()
    licensePlate: string; // For verification
  }
  
  export const ReservationSchema = SchemaFactory.createForClass(Reservation);