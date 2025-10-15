import jwt from "jsonwebtoken";


export const userAuth = async (req , res , next)=>{

    const {token} = req.cookies;
    if(!token){
        return res.json({success : false , message : "Not Authorized"})
    }

    try {
        
        const tokenDecode = jwt.verify(token , process.env.JWT_SECRET);

        if (!tokenDecode.id){
            return res.json({ success: false, message: "Not Authorized" });
        }

        req.body.userId = tokenDecode.id;

        next()

    } catch (error) {
        console.log("this error")
        return res.json({success : false , message : error.message})
    }
}


export const verifyTempToken = async (req,res,next)=>{
    const { tempToken } = req.cookies;

    if(!tempToken){
        return res.json({success : false , message : "You time out"})
    }

    try {

        const tokenDecode = jwt.verify(tempToken , process.env.JWT_SECRET);

        if(tokenDecode.email){
            req.body.email = tokenDecode.email
        }else{
            return res.json({success : false , message : "Your time out"})
        }

        next()        
        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}

export const getUserId = async(req , res , next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success : false , message : "Not Authorized"})
    }

    try {
        
        const tokenDecode = jwt.verify(token , process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.json({success : false , message : "Not Authorized"})
        }

        next()

    } catch (error) {
        return res.json({success : false , message : error.message})
    }

}
