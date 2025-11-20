import bannerModel from "../../models/bannerModel.js"


export const getMainBannerService = async()=>{
    try {

        const banners = await bannerModel.find({isListed : true})

        if(!banners){
            return false
        }

        return banners
        
    } catch (error) {
        return false
    }
}