import { createSlice } from "@reduxjs/toolkit";

const settingSlice = createSlice({
  name: "auth",
  initialState: {
    setting: {
      theme: "light",
    },
  },
  reducers: {
    changeTheme: (state, action) => {
      state.setting.theme = action.payload;
    },
  },
});

export const { changeTheme } = settingSlice.actions;

export default settingSlice.reducer;
