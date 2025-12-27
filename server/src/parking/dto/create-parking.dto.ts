export class CreateParkingDto {
    id: string
    parkingLocation: string
    parkingSpot: string
}

export class ReserveParkingDto {
    id: string
    parkingLocation: string
    parkingSpot: string
    driveName: string
}