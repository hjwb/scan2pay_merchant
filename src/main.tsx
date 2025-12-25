import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.ts";
import "./index.css";
import App from "./App.tsx";
import { setInstallPrompt } from "./store/slices/pwaSlice.ts";
// import Loading from "./components/common/Loading.tsx";
export const PWAListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      dispatch(setInstallPrompt(e));
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dispatch]);

  return null;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/merchant/">
          <PWAListener />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
