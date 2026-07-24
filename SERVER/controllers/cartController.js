import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * @desc Add Product to Cart
 * @route POST /api/cart
 * @access Private (Customer)
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.isDeleted || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock.",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + Number(quantity);

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Quantity exceeds available stock.",
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].price = product.salePrice || product.price;
      cart.items[itemIndex].subtotal =
        cart.items[itemIndex].quantity *
        (product.salePrice || product.price);

    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        price: product.salePrice || product.price,
        subtotal: Number(quantity) * (product.salePrice || product.price),
      });
    }

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart.",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Get Cart
 * @route GET /api/cart
 * @access Private (Customer)
 */
export const getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Update Cart Item Quantity
 * @route PUT /api/cart/:productId
 * @access Private (Customer)
 */
export const updateCart = async (req, res) => {
  try {

    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      item => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    const product = await Product.findById(item.product);

    if (!product || product.isDeleted || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds stock.",
      });
    }

    item.quantity = Number(quantity);
    item.price = product.salePrice || product.price;
    item.subtotal = item.quantity * item.price;

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Remove Cart Item
 * @route DELETE /api/cart/:productId
 * @access Private (Customer)
 */
export const removeCartItem = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * @desc Clear Cart
 * @route DELETE /api/cart
 * @access Private (Customer)
 */
export const clearCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};