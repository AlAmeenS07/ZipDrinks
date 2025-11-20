import { getMainBannerService } from "../../Services/User/bannerService.js"
import { NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"


export const getMainBanner = async(req , res)=>{
    try {

        const banners = await getMainBannerService()

        if(!banners){
            return res.status(NOT_FOUND).json({success : false , message : "Banner not found !"})
        }

        res.status(SUCCESS).json({success : true , message : "Banner fetched successfully" , banners})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}