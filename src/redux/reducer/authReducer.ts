import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user_id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isLogin: boolean;
  email: string;
  phone: string;
}

const initialState: AuthState = {
  user_id: "",
  firstName: "",
  lastName: "",
  avatar: "",
  isLogin: false,
  email: "",
  phone: "",
};

const authReducer = createSlice({
  name: "auth",
  initialState: {
    auth: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.auth = action.payload;
    },
    removeAuth: (state) => {
      state.auth = initialState;
    },
    refreshToken: (state) => {
      console.log(state);
    },
  },
});

export const { addAuth, removeAuth, refreshToken } = authReducer.actions;

export default authReducer.reducer;
