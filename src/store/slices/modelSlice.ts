import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ModelState {
  showSidebar: boolean;
  showDepositSlider: boolean;
  showWithdrawSlider: boolean;
  showConnectionSlider: boolean;
  showErrorModel: boolean;
  showSuccessModel: boolean;
  showReferVerifyModel: boolean;
  count: number;
  showModelMsg: {
    title: string;
    msg: string;
  };
  showTrxSuccess: boolean;
  showTrxFail: boolean;
}

const initialState: ModelState = {
  showSidebar: false,
  showDepositSlider: false,
  showWithdrawSlider: false,
  showConnectionSlider: false,
  showErrorModel: false,
  showSuccessModel: false,
  showReferVerifyModel: false,
  count: 0,
  showModelMsg: {
    title: "",
    msg: "",
  },
  showTrxSuccess: false,
  showTrxFail: false,
};

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setSidebar: (
      state,
      action: PayloadAction<Pick<ModelState, "showSidebar">>
    ) => {
      state.showSidebar = action.payload.showSidebar;
    },
    setDepositSlider: (
      state,
      action: PayloadAction<Pick<ModelState, "showDepositSlider">>
    ) => {
      state.showDepositSlider = action.payload.showDepositSlider;
    },
    setWithdrawSlider: (
      state,
      action: PayloadAction<Pick<ModelState, "showWithdrawSlider">>
    ) => {
      state.showWithdrawSlider = action.payload.showWithdrawSlider;
    },
    setConnectionSlider: (
      state,
      action: PayloadAction<Pick<ModelState, "showConnectionSlider">>
    ) => {
      state.showConnectionSlider = action.payload.showConnectionSlider;
    },
    setErrorModel: (
      state,
      action: PayloadAction<Pick<ModelState, "showErrorModel">>
    ) => {
      state.showErrorModel = action.payload.showErrorModel;
    },
    setSuccessModel: (
      state,
      action: PayloadAction<Pick<ModelState, "showSuccessModel">>
    ) => {
      state.showSuccessModel = action.payload.showSuccessModel;
    },
    setModelMsg: (
      state,
      action: PayloadAction<Pick<ModelState, "showModelMsg">>
    ) => {
      state.showModelMsg = action.payload.showModelMsg;
    },
    setShowReferVerifyModel: (
      state,
      action: PayloadAction<Pick<ModelState, "showReferVerifyModel">>
    ) => {
      state.showReferVerifyModel = action.payload.showReferVerifyModel;
    },
    setCount: (state, action: PayloadAction<Pick<ModelState, "count">>) => {
      state.count = action.payload.count;
    },
    setTrxSuccess: (
      state,
      action: PayloadAction<Pick<ModelState, "showTrxSuccess">>
    ) => {
      state.showTrxSuccess = action.payload.showTrxSuccess;
    },
    setTrxFail: (
      state,
      action: PayloadAction<Pick<ModelState, "showTrxFail">>
    ) => {
      state.showTrxFail = action.payload.showTrxFail;
    },
  },
});

export const {
  setSidebar,
  setTrxSuccess,
  setTrxFail,
  setDepositSlider,
  setWithdrawSlider,
  setConnectionSlider,
  setErrorModel,
  setSuccessModel,
  setCount,
  setModelMsg,
  setShowReferVerifyModel,
} = modelSlice.actions;
export default modelSlice.reducer;
