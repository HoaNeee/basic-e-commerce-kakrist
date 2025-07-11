/* eslint-disable @typescript-eslint/no-explicit-any */
import { post } from "@/utils/requets";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface FavoriteState {
  list: string[];
}

const initialState: FavoriteState = {
  list: [],
};

const favoriteReducer = createSlice({
  name: "favorite",
  initialState: initialState,
  reducers: {
    toggleProduct: (state, action) => {
      const product_id = action.payload;
      const list = listFavoriteToggle(state.list, product_id);

      state.list = [...list];
    },
    syncList: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const listFavoriteToggle = (list: string[], product_id: string) => {
  const res = [...list];
  if (res.includes(product_id)) {
    const index = res.findIndex((it) => it === product_id);
    if (index !== -1) {
      res.splice(index, 1);
    }
  } else {
    res.push(product_id);
  }

  return res;
};

export const handleToggleFavorite = async (list: string[]) => {
  try {
    await post("/favorites/add", { listFavorite: list });
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const { toggleProduct, syncList } = favoriteReducer.actions;

export default favoriteReducer.reducer;
