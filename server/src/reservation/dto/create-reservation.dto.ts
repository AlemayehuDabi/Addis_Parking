import { ReservationStatus } from "../reservation.schema"

export class CreateReservationDto {
    spotId: string
    lotId: string
    startTime: string
    endTime: string
    licensePlate: string
    status?:ReservationStatus
}
