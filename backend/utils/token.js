import jwt from "jsonwebtoken"

export const genAccessToken = (id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "24h"})
}

export const genRefreshToken = (id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "7d"})
}