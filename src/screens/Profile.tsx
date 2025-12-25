import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { useShowError } from "@/hooks/useShowError";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [upi, setUpi] = useState("");
  const [accHolder, setAccHolder] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [reload, setReload] = useState(false);
  const [upiLoading, setUpiLoading] = useState(false);
  const [bankLoading, setBankLoading] = useState(false);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.post(
        `${baseUrl}/profile`,
        {
          merchant_id: userData?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const d = response.data.data;
      // console.log(d)
      // SET INPUT VALUES
      setEmail(d?.email ?? "");
      setBankName(d?.bank_name ?? "");
      setWallet(d?.wallet_address ?? "");
      setUpi(d?.upi_id ?? "");
      setAccHolder(d?.account_holder_name ?? "");
      setIfsc(d?.ifsc ?? "");
      setAccNumber(d?.account_no ?? "");
    };

    getUserData();
  }, [reload]);

  const saveUPI = async () => {
    try {
      setUpiLoading(true);
      console.log(typeof upi, upi);
      const response = await axios.post(
        `${baseUrl}/merchant/update-upi`,
        {
          upi_id: upi,
        },
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
        showSuccess("Upi Updated Successfully", "");
      }
    } catch (error) {
      console.log(error);
      showError("Upi Update Failed", "");
    } finally {
      setUpiLoading(false);
    }
  };

  const saveBankDetails = async () => {
    try {
      setBankLoading(true);
      const response = await axios.post(
        `${baseUrl}/merchant/update-bank`,
        {
          account_holder_name: accHolder,
          bank_name: bankName,
          ifsc: ifsc,
          account_no: accNumber,
        },
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
        showSuccess("Bank Details Updated Successfully", "");
      }
    } catch (error) {
      console.log(error);
      showError("Bank Details Update Failed", "");
    } finally {
      setBankLoading(false);
    }
  };

  return (
    <div className="mt-18 px-2 flex flex-col gap-4 max-w-lg mx-auto">
      <div className="border rounded-lg px-5 py-2 bg-[#4D43EF]/10 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-center">Profile</h2>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            placeholder="Enter email"
            value={email}
            disabled
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Wallet Address */}
        <div className="flex flex-col gap-2">
          <Label>Wallet Address</Label>
          <Input
            placeholder="Enter wallet address"
            value={wallet}
            disabled
            onChange={(e) => setWallet(e.target.value)}
          />
        </div>

        {/* UPI */}
        <div className="flex flex-col gap-2">
          <Label>UPI ID</Label>
          <Input
            placeholder="Enter UPI ID"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
          />

          <Button
            className="bg-[#4D43EF] hover:bg-[#4D43EF]/80 transition duration-300 cursor-pointer"
            onClick={saveUPI}
            disabled={upiLoading}
          >
            {upiLoading ? "Saving..." : "Save UPI"}
          </Button>
        </div>

        {/* BANK DETAILS */}
        <div className="border rounded-lg p-4 bg-white flex flex-col gap-4">
          <Label className="font-semibold">Bank Details</Label>

          <div className="flex flex-col gap-1">
            <Label>Bank Name</Label>
            <Input
              placeholder="Enter bank name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
          {/* Account Holder */}
          <div className="flex flex-col gap-1">
            <Label>Account Holder Name</Label>
            <Input
              placeholder="Enter account holder name"
              value={accHolder}
              onChange={(e) => setAccHolder(e.target.value)}
            />
          </div>

          {/* IFSC */}
          <div className="flex flex-col gap-1">
            <Label>IFSC Code</Label>
            <Input
              placeholder="Enter IFSC code"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
            />
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-1">
            <Label>Account Number</Label>
            <Input
              placeholder="Enter account number"
              value={accNumber}
              onChange={(e) => setAccNumber(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <Button
            className="bg-[#4D43EF] hover:bg-[#4D43EF]/80 transition duration-300 cursor-pointer"
            onClick={saveBankDetails}
            disabled={bankLoading}
          >
            {bankLoading ? "Saving..." : "Save Bank Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}
