import Joi from "joi"

export const registerSchema = Joi.object({
    fullname: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(8).required(),
    referredBy: Joi.string().optional().allow("")
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});

export const resendVerifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const sendResetPasswordOtpSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const verifyResetOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(8).required(),
    confirmNewPassword: Joi.ref("newPassword"),
});
