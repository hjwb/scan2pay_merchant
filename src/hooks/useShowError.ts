import { useDispatch } from "react-redux";
import { useCallback } from "react";
import type { AppDispatch } from "@/store/store";
import { setErrorModel, setModelMsg } from "@/store/slices/modelSlice";

export function useShowError() {
  const dispatch = useDispatch<AppDispatch>();

  const showError = useCallback(
    (title: string, msg: string, duration = 3000) => {
      dispatch(setErrorModel({ showErrorModel: true }));
      dispatch(
        setModelMsg({
          showModelMsg: { title, msg },
        })
      );

      setTimeout(() => {
        dispatch(setErrorModel({ showErrorModel: false }));
        dispatch(
          setModelMsg({
            showModelMsg: { title: "", msg: "" },
          })
        );
      }, duration);
    },
    [dispatch]
  );

  return { showError };
}
