import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
const Error = React.lazy(() => import("./components/common/Error"));
const Success = React.lazy(() => import("./components/common/Success"));
const PublicRoute = React.lazy(() => import("./components/common/PublicRoute"));
const ProtectedRoute = React.lazy(
  () => import("./components/common/ProtectedRoute")
);
const Verification = React.lazy(
  () => import("./components/common/Verification")
);
const Profile = React.lazy(() => import("./screens/Profile"));
const Transaction = React.lazy(() => import("./screens/Transaction"));
const Wallet = React.lazy(() => import("./screens/Wallet"));
const Confirmation = React.lazy(() => import("./screens/Confirmation"));
const TrxConfirm = React.lazy(() => import("./components/common/TrxConfirm"));
const TrxError = React.lazy(() => import("./components/common/TrxError"));
const SellConfirmation = React.lazy(() => import("./screens/SellConfirmation"));
const ScanConfirmation = React.lazy(() => import("./screens/ScanConfirmation"));
const OrderDetails = React.lazy(() => import("./screens/OrderDetails"));
const PendingRequest = React.lazy(() => import("./screens/PendingRequest"));
const Funds = React.lazy(() => import("./screens/Funds"));
const ProcessingRequests = React.lazy(
  () => import("./screens/ProcessingRequest")
);
const Verify = React.lazy(() => import("./screens/Verify"));
// const Dispute = React.lazy(() => import("./screens/Dispute"));
const DisputeStatus = React.lazy(() => import("./screens/DisputeStatus"));
const DisputeForm = React.lazy(() => import("./screens/DisputeForm"));

const App: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const showError = useSelector(
    (state: RootState) => state.model.showErrorModel
  );
  const showSuccess = useSelector(
    (state: RootState) => state.model.showSuccessModel
  );
  const showTrxFail = useSelector(
    (state: RootState) => state.model.showTrxFail
  );
  const showTrxSuccess = useSelector(
    (state: RootState) => state.model.showTrxSuccess
  );
  return (
    <>
      {showError && <Error />}
      {showSuccess && <Success />}
      <TrxConfirm open={showTrxSuccess} />
      <TrxError open={showTrxFail} />
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center text-xl font-semibold"></div>
        }
      >
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/auth/verification" element={<Verification />} />
            <Route path="/verify-merchant" element={<Verify />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/confirmation/:orderid" element={<Confirmation />} />
            <Route
              path="/sell-confirmation/:orderid/:upi_id/:amount/:usdt/:type"
              element={<SellConfirmation />}
            />
            <Route path="/order/:order_id?" element={<OrderDetails />} />
            <Route
              path="/scan-confirmation/:order_id/:upi_id/:amount"
              element={<ScanConfirmation />}
            />
            <Route path="/funds-detail" element={<Funds />} />
            <Route path="/pending-request" element={<PendingRequest />} />
            <Route path="/processing-orders" element={<ProcessingRequests />} />
            {/* <Route path="/dispute" element={<Dispute />} /> */}
            <Route path="/dispute-details" element={<DisputeStatus />} />
            <Route path="/dispute-form" element={<DisputeForm />} />
          </Route>
        </Routes>
      </React.Suspense>
    </>
  );
};

export default App;
