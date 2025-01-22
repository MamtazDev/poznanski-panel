import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeModeInitialState {
  mode: boolean;
}

const initialState: ThemeModeInitialState = {
  mode: true,
};

export const themeSlice = createSlice({
  name: "themeMode",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<boolean>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;
export default themeSlice.reducer;
