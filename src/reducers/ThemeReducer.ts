// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface ThemeModeInitialState {
//   mode: boolean;
// }

// const initialState: ThemeModeInitialState = {
//   mode: true,
// };

// export const themeSlice = createSlice({
//   name: "themeMode",
//   initialState,
//   reducers: {
//     setMode: (state, action: PayloadAction<boolean>) => {
//       state.mode = action.payload;
//     },
//   },
// });

// export const { setMode } = themeSlice.actions;
// export default themeSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeModeInitialState {
  mode: boolean;
  type: boolean;
}

const initialState: ThemeModeInitialState = {
  mode: false,
  type: false,
};

export const themeSlice = createSlice({
  name: "themeMode",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<boolean>) => {
      state.mode = action.payload;
    },
    setType: (state, action: PayloadAction<boolean>) => {
      state.type = action.payload;
    }
  },
});

export const { setMode, setType } = themeSlice.actions;
export default themeSlice.reducer;
