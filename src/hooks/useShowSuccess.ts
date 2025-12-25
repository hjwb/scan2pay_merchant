import { useDispatch } from "react-redux";
import { useCallback } from "react";
import type { AppDispatch } from "@/store/store";
import { setSuccessModel, setModelMsg } from "@/store/slices/modelSlice";

export function useShowSuccess() {
  const dispatch = useDispatch<AppDispatch>();

  const showSuccess = useCallback(
    (title: string, msg: string, duration = 3000) => {
      dispatch(setSuccessModel({ showSuccessModel: true }));
      dispatch(
        setModelMsg({
          showModelMsg: { title, msg },
        })
      );

      setTimeout(() => {
        dispatch(setSuccessModel({ showSuccessModel: false }));
        dispatch(
          setModelMsg({
            showModelMsg: { title: "", msg: "" },
          })
        );
      }, duration);
    },
    [dispatch]
  );

  return { showSuccess };
}
