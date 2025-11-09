"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ "message": "Username and password are required." });
        }
        const existing = await prisma_1.prisma.user.findUnique({
            where: { username: username }
        });
        if (existing) {
            return res.status(409).json({ "message": "Username already taken." });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPass = await bcryptjs_1.default.hash(password, salt);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                username: username,
                password: hashedPass
            }
        });
        const payload = {
            id: newUser.id,
            username: newUser.username
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({ token });
    }
    catch (error) {
        console.error("Registration error", error);
        return res.status(500).json({ "message": "Error during registration" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ "message": "Username and password are required." });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { username: username }
        });
        if (!user) {
            return res.status(400).json({ "message": "Username not found." });
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ "message": "Invalid credentials" });
        }
        const payload = {
            id: user.id,
            username: user.username
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ "message": "Error during login" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map