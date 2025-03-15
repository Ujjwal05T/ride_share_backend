import { Request, Response } from "express";
import RideSharingModel from "../models/rideModel";
import ProfileModel from "../models/profileModel";


export const getRides = async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query;
    
    // Validate required parameters
    if (!origin && !destination) {
      res.status(400).json({
        success: false,
        message: "Please provide origin and destination"
      });
      return
    }
    
    let query: any = {};
    
    if (origin) {
      query.origin = { $regex: new RegExp(String(origin), 'i') };
    }
    
    if (destination) {
      query.destination = { $regex: new RegExp(String(destination), 'i') };
    }
    
    // Find rides directly from the RideSharingModel
    const rides = await RideSharingModel.find(query);
    
    res.status(200).json({
      success: true,
      message: "Rides fetched successfully",
      data: {
        rides,
        count: rides.length
      }
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching rides"
    });
  }
};

export const offerRide = async (req: Request, res: Response) => {
   try {
     const { origin, destination, date, fare, seatsAvailable, description } = req.body;
     const { username } = req.user;
 
     // Validate required fields
     if (!origin || !destination || !date || !fare || seatsAvailable === undefined) {
       res.status(400).json({
         success: false,
         message: "Please provide all required ride details"
       });
       return
     }
 
     if (fare <= 0) {
       res.status(400).json({
         success: false,
         message: "Fare must be greater than zero"
       });
       return
     }
 
     if (seatsAvailable < 1) {
       res.status(400).json({
         success: false,
         message: "Seats available must be at least 1"
       });
       return
     }
 
     // Create new ride
     const newRide = new RideSharingModel({
       origin,
       destination,
       date: new Date(date),
       fare,
       seatsAvailable,
       description: description || "",
       driver: username,
       coRiders: []
     });
 
     // Save the ride
     await newRide.save();
 
     // Update the user's profile to reflect they've offered a ride
     await ProfileModel.findOneAndUpdate(
       { username },
       { 
         $inc: { totalRides: 1 },
         $push: { history: newRide }
       }
     );
 
     res.status(201).json({
       success: true,
       message: "Ride offered successfully",
       data: {
         ride: newRide
       }
     });
   } catch (error) {
     console.error("Error offering ride:", error);
     res.status(500).json({
       success: false,
       message: "Error offering ride"
     });
   }
 };

export const requestRide = async (req: Request, res: Response) => {
   try {
     const { rideId } = req.params;
     const { username } = req.user;
 
     // Find the ride
     const ride = await RideSharingModel.findById(rideId);
 
     if (!ride) {
       return res.status(404).json({
         success: false,
         message: "Ride not found"
       });
     }
 
     // Check if there are seats available
     if (ride.seatsAvailable < 1) {
       return res.status(400).json({
         success: false,
         message: "No seats available for this ride"
       });
     }
 
 
     // Add the request to the ride's pending requests
     if (!ride.pendingRequests) {
       ride.pendingRequests = [username];
     } else {
       ride.pendingRequests.push(username);
     }
 
     await ride.save();
 
     res.status(200).json({
       success: true,
       message: "Ride request sent successfully",
       data: { ride }
     });
   } catch (error) {
     console.error("Error requesting ride:", error);
     res.status(500).json({
       success: false,
       message: "Error requesting ride"
     });
   }
 };
 
 export const acceptRideRequest = async (req: Request, res: Response) => {
   try {
     const { rideId, requestUsername } = req.params;
     const { username } = req.user;
 
     // Find the ride
     const ride = await RideSharingModel.findById(rideId);
 
     if (!ride) {
       return res.status(404).json({
         success: false,
         message: "Ride not found"
       });
     }
 
     // Check if the requested user is in the pending requests
     if (!ride.pendingRequests || !ride.pendingRequests.includes(requestUsername)) {
       return res.status(404).json({
         success: false,
         message: "Request not found in pending requests"
       });
     }
 
     // Check if there are seats available
     if (ride.seatsAvailable < 1) {
       return res.status(400).json({
         success: false,
         message: "No seats available for this ride"
       });
     }
 
     // Remove from pending requests
     ride.pendingRequests = ride.pendingRequests.filter(user => user !== requestUsername);
     
     // Add to co-riders
     ride.coRiders.push(requestUsername);
     
     // Decrease available seats
     ride.seatsAvailable--;
 
     await ride.save();
 
     // Update the passenger's ride history
     await ProfileModel.findOneAndUpdate(
       { username: requestUsername },
       { 
         $inc: { totalRides: 1 },
         $push: { history: ride }
       }
     );
 
     res.status(200).json({
       success: true,
       message: "Ride request accepted successfully",
       data: { ride }
     });
   } catch (error) {
     console.error("Error accepting ride request:", error);
     res.status(500).json({
       success: false,
       message: "Error accepting ride request"
     });
   }
 };