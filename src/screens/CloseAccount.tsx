import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { useShowError } from "@/hooks/useShowError";

export default function CloseAccountPage() {
 
  
const [securityAmount, setSecurityAmount] = useState<string>("");
const [loading, setLoading] = useState(false);


  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [upi, setUpi] = useState("");
  const [reload, setReload] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [detailedReason, setDetailedReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [closeRequested,setCloseRequested] = useState("");

 const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);
 const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  useEffect(() => {
  if (!baseUrl || !token || !userData?.id) return;

  const getUserData = async () => {
    try {
      const profileRes = await axios.post(
        `${baseUrl}/profile`,
        { merchant_id: userData.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const d = profileRes.data?.data;
      
      
      setEmail(String(d?.email ?? ""));
      setWallet(String(d?.wallet_address ?? ""));
      setUpi(String(d?.upi_id ?? ""));
      setCloseRequested(String(d?.is_closed ?? ""));

      const indexRes = await axios.post(
        `${baseUrl}/merchant/index`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

     

    const indexData = indexRes.data?.data;
    setSecurityAmount(String(indexData?.security_amount ?? ""));   

    } catch (err) {
      console.error("Fetch error", err);
      showError("Failed to load merchant data", "");
    }
  };

  getUserData();
}, [reload, baseUrl, token, userData?.id]);





  const reasonOptions = [
    "Financial Issues",
    "Business Closure",
    "Service Dissatisfaction",
    "Switching to Another Platform",
    "Other",
  ];

  const validateForm = () => {
    if (!selectedReason) {
      setError("Please select a reason for closing the account.");
      return false;
    }

    if (detailedReason.length < 50 || detailedReason.length > 300) {
      setError("Detailed reason must be between 50 and 300 characters.");
      return false;
    }

    if (!isConfirmed) {
      setError("You must confirm before submitting.");
      return false;
    }

    setError("");
    return true;
  };




 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      email,
      wallet,
      upi,
      securityAmount,
      reason: selectedReason,
      message: detailedReason,
    };

    console.log("Submit payload:", payload);

      try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/merchant/account-close-request`,
          payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.status) {
        setReload((prev) => !prev);
        setSelectedReason("");
        setDetailedReason("");
        setIsConfirmed(false);
        showSuccess("Request Submitted Successfully", "");
      }else{
         showError(response.data.message, "");
      }
    } catch (error) {
      console.log(error);
      showError("Send request Failed", "");
    } finally {
      setLoading(false);
    }


    
   
}
  
  
  ;



  return (
    <div className="mt-18 px-2 flex flex-col gap-4 max-w-lg mx-auto">
  

        {closeRequested === "pending" ? (
      // Show pending message instead of form
      <div className="border rounded-lg px-5 py-5 bg-[#FFFFFF]/10 flex flex-col gap-3 text-center">
        <h2 className="text-xl font-semibold">
          Close Account Request
        </h2>
        <hr />
        <p className="text-red-600 mt-2">
          Your account close request is currently under process. Please wait for 30 days.
        </p>
      </div>
       ) : (
      <div className="border rounded-lg px-5 py-2 bg-[#FFFFFF]/10 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-center">
          Close Account Request Form
        </h2>
        <hr />

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input value={email} disabled />
        </div>

        {/* Wallet */}
        <div className="flex flex-col gap-2">
          <Label>Wallet Address</Label>
          <Input value={wallet} disabled />
        </div>

        {/* UPI */}
        <div className="flex flex-col gap-2">
          <Label>UPI ID</Label>
          <Input
            placeholder="Enter UPI ID"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            disabled
          />
        </div>


      <div className="flex flex-col gap-2">
          <Label>Security Amount($)</Label>
          <Input
            value={securityAmount}
            disabled
          />
        </div>


        {/* Reason Dropdown */}
        <div className="flex flex-col gap-2">
          <Label>Reason For Closing Account</Label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Reason</option>
            {reasonOptions.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <Label>Detailed Reason (50–300 characters)</Label>
          <textarea
            value={detailedReason}
            onChange={(e) => setDetailedReason(e.target.value)}
            rows={5}
            minLength={50}
            maxLength={300}
            className="p-2 border rounded"
            placeholder="Please explain clearly why you want to close your account"
          />
          <span className="text-xs text-gray-500">
            {detailedReason.length}/300 characters
          </span>
        </div>

        {/* Confirmation */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <Label className="text-sm">
            I confirm that I want to close my merchant account
          </Label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

       
     

          <Button
  onClick={handleSubmit}
  disabled={loading}
  className="bg-[#4D43EF] hover:bg-[#4D43EF]/80 transition duration-300 cursor-pointer"
>
  {loading ? "Submitting..." : "Submit Request"}
</Button>

      </div>
      )}
    </div>
  );
}
