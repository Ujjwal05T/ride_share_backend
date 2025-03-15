import mongoose, { Schema } from "mongoose";
import {  Ride } from "../types/types";

const RideSharingSchema:Schema<Ride> = new Schema({
   origin: { type: String, required: true },
   destination: { type: String, required: true },
   date: { type: Date, required: true },
   fare: { type: Number, required: true },
   coRiders: { type: [String], default: [] },
   seatsAvailable: { type: Number, required: true },
   description: { type: String, required: true }
});

const RideSharingModel =  (mongoose.models.Ride) || mongoose.model<Ride>('Ride', RideSharingSchema) ;

export default RideSharingModel;