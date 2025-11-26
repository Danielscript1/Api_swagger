import { Request } from "express";
import { getClientIp } from "./getClientIp";
import { redisClient } from "../cache/redisClient";

const SIGNUP_PREFIX = 'signup-ip:'
const SIGNUP_WINDOW_SECONDS = 60 * 60 // 1h
const SIGNUP_MAX = 3

export async function checkSignupRateLimit(req:Request){
    const ip = getClientIp(req)
    const {email} = req.body
    const key = `${SIGNUP_PREFIX}_${email}:${ip}`
    const count = await redisClient.incr(key)

    if (count == 1){
         await redisClient.expire(key, SIGNUP_WINDOW_SECONDS)
    }

    if(count >SIGNUP_MAX){
        const err: any = new Error('RATE_LIMIT_SIGNUP')
        err.statusCode = 429
        throw err
    }
}