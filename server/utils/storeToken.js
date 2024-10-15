import redis from "../lib/redis.js"

export const storeToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken_${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7)
}

export const storeTokenInCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 * 1000
    })
}