import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  } | null;
}

interface MyJwtPayload extends JwtPayload {
  id: string;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1]

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error("JWT_SECRET is not defined in environment variables.");
                return res.status(500).json({ message: "Server configuration error." });
            }
            const decoded = jwt.verify(token!, secret!) as unknown as MyJwtPayload;

            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true },
            });

            if (!req.user) {
                return res.status(401).json({ message: 'User not found.' });
            }
            next()

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed.'});
        }
    }

    if(!token){
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
}