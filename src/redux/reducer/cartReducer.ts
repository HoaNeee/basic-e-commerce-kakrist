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
  },
});

export const { addProduct, syncCart, removeCartItem } = cartReducer.actions;

export default cartReducer.reducer;
