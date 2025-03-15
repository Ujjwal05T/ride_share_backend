import mongoose, { Schema } from "mongoose";
import { Profile, Ride } from "../types/types";

const RideSchema = new Schema<Ride>({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  fare: { type: Number, required: true },
  coRiders: { type: [String], default: [] }
});

const ProfileSchema: Schema<Profile> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  fullName: {
    type: String,
    default: "",
  },
  phone: { 
    type: String, 
    default: ""
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  totalRides: { 
    type: Number, 
    default: 0 
  },
  history: { 
    type: [RideSchema], 
    default: [] 
  }
});

const ProfileModel =
  mongoose.models.Profile ||
  mongoose.model<Profile>("Profile", ProfileSchema);

export default ProfileModel;