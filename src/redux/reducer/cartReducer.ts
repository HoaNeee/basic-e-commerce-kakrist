/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartModel } from "@/models/cartModel";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartModel[] = [];

const cartReducer = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cart_id: "",
      carts: initialState,
      cartsCheckout: initialState,
    },
  },
  reducers: {
    addProduct: (state, action) => {
      const carts = [...state.cart.carts];

      if (action.payload.productType === "variations") {
        const index = carts.findIndex(
          (item) => item.sub_product_id === action.payload.sub_product_id
        );
        if (index !== -1) {
          carts[index].quantity += action.payload.quantity;
        } else {
          carts.push(action.payload);
        }
        state.cart.carts = [...carts];
      } else {
        const index = carts.findIndex(
          (item) => item.product_id === action.payload.product_id
        );
        if (index !== -1) {
          carts[index].quantity += action.payload.quantity;
        } else {
          carts.push(action.payload);
        }
        state.cart.carts = [...carts];
      }
    },
    syncCart: (state, action) => {
      state.cart = action.payload;
    },
    removeCartItem: (state, action) => {
      const cartItem_id = action.payload;
      state.cart.carts = state.cart.carts.filter(
        (item) => item.cartItem_id !== cartItem_id
      );
    },
    changeQuantity: (state, action) => {
      const { cartItem_id, quantity } = action.payload;
      const carts = [...state.cart.carts];
      const index = carts.findIndex((item) => item.cartItem_id === cartItem_id);
      if (index + 1) {
        // !== -1
        carts[index].quantity += quantity;
      }
      state.cart.carts = [...carts];
    },
    changeSubProduct: (state, action) => {
      const { cartItem_id, subProduct } = action.payload;
      const carts = [...state.cart.carts];
      const index = carts.findIndex((item) => item.cartItem_id === cartItem_id);
      if (index + 1) {
        // !== -1
        carts[index].price = subProduct.price;
        carts[index].discountedPrice = subProduct.discountedPrice;
        carts[index].sub_product_id = subProduct._id;
        carts[index].thumbnail = subProduct.thumbnail;
        carts[index].options = subProduct.options;
        carts[index].options_info = subProduct.options_info;
        carts[index].stock = subProduct.stock;
      }
      state.cart.carts = [...carts];
    },
    addCartCheckout: (state, action) => {
      state.cart.cartsCheckout = action.payload;
    },
    removeCart: (state, action) => {
      state.cart.carts = action.payload;
      state.cart.cartsCheckout = action.payload;
    },
  },
});

export const {
  addProduct,
  syncCart,
  removeCartItem,
  changeQuantity,
  changeSubProduct,
  addCartCheckout,
  removeCart,
} = cartReducer.actions;

export default cartReducer.reducer;
