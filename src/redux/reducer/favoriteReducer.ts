/* eslint-disable @typescript-eslint/no-explicit-any */
import { post } from "@/utils/requets";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface FavoriteState {
  list: string[];
  listBlog: string[];
}

const initialState: FavoriteState = {
  list: [],
  listBlog: [],
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
      state.list = action.payload.list;
      state.listBlog = action.payload.listBlog;
    },
    removeList: (state, action) => {
      state.list = action.payload;
      state.listBlog = action.payload;
    },
    toggleBlog: (state, action) => {
      const blog_id = action.payload;
      const list = listFavoriteToggle(state.listBlog, blog_id);
      state.listBlog = [...list];
    },
  },
});

export const listFavoriteToggle = (list: string[], id: string) => {
  const res = [...list];
  if (res.includes(id)) {
    const index = res.findIndex((it) => it === id);
    if (index !== -1) {
      res.splice(index, 1);
    }
  } else {
    res.push(id);
  }

  return res;
};

export const handleToggleBlog = async (list: string[]) => {
  try {
    await post("/favorites/add-blog", { listBlog: list });
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const handleToggleFavorite = async (list: string[]) => {
  try {
    await post("/favorites/add", { listFavorite: list });
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const { toggleProduct, syncList, removeList, toggleBlog } =
  favoriteReducer.actions;

export default favoriteReducer.reducer;
