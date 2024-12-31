import express from "express";
import {
  addItemToCart,
  updateCartItem,
  deleteCart,
  getCartById,
  getAllCarts,
} from "../controller/CartController.js";
import VerifyUserToken from '../middileware/UserAuth.js'

const Cartrouter = express.Router();

Cartrouter

.post("/add", VerifyUserToken, addItemToCart)

.get("/allcarts", VerifyUserToken, getAllCarts)
.put("/:cartId",VerifyUserToken, updateCartItem)
.delete("/:cartId",VerifyUserToken, deleteCart)
.get("/:id", VerifyUserToken, getCartById)

export default Cartrouter;
