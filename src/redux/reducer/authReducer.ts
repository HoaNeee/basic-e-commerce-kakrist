import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user_id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  accessToken: string;
  isLogin: boolean;
}

const initialState: AuthState = {
  user_id: "",
  firstName: "",
  lastName: "",
  accessToken: "",
  avatar: "",
  isLogin: false,
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
