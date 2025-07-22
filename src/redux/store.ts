import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import cartReducer from "./reducer/cartReducer";
import favoriteReducer from "./reducer/favoriteReducer";
import settingReducer from "./reducer/settingReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorite: favoriteReducer,
    setting: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
