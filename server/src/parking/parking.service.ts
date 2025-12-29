import { Injectable } from '@nestjs/common';
import { Spot, SpotStatus } from './parking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class ParkingService {
  // This lives in RAM. It's super fast.
  // Key: spotId (number), Value: isParked (boolean)
  private currentState = new Map<number, boolean>();

  // nosiy of utrasonic change - 4.9(parked) and 5.1(unparked) b/c of wind ...
  private lastChangeTime = new Map<number, number>();

  // schema constructor
  constructor(
    @InjectModel(Spot.name) private spotModel: Model<Spot> // Injecting the Model
  ) {}

  // checking if the value changed
  async processStatusUpdate(sensorId: number, isParked: boolean) {
    const lastState = this.currentState.get(sensorId);
    const now = Date.now();
  
    if (isParked !== lastState) {
      // A change is detected, but let's wait to ensure it's not a glitch
      const lastTime = this.lastChangeTime.get(sensorId) || 0;
      
      if (now - lastTime > 2000) { // Only update if 5 seconds have passed since last flip
        this.currentState.set(sensorId, isParked);
        this.lastChangeTime.set(sensorId, now);
        await this.saveToDatabase(sensorId, isParked);
        return { changed: true };
      }
    }

    return { changed: false };
  }

  // save it inside db
  private async saveToDatabase(sensorId: number, isParked: boolean) {
    // Update the current status of the spot
    const updatedSpot = await this.spotModel.findOneAndUpdate(
      { sensorId }, // Find by the Arduino's sensor ID
      { 
        $set: { 
          isHardwareDetected: isParked,
          status: isParked ? SpotStatus.OCCUPIED : SpotStatus.AVAILABLE,
          lastHeartbeat: new Date()
        },
        // prevent spotnumber duplication
        $setOnInsert: {
          spotNumber: `S-${sensorId}`
        }
      },
      { new: true, upsert: true } // 'upsert' creates it if it doesn't exist
    );

    return updatedSpot;
  }
}
