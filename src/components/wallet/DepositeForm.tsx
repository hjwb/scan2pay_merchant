import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

import axios from "axios";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { CopyIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface DepositeFormProps {
  balance: { usdtAmount: number; usdcAmount: number } | null;
}

const DepositeForm: React.FC<DepositeFormProps> = ({ balance }) => {
  const [type, setType] = useState("USDT");
  // const [amount, setAmount] = useState("");
  const [amount2, setAmount2] = useState("");
  //const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  //const [otp, setOtp] = useState("");

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const handleSubmit2 = async () => {
    try {
      setLoading2(true);

      const UserBalance =
        type.toLocaleLowerCase() == "usdt"
          ? Number(balance?.usdtAmount)
          : Number(balance?.usdcAmount);

      console.log(amount2, UserBalance);

      if (Number(amount2) > UserBalance) {
        showError("Insufficient Balance", "");
        return;
      }

      if (!amount2 || !receiverAddress || !receiverAddress.startsWith("0x")) {
        showError("Please enter amount and receiver address correctly.", "");
        return;
      }

      // return;
      const response = await axios.post(
        `${baseUrl}/withdraw`,
        {
          user_id: userData?.id,
          type: type.toLocaleLowerCase(),
          amount: amount2,
          from_wallet_address: String(userData?.wallet_address || ""),
          to_wallet_address: receiverAddress,
          //otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (!response.data.status) {
        showError("Withdraw Failed.", response?.data?.message);
        return;
      }
      showSuccess("Withdraw Successful.", "");
      setReceiverAddress("");
      setAmount2("");
    } catch (error) {
      console.log(error);
      showError("Withdraw Failed.", "");
    } finally {
      setLoading2(false);
    }
  };
/***
  async function handleOtpSend() {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/get-withdraw-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        showSuccess("Otp Sent.", "");
      }
    } catch (error) {
      console.log(error);
      showError("Error", "Error occured while sending the otp.");
    } finally {
      setLoading(false);
    }
  }

  ***/

  return (
    <>
      <div className="flex flex-col gap-6 p-6 rounded-2xl border shadow-md bg-white w-full max-w-xl mx-auto">
        <div className="text-3xl font-bold text-gray-800 mb-2 border-b pb-2">
          Deposit Amount USDT BEP-20
        </div>

        <div className="mt-4 text-gray-700 text-sm flex flex-col items-center gap-3">
          <div className="p-4 rounded-xl border bg-gray-50 shadow-sm flex flex-col items-center">
            <QRCodeCanvas
              value={
                userData?.wallet_address ? String(userData.wallet_address) : ""
              }
              size={200}
              bgColor="transparent"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>

          <span className="self-start font-semibold text-[16px] mt-4 text-gray-800">
            Wallet Address
          </span>

          <div className="flex justify-between items-center bg-[#ecebff] rounded-lg w-full px-5 py-3 shadow-sm border">
            <span className="font-semibold text-gray-800">
              {userData?.wallet_address.toString().slice(0, 14) +
                "..." +
                userData?.wallet_address.toString().slice(-14)}
            </span>
            <CopyIcon
              size={18}
              className="hover:text-[#4D43EF] cursor-pointer transition ease-in-out duration-300"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    userData?.wallet_address
                      ? String(userData.wallet_address)
                      : ""
                  )
                  .then(() => {
                    alert("Address copied to clipboard!");
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                  });
              }}
            />
          </div>

          <div className="py-3 px-4 mt-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm">
            <p className="font-semibold">Note:</p>
            <ul className="list-disc list-inside mt-1">
              <li>
                Scan the QR code using your wallet/copy the wallet address,
                submit the payment amount, and allow some time for your balance
                to update.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex mb-10 flex-col gap-5 p-6 rounded-2xl border shadow-md bg-white w-full max-w-xl mx-auto mt-6">
        <div className="text-3xl font-bold text-gray-800  border-b pb-1">
          Withdraw Amount
        </div>
        <div className="flex justify-between">
          <div>Balance</div>
          <div>
            {type.toLocaleLowerCase() == "usdt"
              ? balance?.usdtAmount.toFixed(4) + " USDT"
              : balance?.usdcAmount.toFixed(4) + " USDC"}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Input
            type="number"
            placeholder="Enter Amount"
            value={amount2}
            onChange={(e) => setAmount2(e.target.value)}
            className="flex-1 rounded-lg border shadow-sm"
          />

          <Select onValueChange={(val) => setType(val)} defaultValue={type}>
            <SelectTrigger className="w-[120px] rounded-lg border shadow-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USDT">USDT</SelectItem>
              {/* <SelectItem value="USDC">USDC</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        <Input
          type="text"
          placeholder="Enter Address"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          className="flex-1 rounded-lg border shadow-sm"
        />
        {/* <div className="mt-2 flex gap-1">
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the Otp..."
            className="flex-1 text-[#4D43EF] font-semibold"
          />
          <button
            onClick={handleOtpSend}
            disabled={loading}
            className="bg-[#4D43EF] text-white rounded-lg px-2 hover:bg-[#4D43EF]/80 cursor-pointer transition ease-in-out duration-300"
          >
            {loading ? "Sending.." : "Send Otp"}
          </button>
        </div> */}
        <Button
          onClick={handleSubmit2}
          disabled={loading2 || !amount2}
          className="bg-[#847EF1] cursor-pointer transition ease-in-out duration-300 hover:bg-[#736df0] text-white font-semibold rounded-lg py-2 shadow-md"
        >
          {loading2 ? "Loading..." : "Withdraw from Wallet"}
        </Button>
      </div>
    </>
  );
};

export default DepositeForm;
