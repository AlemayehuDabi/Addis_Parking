import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SpotStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true })
export class Spot extends Document {
  @Prop({ required: true, unique: true })
  spotNumber: string; // e.g., "s-1", "s-2"

  @Prop({ required: true, unique: true })
  sensorId: number; // The ID sent by the Arduino (e.g., 1, 2, 3)

  @Prop({ type: String, enum: SpotStatus, default: SpotStatus.AVAILABLE })
  status: SpotStatus;

  @Prop({ default: false })
  isHardwareDetected: boolean; // True if sensor sees a car, False if empty

  @Prop()
  lastHeartbeat: Date; // To check if the Arduino is still online
}

export const SpotSchema = SchemaFactory.createForClass(Spot);