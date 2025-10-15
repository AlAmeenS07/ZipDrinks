import { getAdminDataService } from "../../Services/Admin/adminDataService.js"

export const getAdminData = async (req , res)=>{
    await getAdminDataService(req , res)
}