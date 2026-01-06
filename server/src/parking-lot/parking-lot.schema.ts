import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class ParkingLot extends Document {
    @Prop({required: true, index: true})
    name: String

    @Prop({required: true})
    adress: String

    @Prop({default: 0})
    totalSpot: number

    @Prop({default: 0})
    avaliableSpot: number

    @Prop({required: true})
    pricePerHour: number
}

export const ParkingLotSchema = SchemaFactory.createForClass(ParkingLot);

