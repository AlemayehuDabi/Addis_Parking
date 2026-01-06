import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class ParkingLot extends Document {
    @Prop({ required: true, index: true })
    name: string;

    // Fixed typo from "adress" to "address"
    @Prop({ required: true })
    address: string;

    @Prop({ default: 0 })
    totalSpots: number;

    @Prop({ default: 0 })
    availableSpots: number;

    @Prop({ required: true })
    pricePerHour: number;

    @Prop({ default: 0 })
    rating: number;

    /**
     * INDUSTRY STANDARD: GeoJSON Point
     * This allows for geospatial queries like "find within 5km"
     */
    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    })
    location: {
        type: string;
        coordinates: number[];
    };

    @Prop({
        type: [{
            id: Number,
            row: String,
            status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
            sensorId: String
        }],
        default: []
    })
    slots: any[];
}

export const ParkingLotSchema = SchemaFactory.createForClass(ParkingLot);

// CRITICAL: Add the geospatial index to enable distance-based searching
ParkingLotSchema.index({ location: '2dsphere' });