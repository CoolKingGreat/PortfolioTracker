import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({"message": "Username and password are required."})
        }

        const existing = await prisma.user.findUnique({
            where: { username: username }
        });

        if (existing){
            return res.status(409).json({"message": "Username already taken."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPass
            }
        });

        const payload = {
            id: newUser.id,
            username: newUser.username
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "7d",
        });

        res.status(201).json({ token });

    } catch (error) { 
        console.error("Registration error", error);
        return res.status(500).json({"message": "Error during registration"})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({"message": "Username and password are required."})
        }

        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user){
            return res.status(400).json({"message": "Username not found."})
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match){
            return res.status(401).json({"message": "Invalid credentials"})
        }
        
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "7d",
        });

        res.status(200).json({ token });

    } catch (error) { 
        console.error("Login error", error);
        return res.status(500).json({"message": "Error during login"})
    }
}


export const getMe = async (req: any, res: any) => {
    res.status(200).json(req.user);
};