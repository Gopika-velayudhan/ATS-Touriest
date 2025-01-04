import Cart from "../model/CartSchema.js";
import User from "../model/AuthSchema.js";
import { cartValidationSchema, cartItemValidationSchema } from "../model/ValidationSchema.js";

// Add item to cart
export const addItemToCart = async (req, res) => {
  try {
    const { value, error } = cartValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ statusCode: 400, message: error.details[0].message, data: null });
    }

    const { userId, items, totalPrice } = value;

    
    let user = await User.findById(userId).populate("cart");

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: "User not found", data: null });
    }

    let cart = user.cart;

    if (!cart) {
      
      cart = await Cart.create({ userId, items, totalPrice });
      
      user.cart = cart._id;
      await user.save();
      return res.status(201).json({ statusCode: 201, message: "Cart created successfully", data: cart });
    }

    
    items.forEach((newItem) => {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === newItem.itemId && item.itemType === newItem.itemType
      );

      if (existingItemIndex >= 0) {

        
        cart.items[existingItemIndex].price = newItem.price; // Update price if changed
      } else {
        // Add new item to the cart
        cart.items.push(newItem);
      }
    });

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({ statusCode: 200, message: "Item added to cart", data: cart });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message, data: null });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { price, itemType, itemId } = req.body;

    // Find the cart by its ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ statusCode: 404, message: "Cart not found", data: null });
    }

    // Update the item
    cart.items.forEach((item) => {
      if (price) item.price = price;
      if (itemType) item.itemType = itemType;
      if (itemId) item.itemId = itemId;
    });

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({ statusCode: 200, message: "Cart item updated", data: cart });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message, data: null });
  }
};

// Delete cart item
export const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    // Find and delete the cart
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) {
      return res.status(404).json({ statusCode: 404, message: "Cart not found", data: null });
    }

    res.status(200).json({ statusCode: 200, message: "Cart deleted successfully", data: null });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message, data: null });
  }
};

// Get cart by ID
export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findById(id).populate("items.itemId");
    if (!cart) {
      return res.status(404).json({ statusCode: 404, message: "Cart not found", data: null });
    }

    res.status(200).json({ statusCode: 200, message: "Cart fetched successfully", data: cart });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message, data: null });
  }
};

// Get all carts
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("items.itemId");

    res.status(200).json({ statusCode: 200, message: "Carts fetched successfully", data: carts });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message, data: null });
  }
};
