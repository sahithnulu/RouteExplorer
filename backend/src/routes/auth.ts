import express from "express";
import pool from "../db";
import bcrypt from "bcrypt";

import { createAccessToken, createRefreshToken } from '../utils/token';

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length > 0){
            return res.status(400).json({ message: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userID = await pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id", [email, hashedPassword]);
            const accessToken = createAccessToken(userID.rows[0].id);
            const refreshToken = createRefreshToken(userID.rows[0].id);

            res.status(201).json({ message: "User registered successfully" , accessToken, refreshToken });
        }

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0){
            return res.status(400).json({ message: "User does not exist" });
        } else {
            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const accessToken = createAccessToken(user.id);
            const refreshToken = createRefreshToken(user.id);
            
            res.status(200).json({ message: "Login successful", accessToken, refreshToken });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default authRouter;