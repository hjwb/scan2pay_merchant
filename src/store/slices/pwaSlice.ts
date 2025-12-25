import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PWAState {
  deferredPrompt: any | null;
  isInstallable: boolean;
}

const initialState: PWAState = {
  deferredPrompt: null,
  isInstallable: false,
};

const pwaSlice = createSlice({
  name: "pwa",
  initialState,
  reducers: {
    setInstallPrompt(state, action: PayloadAction<any | null>) {
      state.deferredPrompt = action.payload;
      state.isInstallable = !!action.payload;
    },
  },
});

export const { setInstallPrompt } = pwaSlice.actions;
export default pwaSlice.reducer;
