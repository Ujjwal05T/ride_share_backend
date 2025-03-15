import { Request, Response } from "express";

import { Profile } from "../types/types";
import ProfileModel from "../models/profileModel";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { username }:Profile = req.user;
    if (!username) {
      res.status(400).json({
        success: false,
        message: "Username is required",
      });
      return
    }
    const profile = await ProfileModel.findOne({
      username,
    });
    console.log("Profile", profile);
    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched profile Successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error("Error fetching profile", error);
    res.status(500).json({
      success: false,
      message: "Error Fetching User profile",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
   try {
     const { username, email, fullName, phone } = req.body;
 
     // Validate required fields
     if (!username || !email || !fullName) {
       res.status(400).json({
         success: false,
         message: "Username, email, and fullName are required",
       });
       return;
     }
 
     // Check if profile exists
     let profile = await ProfileModel.findOne({ username });
 
     if (profile) {
       // Update existing profile
       profile.email = email || profile.email;
       profile.fullName = fullName || profile.fullName;
       profile.phone = phone || profile.phone;
 
       await profile.save();
 
       res.status(200).json({
         success: true,
         message: "Profile updated successfully",
         data: { profile },
       });
       return;
     } else {
       // Create new profile
       const newProfile = new ProfileModel({
         username,
         email,
         fullName,
         phone: phone || "",
         rating: 0,
         history: []
       });
 
       await newProfile.save();
 
       res.status(201).json({
         success: true,
         message: "Profile created successfully",
         data: { profile: newProfile },
       });
       return;
     }
   } catch (error) {
     console.error("Error updating profile:", error);
     res.status(500).json({
       success: false,
       message: "Error updating user profile",
     });
     return;
   }
 };