import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "favorite_services";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function save(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    serviceIds: load(), // array of serviceId strings
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = String(action.payload);
      const exists = state.serviceIds.includes(id);
      state.serviceIds = exists
        ? state.serviceIds.filter((x) => x !== id)
        : [id, ...state.serviceIds];
      save(state.serviceIds);
    },
    removeFavorite: (state, action) => {
      const id = String(action.payload);
      state.serviceIds = state.serviceIds.filter((x) => x !== id);
      save(state.serviceIds);
    },
    clearFavorites: (state) => {
      state.serviceIds = [];
      save([]);
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavoriteIds = (state) => state.favorites.serviceIds;
export const selectIsFavorite = (id) => (state) =>
  state.favorites.serviceIds.includes(String(id));

export default favoritesSlice.reducer;