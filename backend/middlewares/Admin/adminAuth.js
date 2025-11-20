import jwt from "jsonwebtoken"
import userModel from "../../models/userModel.js";
import { UNAUTHORIZED } from "../../utils/constants.js";

export const getAdminId = async (req , res , next)=>{
      const adminAccessToken = req.headers?.authorization?.split(" ")[1];
    
        if(!adminAccessToken){
            return res.status(UNAUTHORIZED).json({success : false , message : "Not Authorized"})
        }
    
        try {
            
            const tokenDecode = jwt.verify(adminAccessToken , process.env.JWT_SECRET);
    
            if(tokenDecode.id){
                req.userId = tokenDecode.id
            }else{
                return res.status(UNAUTHORIZED).json({success : false , message : "Not Authorized"})
            }

            const user = await userModel.findById(tokenDecode.id)
    
            next()
    
        } catch (error) {
            return res.status(UNAUTHORIZED).json({success : false , message : error.message})
        }
}