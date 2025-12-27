import { Injectable } from '@nestjs/common';
import { CreateParkingDto, ReserveParkingDto } from './dto/create-parking.dto';
import { ParkingStatusDto, UpdateParkingDto } from './dto/update-parking.dto';

@Injectable()
export class ParkingService {
  // This lives in RAM. It's super fast.
  // Key: spotId (number), Value: isParked (boolean)
  private currentState = new Map<number, boolean>();

  // nosiy of utrasonic change - 4.9(parked) and 5.1(unparked) b/c of wind ...
  private lastChangeTime = new Map<number, number>();

  park(createParkingDto: CreateParkingDto) {
    return 'This action adds a new parking';
  }

  reserve(reserveParkingDto: ReserveParkingDto){
    return `this is the reserve`
  }

  // checking if the value changed
  async processStatusUpdate(spotId: number, isParked: boolean) {
    const lastState = this.currentState.get(spotId);
    const now = Date.now();
  
    if (isParked !== lastState) {
      // A change is detected, but let's wait to ensure it's not a glitch
      const lastTime = this.lastChangeTime.get(spotId) || 0;
      
      if (now - lastTime > 2000) { // Only update if 5 seconds have passed since last flip
        this.currentState.set(spotId, isParked);
        this.lastChangeTime.set(spotId, now);
        await this.saveToDatabase(spotId, isParked);
        return { changed: true };
      }
    }

    return { changed: false };
  }

  // save it inside db
  private async saveToDatabase(spotId: number, isParked: boolean) {
    // Update the current status of the spot
    await this.prisma.spot.update({
      where: { id: spotId },
      data: { status: isParked ? 'OCCUPIED' : 'AVAILABLE' },
    });
  }

  findAll() {
    return `This action returns all parking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parking`;
  }

  update(id: number, updateParkingDto: UpdateParkingDto) {
    return `This action updates a #${id} parking`;
  }

  remove(id: number) {
    return `This action removes a #${id} parking`;
  }
}
