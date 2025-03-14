import mongoose , { Schema } from 'mongoose';
import  { User }  from '../types/types'

const UserSchema:Schema<User> = new Schema({
   username: {type: String, required: [true, 'Username is required'],trim: true,unique: true},
   email: {type: String, required: [true, 'Email is required'],unique: true,match: [/\S+@\S+\.\S+/, 'Please enter a valid email']},
   password: {type: String, required: [true, 'Password is required']},
   verifyCode: {type: String, required: [true, 'Verification code is required']},
   isVerified: {type: Boolean, default: false},
   verifyCodeExpiry: {type: Date, required: true, default: Date.now}
});

const UserModel =  (mongoose.models.User) || mongoose.model<User>('User', UserSchema) ;

export default UserModel;