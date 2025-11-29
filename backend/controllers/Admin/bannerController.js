import { addBannerService, deleteBannerService, editBannerService, getBannerService, getSingleBannerService, listUnlistBannerService } from "../../Services/Admin/bannerService.js"
import { BAD_REQUEST, BANNER_CREATED_SUCCESSFULLY, BANNER_DELETED_SUCCESSFULLY, BANNER_FETCHED_SUCCESSFULLY, BANNER_NOT_FOUND, BANNER_UPDATED_SUCCESSFULLY, CREATED, NOT_FOUND, SERVER_ERROR, SOMETHING_WENT_WRONG, SUCCESS } from "../../utils/constants.js"


export const addBanner = async (req, res) => {
    const { title, description, image } = req.body

    try {

        // if (!title || !description || !image) {
        //     return res.status(BAD_REQUEST).json({ success: false, message: "Missing fields !" })
        // }

        const banner = await addBannerService(title, description, image)

        if (!banner) {
            return res.status(NOT_FOUND).json({ success: false, message: BANNER_NOT_FOUND })
        }

        res.status(CREATED).json({success : true , message : BANNER_CREATED_SUCCESSFULLY })

    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }

}


export const getBanner = async(req , res)=>{
    let { search = '' , filter = '' , page = 1 , limit = 5 } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    try {

        const banners = await getBannerService(search , filter , page , limit)

        if(!banners.banners){
            return res.status(NOT_FOUND).json({success : false , message : BANNER_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : BANNER_FETCHED_SUCCESSFULLY , banners : banners.banners , totalPages : Math.ceil(banners.totalCount / limit)})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const getSingleBanner = async(req , res)=>{
    const { id } = req.params

    try {

        if(!id){
            return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        const banner = await getSingleBannerService(id)

        if(!banner){
            return res.status(NOT_FOUND).json({success : false , message : BANNER_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : BANNER_FETCHED_SUCCESSFULLY , banner})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const editBanner = async(req , res)=>{
    const { id } = req.params

    const { title , description , image} = req.body

    try {

        // if(!title || !description || !image){
        //     return res.status(BAD_REQUEST).json({success : false , message : "Missing details"})
        // }

        if(!id){
            return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        const banner = await editBannerService(id , title , description , image)

        if(!banner){
            return res.status(NOT_FOUND).json({success : false , message : BANNER_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : BANNER_UPDATED_SUCCESSFULLY })
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const listUnlistBanner = async(req , res)=>{
    const { id } = req.params;
    
    try {

        if(!id){
            return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG})
        }

        const banner = await listUnlistBannerService(id)

        if(!banner){
            return res.status(NOT_FOUND).json({success : false , message : BANNER_NOT_FOUND })
        }

        return res.status(SUCCESS).json({success : true , message : BANNER_UPDATED_SUCCESSFULLY })
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const deleteBanner = async(req , res)=>{
    const { id } = req.params
    try {

        if(!id){
            return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG})
        }

        const banner = await deleteBannerService(id)

        if(!banner){
            return res.status(NOT_FOUND).json({success : false , message : BANNER_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : BANNER_DELETED_SUCCESSFULLY })
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}