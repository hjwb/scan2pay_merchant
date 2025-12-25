import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isConnected: boolean;
  userData: Record<string, number | string> | null;
  token: string;
}

const initialState: UserState = {
  isConnected: false,
  userData: null,
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsUserConnected: (
      state,
      action: PayloadAction<Pick<UserState, "isConnected">>
    ) => {
      state.isConnected = action.payload.isConnected;
    },
    setUserData: (
      state,
      action: PayloadAction<Pick<UserState, "userData">>
    ) => {
      state.userData = action.payload.userData;
    },
    setToken: (state, action: PayloadAction<Pick<UserState, "token">>) => {
      state.token = action.payload.token;
    },
    signout: (state) => {
      state.isConnected = false;
      state.userData = null;
      state.token = "";
    },
  },
});

export const { setIsUserConnected, setUserData, setToken, signout } =
  userSlice.actions;
export default userSlice.reducer;
