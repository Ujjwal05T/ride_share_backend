import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
	res.send("Successfully Connected with Typescript");
});

app.listen(PORT, () => {
	console.log(`Server is running at port : ${PORT}`);
});
