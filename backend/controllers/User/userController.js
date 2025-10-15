// import userModel from "../../models/userModel.js";

// export const getUserData = async(req , res)=>{
//     try {

//         const userId = req.userId;

//         const user = await userModel.findById(userId)

//         if(!user){
//             return res.json({success : false , message : "User not found"})
//         }
        
//         res.json({success : true , userData : {fullname : user.fullname , email : user.email , isAdmin : user.isAdmin ,  isBlocked : user.isBlocked , isVerified : user.isVerified }})
        
//     } catch (error) {
//         res.json({success : false , message : error.message})
//     }
// }


import { getUserDataService } from "../../Services/User/userDataService.js";

export const getUserData = async (req, res) => {
    await getUserDataService(req, res);
}
