import { adminLoginService, adminLogoutService } from "../../Services/Admin/adminAuthService.js"

// admin login
export const adminLogin = async (req , res)=>{
    await adminLoginService(req , res)
}

// admin logout
export const adminLogout = async (req , res)=>{
    await adminLogoutService(req , res)
}