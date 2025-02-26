import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface YouTubePlayerInitialState {
  isOpen: boolean;
  link: string;
  videoId: string;
}

const initialPlayerState: YouTubePlayerInitialState = {
  isOpen: false,
  link: "",
  videoId: ""
};
export const playerSlice = createSlice({
  name: "player",
  initialState: initialPlayerState,
  reducers: {
    openPlayer: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.link = action.payload;
    },
    closePlayer: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openPlayer, closePlayer } = playerSlice.actions;
export default playerSlice.reducer;
