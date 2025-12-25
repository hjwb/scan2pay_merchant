import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ConstState {
  baseUrl: string;
  ordersCount: number;
}

const initialState: ConstState = {
  baseUrl: "https://scan2pay.direct/api",
  ordersCount: 0,
};

const constSlice = createSlice({
  name: "constants",
  initialState,
  reducers: {
    setOrdersCount: (
      state,
      action: PayloadAction<Pick<ConstState, "ordersCount">>
    ) => {
      state.ordersCount = action.payload.ordersCount;
    },
  },
});

export const { setOrdersCount } = constSlice.actions;
export default constSlice.reducer;
