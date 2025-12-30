import type { AppDispatch, RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { useShowError } from "@/hooks/useShowError";
import { useDispatch } from "react-redux";
import { setTrxSuccess } from "@/store/slices/modelSlice";

const ScanConfirmation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [upiId, setUpiId] = useState("");
  const [fees, setFees] = useState<number>(0);
  // const [showloader, setShowLoader] = useState(false);

   const [screenshotRequired, setScreenshotRequired] = useState("0");

  const navigate = useNavigate();
  const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  const dispatch = useDispatch<AppDispatch>();

  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  const { order_id } = useParams<{
    order_id: string;
  }>();

  const tokenHeader = useSelector((state: RootState) => state?.user?.token);
  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);

  const openPaytm = () => {
    const upiLink = `upi://pay?pa=${data?.scan_upi}&am=${data?.inr_amount}&cu=INR&tn=Test%20Payment`;

    window.location.href = upiLink;
  };

  useEffect(() => {
    fetchFees();

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/merchant/get-scan-details`,
          { order_id },
          {
            headers: {
              Authorization: `Bearer ${tokenHeader}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response data:", response.data);
        if (
          response.data.status &&
          response?.data?.payment_mode == "automatic"
        ) {
          setTimeout(() => {
            showSuccess("Payment Successful.", "");
            navigate("/transactions");
          }, 20000);
          return;
        }
        setUpiId(response?.data?.data?.merchant_upi_id);
          setScreenshotRequired(response?.data?.data?.screenshot_status);
        if (response.data.status) {
          setData(response.data.data.order);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching:", err);
        setLoading(false);
        navigate("dashboard");
      }
    };

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  async function fetchFees() {
    try {
      const response = await axios.get(`${baseUrl}/get-fee`);
      // console.log(response.data)
      setFees(response.data.fee);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCopy = () => {
    if (data?.scan_upi) navigator.clipboard.writeText(data.scan_upi);
  };

  //alert(screenshotRequired);

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      const formData = new FormData();

      console.log({ uploadedImage });

     

   if (screenshotRequired === "1" && !uploadedImage) {
     showError("Please provide screenshot as proof.", "");
    return;
    }

      formData.append("order_id", order_id);
      formData.append("upi_reference", note);
    
      formData.append("upi_id", upiId);

      
      if (uploadedImage) {
         formData.append("screenshot", uploadedImage);
      }

      const response = await axios.post(
        `${baseUrl}/submit-scan-payment-proof`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Submit response:", response.data);
       if (response.data.status === true){
        showSuccess("Payment proof submitted successfully.", "");
        navigate("/dashboard");
        dispatch(setTrxSuccess({ showTrxSuccess: true }));
      }else{
       showError(response.data.message, "");
      }
    } catch (err) {
      console.error("Error submitting:", err);
      showError("Failed to submit payment proof. Please try again.", "");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <img
          src="/merchant/process.gif"
          className="aspect-square w-20 mx-auto mb-5"
        />
        <p className="text-slate-600 text-lg">Please wait ...</p>
        <p className="text-slate-600 text-lg">While the User uploads the QR.</p>

        <style>{`
          .loader {
            border: 4px solid #e2e8f0;
            border-top: 4px solid #0f172a;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const upiQR = `upi://pay?pa=${data?.scan_upi}&pn=Merchant&am=${data?.inr_amount}&cu=INR`;

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-100 pt-18 p-3">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Scan to Pay
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                upiQR
              )}`}
              alt="upi-qr"
              className="rounded-xl shadow-lg"
            />
          </div>

          <div className="text-base">
            <div className="flex justify-between  font-medium text-slate-700">
              Order Id{" "}
              <span className="font-bold text-green-700">{data?.order_id}</span>
            </div>
            <div className="flex justify-between  font-medium text-slate-700">
              Amount to Pay{" "}
              <span className="font-bold  text-green-700">
                ₹{data?.inr_amount}
              </span>
            </div>
            <div className="flex justify-between  font-medium text-slate-700">
              Base Amount{" "}
              <span className="font-bold  text-green-700">
                {data?.amount.toFixed(6)} {data.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between  font-medium text-slate-700">
              Fees{" "}
              <span className="font-bold  text-green-700">
                {((data?.amount * fees) / 100).toFixed(6)}{" "}
                {data.type.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between  font-medium text-slate-700">
              You Receive{" "}
              <span className="font-bold  text-green-700">
                {(data?.amount - (data?.amount * fees) / 100).toFixed(6)}{" "}
                {data.type.toUpperCase()}
              </span>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={openPaytm}
              className="mt-3 hover:bg-sky-600 transition ease-in-out duration-300 cursor-pointer  bg-sky-500 text-semibold text-white w-full py-2 rounded-lg"
            >
              Pay with UPI App
            </button>
          )}
          <div>
            {" "}
            <p className="font-semibold text-sm mb-1">Receiver UPI Id</p>
            <div className="flex items-center bg-slate-100 p-3 rounded-xl border">
              <span className="flex-1 font-medium text-slate-800 overflow-hidden">
                {data?.scan_upi}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Upload Screenshot</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadedImage(e.target.files?.[0] ?? null)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sender UPI Id</Label>
            <Input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI Id"
            />
          </div>
          <div className="space-y-2">
            <Label>Trxn Id / UTR Number</Label>
            <Input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter Transaction Id / UTR Number"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={btnLoading || note.trim() === ""}
            className="w-full cursor-pointer transition ease-in-out duration-300 text-lg py-3 rounded-xl bg-[#4D43EF] hover:bg-[#4D43EF]/70"
          >
            {btnLoading ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanConfirmation;
