import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import wishlistModel from "../../models/wishlistModel.js";
import { ADDED_TO_CART_SUCCESSFULLY, BAD_REQUEST, CANNOT_ADD_MORE_THAN_FIVE, CART_CLEARED, CART_FETCHED_SUCCESSFULLY, CART_NOT_FOUND, INVALID_REQUEST, ITEM_NOT_FOUND_IN_CART, MAX_CART_QUANTITY, MISSING_REQUIRED_FIELDS, NOT_AUTHORIZED, NOT_ENOUGH_STOCK_AVAILABLE, NOT_FOUND, PRODUCT_NOT_FOUND, PRODUCT_OUT_OF_STOCK, PRODUCT_VARIANT_NOT_FOUND, REMOVED_FROM_CART, SERVER_ERROR, SUCCESS, UNAUTHORIZED } from "../../utils/constants.js";


export const addToCartService = async (req, res) => {
    const { productId, sku, userId } = req.body;

    try {

        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, message: NOT_AUTHORIZED });
        }

        if (!productId || !sku) {
            return res.status(BAD_REQUEST).json({ success: false, message: INVALID_REQUEST });
        }

        const product = await productModel.findOne({ _id: productId, isListed: true });
        if (!product) {
            return res.status(NOT_FOUND).json({ success: false, message: PRODUCT_NOT_FOUND });
        }

        const variant = product.variants.find(v => v.sku === sku);
        if (!variant) {
            return res.status(NOT_FOUND).json({ success: false, message: PRODUCT_VARIANT_NOT_FOUND });
        }

        if (variant.quantity <= 0) {
            return res.status(NOT_FOUND).json({ success: false, message: PRODUCT_OUT_OF_STOCK });
        }

        let cart = await cartModel.findOne({ userId });

        if (!cart) {

            cart = new cartModel({
                userId,
                items: [{ productId, sku, quantity: 1, subTotal: variant.salePrice }],
                totalAmount: variant.salePrice
            });

        } else {

            const existingItem = cart.items.find(item => item.productId.toString() === productId && item.sku === sku);

            if (existingItem) {

                if (existingItem.quantity >= MAX_CART_QUANTITY) {
                    return res.status(BAD_REQUEST).json({ success: false, message: CANNOT_ADD_MORE_THAN_FIVE });
                }

                if (existingItem.quantity + 1 > variant.quantity) {
                    return res.status(BAD_REQUEST).json({ success: false, message: NOT_ENOUGH_STOCK_AVAILABLE });
                }

                existingItem.quantity += 1;
                existingItem.subTotal = existingItem.quantity * variant.salePrice;

            } else {

                if (variant.quantity < 1) {
                    return res.status(BAD_REQUEST).json({ success: false, message: NOT_ENOUGH_STOCK_AVAILABLE });
                }

                cart.items.push({ productId, sku, quantity: 1, subTotal: variant.salePrice });
            }

            cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subTotal, 0);
        }

        await cart.save();

        await wishlistModel.updateOne({ userId }, { $pull: { items: { productId } } });

        res.status(SUCCESS).json({ success: true, message: ADDED_TO_CART_SUCCESSFULLY, cart });

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}


export const getCartItemsService = async (req, res) => {
    const { userId } = req;

    try {

        const cart = await cartModel.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(NOT_FOUND).json({ success: false, message: CART_NOT_FOUND });
        }

        res.status(SUCCESS).json({ success: true, message: CART_FETCHED_SUCCESSFULLY, cart });

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}


export const decrementCartService = async (req, res) => {
    const { productId, sku, userId } = req.body;

    try {

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(NOT_FOUND).json({ success: false, message: CART_NOT_FOUND });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(NOT_FOUND).json({ success: false, message: PRODUCT_NOT_FOUND });
        }

        const variant = product.variants.find(v => v.sku === sku);
        if (!variant) {
            return res.status(NOT_FOUND).json({ success: false, message: PRODUCT_VARIANT_NOT_FOUND });
        }

        const item = cart.items.find(item => item.productId.toString() === productId && item.sku === sku);
        if (!item) {
            return res.status(NOT_FOUND).json({ success: false, message: ITEM_NOT_FOUND_IN_CART });
        }

        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => !(i.productId.toString() === productId && i.sku === sku));
        } else {
            item.subTotal = item.quantity * variant.salePrice;
        }

        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subTotal, 0) || 0;

        await cart.save();

        res.status(SUCCESS).json({
            success: true,
            message: cart.items.length === 0 ? "Cart is empty" : "Cart updated successfully",
            cart
        });

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}


export const removeFromCartService = async (req, res) => {
    const { productId, sku, userId } = req.body;

    try {

        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, NOT_AUTHORIZED });
        }

        if (!productId || !sku) {
            return res.status(BAD_REQUEST).json({ success: false, message: MISSING_REQUIRED_FIELDS });
        }

        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId, sku } } },
            { new: true }
        );

        if (!cart) {
            return res.status(NOT_FOUND).json({ success: false, message: CART_NOT_FOUND });
        }

        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subTotal, 0) || 0;
        await cart.save();

        res.status(SUCCESS).json({ success: true, message: REMOVED_FROM_CART, cart });

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}


export const clearCartService = async (req, res) => {
    const userId = req.userId;

    try {

        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, message: NOT_AUTHORIZED });
        }

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(NOT_FOUND).json({ success: false, message: CART_NOT_FOUND });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(SUCCESS).json({ success: true, message: CART_CLEARED });

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}


