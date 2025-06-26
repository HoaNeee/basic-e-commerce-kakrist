import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  userId: string;
  fullname: string;
  accessToken: string;
}

const initialState: AuthState = {
  userId: "",
  fullname: "",
  accessToken: "",
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
