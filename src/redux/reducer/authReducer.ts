import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user_id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isLogin: boolean;
  email: string;
  phone: string;
  setting?: {
    notification: boolean;
    emailNotification: boolean;
  };
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
    updateSetting: (state, action) => {
      state.auth.setting = action.payload;
    },
    removeAuth: (state) => {
      state.auth = initialState;
    },
    refreshToken: (state) => {
      console.log(state);
    },
  },
});

export const { addAuth, removeAuth, refreshToken, updateSetting } =
  authReducer.actions;

export default authReducer.reducer;
