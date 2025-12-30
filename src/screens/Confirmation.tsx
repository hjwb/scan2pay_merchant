import React, { useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "motion/react";
import axios from "axios";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setTrxSuccess, setTrxFail } from "../../src/store/slices/modelSlice";

import { useShowError } from "@/hooks/useShowError";
//import { useShowSuccess } from "@/hooks/useShowSuccess";

// import process from "@/"
const Confirmation: React.FC = () => {
  const { orderid } = useParams();


    const { showError } = useShowError();
  //const { showSuccess } = useShowSuccess();

  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (data) {
      return;
    }
    const interval = setInterval(async () => {
      try {
        setLoading(true);
        if (data) {
          setLoading(false);
          clearInterval(interval);
          return;
        }
        const response = await axios.post(
          `${baseUrl}/merchant/get-payment-details`,
          { order_id: orderid },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        if (response.data.status) {
          setData(response.data.data);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function handleApprove() {
    try {
      setLoading2(true);

      const response = await axios.post(
        `${baseUrl}/merchant/confirm-payment`,
        { order_id: orderid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.status === true) {
        navigate("/dashboard");
        dispatch(setTrxSuccess({ showTrxSuccess: true }));
      }else{
           showError("Error", response.data.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(setTrxFail({ showTrxFail: true }));
    } finally {
      setLoading2(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative bg-white rounded-lg p-8 max-w-3xl w-full mx-4">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 transition ease-in-out duration-300 font-bold cursor-pointer right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <img
              src={data.payment_screenshot}
              alt="Payment Screenshot"
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
      {loading ? (
        <div className="mt-24 px-3 flex flex-col gap-8 max-w-lg mx-auto min-h-[600px] ">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white flex-1 items-center justify-center shadow-2xl rounded-2xl px-8 py-10 w-full flex flex-col"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 1,
              }}
            ></motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <img
                src="/merchant/process.gif"
                className="aspect-square w-20 mx-auto mb-20"
              />

              <p className="text-gray-500 text-sm mt-1">
                Please wait while we are preparing things & don't close the
                page. <br />
                As the user will be processing payment it can take a while.
              </p>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="mt-24 px-3 flex flex-col gap-8 max-w-lg mx-auto">
          <div className="space-y-5 border rounded-xl p-6 shadow-lg bg-white/80 backdrop-blur">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Order Details
              </h2>
              <p className="text-sm text-muted-foreground">
                Review and approve the order below.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Order ID
                </span>
                <span className="font-semibold">{data.order_id}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  UPI Reference
                </span>
                <span className="font-semibold">{data.upi_reference}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Transfer To User
                </span>
                <span className="font-semibold">
                  {data.amount.toFixed(6)} {data.type.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">Fee</span>
                <span className="font-semibold uppercase">
                  {((data.amount * data.fees) / 100).toFixed(6)}{" "}
                  {data.type.toUpperCase()}
                </span>
              </div>{" "}
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Total Amount Deduction
                </span>
                <span className="font-semibold uppercase">
                  {((data.amount * data.fees) / 100 + data.amount).toFixed(6)}{" "}
                  {data.type.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  UPI Id
                </span>
                <span className="font-semibold">{data.upi_id ?? "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  INR Amount
                </span>
                <span className="font-semibold">
                  ₹ {data.inr_amount ?? "-"}
                </span>
              </div>
               <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Extra Fees
                </span>
                <span className="font-semibold">
                  {parseFloat(data.fees_amount).toFixed(6) ?? "-"} USDT
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-muted-foreground">
                  Proof (Screenshot)
                </span>
                <span className="font-semibold">
                  {data.payment_screenshot ? (
                    <button
                      onClick={() => setOpen(true)}
                      className="font-semibold flex items-center text-blue-600 hover:underline text-left"
                    >
                      Open <ExternalLink size={16} />
                    </button>
                  ) : (
                    <span className="font-semibold">-</span>
                  )}
                </span>
              </div>
            </div>

            <Button
              className="w-full cursor-pointer rounded-lg py-5 text-base tracking-wide 
      bg-[#4D43EF] hover:bg-[#4D43EF]/90 transition-all duration-300
      shadow-md hover:shadow-xl hover:scale-105"
              onClick={handleApprove}
            >
              {loading2 ? "Processing..." : "Approve"}
            </Button>
          </div>
          <Alert className="border-yellow-400 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold text-yellow-700">
              Important Notice
            </AlertTitle>
            <AlertDescription className="text-yellow-700 text-sm leading-relaxed">
              Do not close this tab or navigate away from this page. Leaving or
              refreshing may put this transaction into dispute and delay
              processing.
            </AlertDescription>
          </Alert>
        </div>
      )}{" "}
    </>
  );
};

export default Confirmation;
