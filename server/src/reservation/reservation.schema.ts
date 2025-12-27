import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export enum ReservationStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
  }
  
  @Schema({ timestamps: true })
  export class Reservation extends Document {
    @Prop({ type: 'ObjectId', ref: 'User', required: true })
    userId: string;
  
    @Prop({ type: 'ObjectId', ref: 'Spot', required: true })
    spotId: string;
  
    @Prop({ required: true })
    startTime: Date;
  
    @Prop({ required: true })
    endTime: Date;
  
    @Prop({ type: String, enum: ReservationStatus, default: ReservationStatus.PENDING })
    status: ReservationStatus;
  
    @Prop()
    licensePlate: string; // For verification
  }
  
  export const ReservationSchema = SchemaFactory.createForClass(Reservation);