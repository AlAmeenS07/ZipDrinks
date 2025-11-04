import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import wishlistModel from "../../models/wishlistModel.js";


export const addToCartService = async (req, res) => {
    const { productId, sku, userId } = req.body;

    try {

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not Authorized!" });
        }

        if (!productId || !sku) {
            return res.status(400).json({ success: false, message: "Invalid request!" });
        }

        const product = await productModel.findOne({ _id: productId, isListed: true });
        if (!product) {
            return res.json({ success: false, message: "Product not found!" });
        }

        const variant = product.variants.find(v => v.sku === sku);
        if (!variant) {
            return res.json({ success: false, message: "Product variant not found!" });
        }

        if (variant.quantity <= 0) {
            return res.json({ success: false, message: "Product is out of stock!" });
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

                if (existingItem.quantity >= 5) {
                    return res.status(400).json({ success: false, message: "Cannot add more than 5 quantity of this product!" });
                }

                if (existingItem.quantity + 1 > variant.quantity) {
                    return res.status(400).json({ success: false, message: "Not enough stock available!" });
                }

                existingItem.quantity += 1;
                existingItem.subTotal = existingItem.quantity * variant.salePrice;

            } else {

                if (variant.quantity < 1) {
                    return res.status(400).json({ success: false, message: "Not enough stock available!" });
                }

                cart.items.push({ productId, sku, quantity: 1, subTotal: variant.salePrice });
            }

            cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subTotal, 0);
        }

        await cart.save();

        await wishlistModel.updateOne({ userId }, { $pull: { items: { productId } } });

        res.status(200).json({ success: true, message: "Added to cart successfully", cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const getCartItemsService = async (req, res) => {
    const { userId } = req;

    try {

        const cart = await cartModel.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found!" });
        }

        res.status(200).json({ success: true, message: "Cart fetched successfully", cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const decrementCartService = async (req, res) => {
    const { productId, sku, userId } = req.body;

    try {

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found!" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        const variant = product.variants.find(v => v.sku === sku);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Product variant not found!" });
        }

        const item = cart.items.find(item => item.productId.toString() === productId && item.sku === sku);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in cart!" });
        }

        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => !(i.productId.toString() === productId && i.sku === sku));
        } else {
            item.subTotal = item.quantity * variant.salePrice;
        }

        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subTotal, 0) || 0;

        await cart.save();

        res.status(200).json({
            success: true,
            message: cart.items.length === 0 ? "Cart is empty" : "Cart updated successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const removeFromCartService = async (req, res) => {
    const { productId, sku, userId } = req.body;

    try {

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not Authorized!" });
        }

        if (!productId || !sku) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        const cart = await cartModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId, sku } } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found!" });
        }

        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subTotal, 0) || 0;
        await cart.save();

        res.status(200).json({ success: true, message: "Removed from cart!", cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const clearCartService = async (req, res) => {
    const userId = req.userId;

    try {

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not Authorized!" });
        }

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found!" });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({ success: true, message: "Cart Cleared!" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}




// import cartModel from "../../models/cartModel.js";
// import productModel from "../../models/productModel.js";
// import wishlistModel from "../../models/wishlistModel.js";

// export const addToCartService = async (req, res) => {
//   const { productId, sku, userId } = req.body;

//   try {
//     if (!userId) {
//       return res.json({ success: false, message: "Not Authorized!" });
//     }

//     if (!productId || !sku) {
//       return res.json({ success: false, message: "Invalid request!" });
//     }

//     const product = await productModel.findOne({ _id: productId, isListed: true });
//     if (!product) {
//         return res.json({ success: false, message: "Product not found!" });
//     }

//     const variant = product.variants.find(v => v.sku === sku);
//     if (!variant) {
//         return res.json({ success: false, message: "Product variant not found!" });
//     }

//     if (variant.quantity <= 0) {
//       return res.json({ success: false, message: "Product is out of stock!" });
//     }

//     let cart = await cartModel.findOne({ userId });

//     if (!cart) {
//       cart = new cartModel({
//         userId,
//         items: [{ productId, sku, quantity: 1, subTotal: variant.salePrice }],
//         totalAmount: variant.salePrice,
//       });
//     } else {
//       const existingItem = cart.items.find(item => item.productId.toString() === productId && item.sku === sku);

//       if (existingItem) {
//         if (existingItem.quantity >= 5)
//           return res.json({ success: false, message: "Cannot add more than 5 quantity of this product!" });

//         if (existingItem.quantity + 1 > variant.quantity)
//           return res.json({ success: false, message: "Not enough stock available!" });

//         existingItem.quantity += 1;
//         existingItem.subTotal = existingItem.quantity * variant.salePrice;
//       } else {
//         if (variant.quantity < 1)
//           return res.json({ success: false, message: "Not enough stock available!" });

//         cart.items.push({ productId, sku, quantity: 1, subTotal: variant.salePrice });
//       }

//       cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subTotal, 0);
//     }

//     await cart.save();

//     await wishlistModel.updateOne({ userId }, { $pull: { items: { productId } } });

//     res.json({ success: true, message: "Added to cart successfully", cart });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// export const getCartItemsService = async (req, res) => {
//   const { userId } = req;

//   try {
//     const cart = await cartModel.findOne({ userId }).populate("items.productId");
//     if (!cart) {
//       return res.json({ success: false, message: "Cart not found!" });
//     }

//     res.json({ success: true, message: "Cart fetched successfully", cart });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// export const decrementCartService = async (req, res) => {
//   const { productId, sku, userId } = req.body;

//   try {
//     const cart = await cartModel.findOne({ userId });
//     if (!cart) {
//         return res.json({ success: false, message: "Cart not found!" });
//     }

//     const product = await productModel.findById(productId);
//     if (!product) {
//         return res.json({ success: false, message: "Product not found!" });
//     }

//     const variant = product.variants.find(v => v.sku === sku);
//     if (!variant) {
//         return res.json({ success: false, message: "Product variant not found!" });
//     }

//     const item = cart.items.find(item => item.productId.toString() === productId && item.sku === sku);
//     if (!item) {
//         return res.json({ success: false, message: "Item not found in cart!" });
//     }

//     item.quantity -= 1;

//     if (item.quantity <= 0) {
//       cart.items = cart.items.filter(i => !(i.productId.toString() === productId && i.sku === sku));
//     } else {
//       item.subTotal = item.quantity * variant.salePrice;
//     }

//     cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subTotal, 0) || 0;

//     await cart.save();

//     res.json({
//       success: true,
//       message: cart.items.length === 0 ? "Cart is empty" : "Cart updated successfully",
//       cart,
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// export const removeFromCartService = async (req, res) => {
//   const { productId, sku, userId } = req.body;

//   try {
//     if (!userId) return res.json({ success: false, message: "Not Authorized!" });

//     if (!productId || !sku)
//       return res.json({ success: false, message: "Missing required fields!" });

//     const cart = await cartModel.findOneAndUpdate(
//       { userId },
//       { $pull: { items: { productId, sku } } },
//       { new: true }
//     );

//     if (!cart) return res.json({ success: false, message: "Cart not found!" });

//     cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subTotal, 0) || 0;
//     await cart.save();

//     res.json({ success: true, message: "Removed from cart!", cart });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// export const clearCartService = async (req, res) => {
//   const userId = req.userId;

//   try {
//     if (!userId) return res.json({ success: false, message: "Not Authorized!" });

//     const cart = await cartModel.findOne({ userId });
//     if (!cart) return res.json({ success: false, message: "Cart not found!" });

//     cart.items = [];
//     cart.totalAmount = 0;
//     await cart.save();

//     res.json({ success: true, message: "Cart Cleared!" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
