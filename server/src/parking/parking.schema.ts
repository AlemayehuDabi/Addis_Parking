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
  spotNumber: string; // e.g., "S-1", "S-2"

  @Prop({ required: true, unique: true })
  sensorId: number; // 1 or 2

  @Prop({ type: String, enum: SpotStatus, default: SpotStatus.AVAILABLE })
  status: SpotStatus;

  @Prop({ default: false })
  isHardwareDetected: boolean;

  @Prop()
  lastHeartbeat: Date;
}

export const SpotSchema = SchemaFactory.createForClass(Spot);
