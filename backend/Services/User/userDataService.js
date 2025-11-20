import bcrypt from "bcryptjs";
import transporter from "../../confiq/nodemailer.js";
import userModel from "../../models/userModel.js";
import cache from "../../utils/nodeCache.js";
import dotenv from "dotenv"
import addressModel from "../../models/addressModel.js";
import { BAD_REQUEST, CACHE_TIME, CONFLICT, CREATED, FORBIDDENT, GONE, NOT_FOUND, SERVER_ERROR, SIX_DIGIT_MIN_VALUE, SIX_DIGIT_RANGE_VALUE, SUCCESS, UNAUTHORIZED } from "../../utils/constants.js";

dotenv.config()

let editData = {};

export const getUserDataService = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(FORBIDDENT).json({ success: false, message: "You are blocked by admin !" })
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
          return res.status(NOT_FOUND).json({ success: false, message: "Something went wrong !" })
        }

        return res.status(SUCCESS).json({ success: true, message: "Updated Successfully", userData: update })

      } else {

        let update = await userModel.findByIdAndUpdate(userId, { $set: { fullname, email, phone } }, { new: true });

        if (!update) {
          return res.status(NOT_FOUND).json({ success: false, message: "Something went wrong !" })
        }

        return res.status(SUCCESS).json({ success: true, message: "Updated Successfully", userData: update })

      }

    }
    else {

      const existUser = await userModel.findOne({ email })

      if (existUser) {
        return res.status(CONFLICT).json({ success: false, message: "Email Already Exists !" })
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
      return res.status(UNAUTHORIZED).json({ success: false, message: "Something went wrong !" })
    }

    if (!otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: "OTP not found !" })
    }

    let cachedOtp = cache.get(`edit_${user.email}`)

    if (!cachedOtp) {
      return res.status(GONE).json({ success: false, message: "Otp expires !" })
    }

    if (cachedOtp !== otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: "Invalid Otp !" })
    }

    let update = await userModel.findByIdAndUpdate(userId, { $set: editData }, { new: true });

    if (!update) {
      return res.status(NOT_FOUND).json({ success: false, message: "Something went wrong !" })
    }

    editData = {}
    cache.del(`edit_${user.email}`);

    return res.status(SUCCESS).json({ success: true, message: "Updated Successfully", userData: update })

  } catch (error) {
    res.status(SERVER_ERROR).json({ success: false, message: error.message })
  }
}


export const resendEditEmailOtpService = async (req , res)=>{

      const { userId } = req.body

      try {

        const user = await userModel.findById(userId);

        if(!user){
          return res.status(NOT_FOUND).json({success : false , message : "No user Found !"})
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
          return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
      }

      if(password !== confirmPassword){
        return res.status(BAD_REQUEST).json({success : false , message : "Password must be match !"})
      }

      if(!user?.password){
        return res.status(NOT_FOUND).json({success : false , message : "You are signup using google !"})
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if(!isMatch){
        return res.status(UNAUTHORIZED).json({success : false , message : "Invalid Password !"})
      }

      const hashPassword = await bcrypt.hash(password, 10);

      let updatePassword = await userModel.findByIdAndUpdate(userId , {$set : {password : hashPassword} } , {new : true})

      return res.status(SUCCESS).json({success : true , message : "Password Updated Successfully"})
      
    } catch (error) {
      res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const userAddressAddService = async (req , res)=>{
    const {fullname , phone , address , district , state , landmark , pincode , userId} = req.body
    try {

      if(!userId){
        return res.status(UNAUTHORIZED).json({success : false ,  message : "Something went wrong !"})
      }

      if(!fullname.trim() || !phone.trim() || !address.trim() || !district.trim() || !state.trim() ||
        ! landmark.trim() || ! pincode.trim()){
          return res.status(BAD_REQUEST).json({success : false , message : "Missing Detail !"})
      }

      let addAddress = new addressModel({ userId , fullname , phone , address , district , state , landmark , pincode })
      await addAddress.save()

      res.status(CREATED).json({success : true , message : "Address added successfully"})
      
    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const getUserAddressService = async(req , res)=>{
    const { userId } = req
    
    try {

      if(!userId){
        return res.status(UNAUTHORIZED).json({success : false , message : "Something went wrong !"})
      }

      let address = await addressModel.find({userId , isDeleted : false})

      if(!address){
        return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
      }

      res.status(SUCCESS).json({success : true , message : "Address fetched successfully" , address})
      
    } catch (error) {
      res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const getOneAddressService = async(req , res)=>{
    const { addressId } = req.params;
    try {

      const address = await addressModel.findById(addressId);

      if(!address){
        return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
      }

      res.status(SUCCESS).json({success : true , message : "Address fetched successfully" , address})

    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const editAddressService = async (req , res)=>{
    const { addressId } = req.params;
    const updatedData = req.body;

    try {

      if(!updatedData || !addressId){
        return res.status(BAD_REQUEST).json({success : false , message : "Something went wrong !"})
      }

      let updateAddress = await addressModel.findByIdAndUpdate(addressId , {$set : updatedData} , {new : true})

      res.status(SUCCESS).json({success : true , message : "Address Updated Successfully"})
      
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

export const deleteAddressService = async(req , res)=>{
    const { addressId } = req.params;

    try {

        let deleteAddress = await addressModel.findByIdAndUpdate(addressId , {$set : {isDeleted : true}})

        if(!deleteAddress){
          return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
        }

        res.status(SUCCESS).json({success : true , message : "Address deleted successfully"})
      
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}