import Joi from "joi";

export const adminLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
});

export const categoryAddSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    offer: Joi.number().min(0).allow(null, "").optional(),
    maxRedeem: Joi.number().min(0).allow(null, "").optional(),

    image: Joi.string().trim().required(),
});

export const categoryUpdateSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    offer: Joi.number().min(0).allow(null, "").optional(),
    maxRedeem: Joi.number().min(0).allow(null, "").optional(),
    image: Joi.string().trim().required()
});

export const addBannerSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
});

export const editBannerSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().required(),
});

export const addCouponSchema = Joi.object({
    couponCode: Joi.string().trim().required(),
    discount: Joi.string().required(),
    description: Joi.string().trim().required(),
    expiryDate: Joi.date().greater("now").required(),
    limit: Joi.number().integer().min(1).required(),
    minPurchase: Joi.number().min(0).required(),
    maxRedeem: Joi.number().min(0).required(),
});

export const updateCouponSchema = Joi.object({
    couponCode: Joi.string().trim().required(),
    discount: Joi.string().required(),
    description: Joi.string().trim().required(),
    expiryDate: Joi.date().greater("now").required(),
    limit: Joi.number().integer().min(1).required(),
    minPurchase: Joi.number().min(0).required(),
    maxRedeem: Joi.number().min(0).required(),
});

const variantSchema = Joi.object({
    size: Joi.string().trim().required(),
    price: Joi.number().min(1).required(),
    salePrice : Joi.number().required(),
    quantity: Joi.number().integer().min(0).required(),
});

export const addProductSchema = Joi.object({
    name: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    ingredients: Joi.string().trim().required(),
    serve: Joi.string().trim().required(),
    store: Joi.string().trim().required(),
    life: Joi.string().trim().required(),

    offer: Joi.number().min(0).allow(null, "").optional(),
    maxRedeem: Joi.number().min(0).allow(null, "").optional(),


    coverImage: Joi.string().trim().required(),
    images: Joi.array().items(Joi.string().trim()).min(1).required(),

    variants: Joi.array().items(variantSchema).min(1).required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    ingredients: Joi.string().trim().required(),
    serve: Joi.string().trim().required(),
    store: Joi.string().trim().required(),
    life: Joi.string().trim().required(),

    offer: Joi.number().min(0).allow(null, "").optional(),
    maxRedeem: Joi.number().min(0).allow(null, "").optional(),


    coverImage: Joi.string().trim().required(),
    images: Joi.array().items(Joi.string().trim()).min(1).required(),

    variants: Joi.array().items(variantSchema).min(1).required(),
});