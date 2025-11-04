
import { changePasswordService, deleteAddressService, editAddressService, editUserDataService, getOneAddressService, getUserAddressService, getUserDataService, resendEditEmailOtpService, userAddressAddService, verifyEditEmialOtpService } from "../../Services/User/userDataService.js";


// get uset data
export const getUserData = async (req, res) => {
    await getUserDataService(req, res);
}

// edit user data
export const editUserData = async (req, res) => {
    await editUserDataService(req, res)
}

// edit email verify otp
export const verifyEditEmialOtp = async (req, res) => {
    await verifyEditEmialOtpService(req, res)
}

// resend edit email otp
export const resendEditEmailOtp = async (req, res) => {
    await resendEditEmailOtpService(req, res)
}

// change password
export const changePassword = async (req, res) => {
    await changePasswordService(req, res)
}

// user address
export const getUserAddress = async (req, res) => {
    await getUserAddressService(req, res)
}

// add address
export const userAddressAdd = async (req, res) => {
    await userAddressAddService(req, res)
}

// single address
export const getOneAddress = async (req, res) => {
    await getOneAddressService(req, res)
}

// edit address
export const editAddress = async (req, res) => {
    await editAddressService(req, res)
}

// delete address
export const deleteAddress = async (req, res) => {
    await deleteAddressService(req, res)
}