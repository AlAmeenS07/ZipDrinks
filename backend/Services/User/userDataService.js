import bcrypt from "bcryptjs";
import transporter from "../../confiq/nodemailer.js";
import userModel from "../../models/userModel.js";
import cache from "../../utils/nodeCache.js";
import dotenv from "dotenv"
import addressModel from "../../models/addressModel.js";
import { ADDRESS_ADDED_SUCCESSFULLY, ADDRESS_DELETED_SUCCESSFULLY, ADDRESS_FETCHED_SUCCESSFULLY, ADDRESS_UPDATED_SUCCESSFULLY, BAD_REQUEST, CACHE_TIME, CONFLICT, CREATED, EMAIL_ALREADY_EXIST, FORBIDDENT, GONE, INVALID_OTP, INVALID_PASSWORD, MISSING_DETAILS, NOT_FOUND, OTP_EXPIRED, PASSWORD_UPDATED_SUCCESSFULLY, PASSWORDS_MUST_MATCH, SERVER_ERROR, SIX_DIGIT_MIN_VALUE, SIX_DIGIT_RANGE_VALUE, SOMETHING_WENT_WRONG, SUCCESS, UNAUTHORIZED, UPDATED_SUCCESSFULLY, USER_BLOCKED, USER_GOOGLE_LOGIN, USER_NOT_FOUND } from "../../utils/constants.js";

dotenv.config()

let editData = {};

export const getUserDataService = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
    }

    if (user.isBlocked) {
      return res.status(FORBIDDENT).json({ success: false, message: USER_BLOCKED })
    }

    return res.status(SUCCESS).json({ success: true, userData: user });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const editUserDataService = async (req, res) => {

  const { fullname, email, phone, profileImage, userId } = req.body;

  try {

    const user = await userModel.findById(userId);

    const oldEmail = user.email

    if (user.email === email) {

      if (profileImage) {

        let update = await userModel.findByIdAndUpdate(userId, { $set: { fullname, email, phone, profileImage } }, { new: true });

        if (!update) {
          return res.status(NOT_FOUND).json({ success: false, message: SOMETHING_WENT_WRONG })
        }

        return res.status(SUCCESS).json({ success: true, message: UPDATED_SUCCESSFULLY , userData: update })

      } else {

        let update = await userModel.findByIdAndUpdate(userId, { $set: { fullname, email, phone } }, { new: true });

        if (!update) {
          return res.status(NOT_FOUND).json({ success: false, message: SOMETHING_WENT_WRONG })
        }

        return res.status(SUCCESS).json({ success: true, message: UPDATED_SUCCESSFULLY , userData: update })

      }

    }
    else {

      const existUser = await userModel.findOne({ email })

      if (existUser) {
        return res.status(CONFLICT).json({ success: false, message: EMAIL_ALREADY_EXIST })
      }

      if (profileImage) {
        editData = { fullname, email, phone, profileImage }
      }
      else {
        editData = { fullname, email, phone }
      }

      const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));

      cache.set(`edit_${user.email}`, otp, CACHE_TIME)

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Email Edit Verification OTP",
        text: `Your OTP is: ${otp}`,
      });

      res.status(SUCCESS).json({ success: true, message: "Edit email OTP send to mail !", otp, email })

    }

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message })
  }

}


export const verifyEditEmialOtpService = async (req, res) => {
  const { userId, otp } = req.body;

  try {

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(UNAUTHORIZED).json({ success: false, message: SOMETHING_WENT_WRONG })
    }

    if (!otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: "OTP not found !" })
    }

    let cachedOtp = cache.get(`edit_${user.email}`)

    if (!cachedOtp) {
      return res.status(GONE).json({ success: false, message: OTP_EXPIRED })
    }

    if (cachedOtp !== otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: INVALID_OTP })
    }

    let update = await userModel.findByIdAndUpdate(userId, { $set: editData }, { new: true });

    if (!update) {
      return res.status(NOT_FOUND).json({ success: false, message: SOMETHING_WENT_WRONG })
    }

    editData = {}
    cache.del(`edit_${user.email}`);

    return res.status(SUCCESS).json({ success: true, message: UPDATED_SUCCESSFULLY, userData: update })

  } catch (error) {
    res.status(SERVER_ERROR).json({ success: false, message: error.message })
  }
}


export const resendEditEmailOtpService = async (req , res)=>{

      const { userId } = req.body

      try {

        const user = await userModel.findById(userId);

        if(!user){
          return res.status(NOT_FOUND).json({success : false , message : USER_NOT_FOUND})
        }

        const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));
        cache.set(`edit_${user.email}`, otp, CACHE_TIME);
    
        await transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: editData.email,
          subject: "Reset Password OTP",
          text: `Your new reset email OTP is: ${otp}`,
        });
    
        return res.status(SUCCESS).json({ success: true, message: "Reset email OTP resent to email." });
      } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message });
      }
}


export const changePasswordService = async (req , res)=>{

    const {currentPassword , password , confirmPassword , userId } = req.body;
    
    try {

      const user = await userModel.findById(userId)

      if(!user){
          return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG })
      }

      if(password !== confirmPassword){
        return res.status(BAD_REQUEST).json({success : false , message : PASSWORDS_MUST_MATCH })
      }

      if(!user?.password){
        return res.status(NOT_FOUND).json({success : false , message : USER_GOOGLE_LOGIN })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if(!isMatch){
        return res.status(UNAUTHORIZED).json({success : false , message : INVALID_PASSWORD })
      }

      const hashPassword = await bcrypt.hash(password, 10);

      let updatePassword = await userModel.findByIdAndUpdate(userId , {$set : {password : hashPassword} } , {new : true})

      return res.status(SUCCESS).json({success : true , message : PASSWORD_UPDATED_SUCCESSFULLY })
      
    } catch (error) {
      res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const userAddressAddService = async (req , res)=>{
    const {fullname , phone , address , district , state , landmark , pincode , userId} = req.body
    try {

      if(!userId){
        return res.status(UNAUTHORIZED).json({success : false ,  message : SOMETHING_WENT_WRONG })
      }

      if(!fullname.trim() || !phone.trim() || !address.trim() || !district.trim() || !state.trim() ||
        ! landmark.trim() || ! pincode.trim()){
          return res.status(BAD_REQUEST).json({success : false , message : MISSING_DETAILS })
      }

      let addAddress = new addressModel({ userId , fullname , phone , address , district , state , landmark , pincode })
      await addAddress.save()

      res.status(CREATED).json({success : true , message : ADDRESS_ADDED_SUCCESSFULLY })
      
    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const getUserAddressService = async(req , res)=>{
    const { userId } = req
    
    try {

      if(!userId){
        return res.status(UNAUTHORIZED).json({success : false , message : SOMETHING_WENT_WRONG })
      }

      let address = await addressModel.find({userId , isDeleted : false})

      if(!address){
        return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG })
      }

      res.status(SUCCESS).json({success : true , message : ADDRESS_FETCHED_SUCCESSFULLY , address})
      
    } catch (error) {
      res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const getOneAddressService = async(req , res)=>{
    const { addressId } = req.params;
    try {

      const address = await addressModel.findById(addressId);

      if(!address){
        return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG })
      }

      res.status(SUCCESS).json({success : true , message : ADDRESS_FETCHED_SUCCESSFULLY , address})

    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const editAddressService = async (req , res)=>{
    const { addressId } = req.params;
    const updatedData = req.body;

    try {

      if(!updatedData || !addressId){
        return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG })
      }

      let updateAddress = await addressModel.findByIdAndUpdate(addressId , {$set : updatedData} , {new : true})

      res.status(SUCCESS).json({success : true , message : ADDRESS_UPDATED_SUCCESSFULLY })
      
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const deleteAddressService = async(req , res)=>{
    const { addressId } = req.params;

    try {

        let deleteAddress = await addressModel.findByIdAndUpdate(addressId , {$set : {isDeleted : true}})

        if(!deleteAddress){
          return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        res.status(SUCCESS).json({success : true , message : ADDRESS_DELETED_SUCCESSFULLY })
      
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}