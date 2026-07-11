import { sign } from "jsonwebtoken"

const createAccessToken = (userId: string) => {
    return sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: "15m" });
}

const createRefreshToken = (userId: string) => {
    return sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: "7d" });
}

export { createAccessToken, createRefreshToken }