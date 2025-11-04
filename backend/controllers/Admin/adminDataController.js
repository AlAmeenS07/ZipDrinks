import { getAdminDataService } from "../../Services/Admin/adminDataService.js"

// Admin data
export const getAdminData = async (req , res)=>{
    await getAdminDataService(req , res)
}