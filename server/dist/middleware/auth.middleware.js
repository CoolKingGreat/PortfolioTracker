"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error("JWT_SECRET is not defined in environment variables.");
                return res.status(500).json({ message: "Server configuration error." });
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true },
            });
            if (!req.user) {
                return res.status(401).json({ message: 'User not found.' });
            }
            next();
        }
        catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.middleware.js.map