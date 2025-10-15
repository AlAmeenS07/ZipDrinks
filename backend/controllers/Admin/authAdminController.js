import { adminLoginService, adminLogoutService } from "../../Services/Admin/adminAuthService.js"

export const adminLogin = async (req , res)=>{
    await adminLoginService(req , res)
}

export const adminLogout = async (req , res)=>{
    await adminLogoutService(req , res)
}