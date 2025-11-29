import { getMainBannerService } from "../../Services/User/bannerService.js"
import { BANNER_FETCHED_SUCCESSFULLY, BANNER_NOT_FOUND, NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"

// get Banners

export const getMainBanner = async(req , res)=>{
    try {

        const banners = await getMainBannerService()

        if(!banners){
            return res.status(NOT_FOUND).json({success : false , message : BANNER_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : BANNER_FETCHED_SUCCESSFULLY , banners})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}