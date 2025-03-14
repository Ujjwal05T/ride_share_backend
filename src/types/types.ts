export interface User {
   username: string;
   email: string;
   password: string;
   verifyCode: string;
   isVerified: boolean;
   verifyCodeExpiry: Date;
}

export interface JwtPayload {
   userId: string;
   email: string;
   username: string;
}

export interface Profile {
   username: string;
   email: string;
   fullName: string;
   phone: string;
   rating: number;
   history: Ride[];
}

export interface Ride {
   origin: string;
   destination: string;
   date: Date;
   fare: number;
   cotravelers: string[];
}