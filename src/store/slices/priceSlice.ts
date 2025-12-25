import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import type { RootState } from "../store";

interface BalanceData {
  total_usdt: string;
  total_inr: string;
}

interface LimitData {
  buy_limit: string;
  sell_limit: string;
  verified_social_media: string;
}

interface PriceState {
  sellingPriceUSDT: string;
  buyingPriceUSDT: string;
  sellingPriceUSDC: string;
  buyingPriceUSDC: string;
  fetchBalance: boolean;
  balance: BalanceData | null;
  loading: boolean;
  error: string | null;
  limit: LimitData | null;
}

const initialState: PriceState = {
  sellingPriceUSDT: "0.00",
  buyingPriceUSDT: "0.00",
  sellingPriceUSDC: "0.00",
  buyingPriceUSDC: "0.00",
  balance: null,
  fetchBalance: false,
  loading: false,
  error: null,
  limit: null,
};

export const fetchBalanceThunk = createAsyncThunk<
  BalanceData,
  { baseUrl: string; userId: string; token: string },
  { rejectValue: string }
>(
  "price/fetchBalanceThunk",
  async ({ baseUrl, userId, token }, { rejectWithValue }) => {
    try {
      // console.log({ baseUrl, userId, token });
      const response = await axios.post(
        `${baseUrl}/user-available-balance`,
        { user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log({ response });
      const data = response.data?.data;
      if (!data || !data.total_usdt || !data.total_inr) {
        return rejectWithValue("Invalid balance data");
      }
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to fetch balance");
    }
  }
);

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    setSellingPriceUSDT: (
      state,
      action: PayloadAction<Pick<PriceState, "sellingPriceUSDT">>
    ) => {
      state.sellingPriceUSDT = action.payload.sellingPriceUSDT;
    },
    setBuyingPriceUSDT: (
      state,
      action: PayloadAction<Pick<PriceState, "buyingPriceUSDT">>
    ) => {
      state.buyingPriceUSDT = action.payload.buyingPriceUSDT;
    },
    setSellingPriceUSDC: (
      state,
      action: PayloadAction<Pick<PriceState, "sellingPriceUSDC">>
    ) => {
      state.sellingPriceUSDC = action.payload.sellingPriceUSDC;
    },
    setBuyingPriceUSDC: (
      state,
      action: PayloadAction<Pick<PriceState, "buyingPriceUSDC">>
    ) => {
      state.buyingPriceUSDC = action.payload.buyingPriceUSDC;
    },
    getBalance: (
      state,
      action: PayloadAction<Pick<PriceState, "fetchBalance">>
    ) => {
      state.fetchBalance = action.payload.fetchBalance;
    },
    setBalance: (state, action: PayloadAction<Pick<PriceState, "balance">>) => {
      state.balance = action.payload.balance;
    },
    setLimit: (state, action: PayloadAction<Pick<PriceState, "limit">>) => {
      state.limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalanceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching balance";
        state.balance = state.balance ?? { total_usdt: "0", total_inr: "0" };
      });
  },
});

export const {
  setSellingPriceUSDT,
  setBuyingPriceUSDT,
  setSellingPriceUSDC,
  setBuyingPriceUSDC,
  setLimit,
  setBalance,
  getBalance,
} = priceSlice.actions;
export default priceSlice.reducer;
