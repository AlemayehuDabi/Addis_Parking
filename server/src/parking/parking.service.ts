import { Injectable } from '@nestjs/common';
import { Spot, SpotStatus } from './parking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ParkingService {
  private currentState = new Map<number, boolean>();
  private lastChangeTime = new Map<number, number>();

  constructor(@InjectModel(Spot.name) private spotModel: Model<Spot>) {}

  async processStatusUpdate(
    sensorId: number,
    isParked: boolean,
  ): Promise<boolean> {
    const lastState = this.currentState.get(sensorId);
    const now = Date.now();

    // 1. If the state is exactly the same as RAM, do nothing
    if (isParked === lastState) return false;

    // 2. Debounce logic: prevent flickering if the car is moving or sensor is noisy
    const lastTime = this.lastChangeTime.get(sensorId) || 0;
    if (now - lastTime < 2000) return false; // 2 second "cooldown"

    // 3. Update RAM state
    this.currentState.set(sensorId, isParked);
    this.lastChangeTime.set(sensorId, now);

    // 4. Save to DB
    await this.saveToDatabase(sensorId, isParked);

    return true; // Return true so the gateway knows to broadcast
  }

  private async saveToDatabase(sensorId: number, isParked: boolean) {
    return await this.spotModel.findOneAndUpdate(
      { sensorId },
      {
        $set: {
          isHardwareDetected: isParked,
          status: isParked ? SpotStatus.OCCUPIED : SpotStatus.AVAILABLE,
          lastHeartbeat: new Date(),
        },
        // IMPORTANT: This only runs when a NEW spot is created (Upsert)
        // This prevents the "spotNumber: null" duplicate error!
        $setOnInsert: {
          spotNumber: `S-${sensorId}`,
        },
      },
      { new: true, upsert: true },
    );
  }
}
