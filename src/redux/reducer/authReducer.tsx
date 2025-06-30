import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user_id: string;
  firstName: string;
  lastName: string;
  accessToken: string;
}

const initialState: AuthState = {
  user_id: "",
  firstName: "",
  lastName: "",
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
