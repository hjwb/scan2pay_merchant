import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import QRCode from "react-qr-code"; // using react-qr-code
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import axios from "axios";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";

// Validation Schema
const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  aadhaar: z.string().min(12, "Aadhaar number is required"),
  pan: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN format (e.g. ABCDE1234F)"
    ),
  wallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum wallet address"),
  hash: z
    .string()
    .regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid Ethereum transaction hash"),

  aadhaarFront: z.any(),
  aadhaarBack: z.any(),
  securityImage: z.any(),
  panImg: z.any(),
});

const Verify: React.FC = () => {
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const userData = useSelector((state: RootState) => state.user.userData);

  const navigate = useNavigate();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [securityAmount, setSecurityAmount] = useState(0);
  const [data, setData] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      aadhaar: "",
      pan: "",
      wallet: "",
      hash: "",
      aadhaarFront: null,
      aadhaarBack: null,
      securityImage: null,
      panImg: null,
    },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      // console.log(values);
      const formData = new FormData();

      formData.append("merchant_id", userData?.id.toString());
      formData.append("name", values.name);
      formData.append("phone_no", values.phone);
      formData.append("aadhar_no", values.aadhaar);
      formData.append("pan_no", values.pan);
      formData.append("wallet_address", values.wallet);
      formData.append("transaction_hash", values.hash);

      // Append file fields
      formData.append("aadhar_front_image", values.aadhaarFront);
      formData.append("aadhar_back_image", values.aadhaarBack);
      formData.append("pan_image", values.panImg);
      formData.append("security_image", values.securityImage);

      const response = await axios.post(
        `${baseUrl}/merchant/request-to-approve`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      if (response.data.status) {
        showSuccess(
          "Request Sent Successfully.",
          "You can view your request by logging in again."
        );
        navigate("/");
      }
    } catch (error) {
      showError("Request Failed!", "");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchApproval() {
      try {
        const response = await axios.post(
          `${baseUrl}/merchant/get-approval-request`,
          { merchant_id: userData.id }
        );

        console.log(response.data);

        setWalletAddress(response?.data?.admin_wallet_address);
        setSecurityAmount(response?.data?.security_amount);

        if (response.data.data === "no_request") {
          setShow(false);
          setData(response.data);
        } else {
          setShow(true);
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchApproval();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <>
      {show ? (
        <div className="px-4 py-5 flex flex-col gap-6 justify-center min-h-screen max-w-lg mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 text-center">
            Pending Request
          </h2>

          <Card className="p-6 shadow-lg border border-gray-200 rounded-xl bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Name */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </span>
                <span className="text-gray-900 text-base font-medium">
                  {data?.data.account_holder_name}
                </span>
              </div>

              {/* Wallet Address */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  Admin Wallet Address
                </span>
                <span className="text-gray-900 text-base flex items-center gap-3">
                  {" "}
                  {data?.admin_wallet_address.slice(0, 5) +
                    "..." +
                    data?.admin_wallet_address.slice(-5)}
                  <Copy
                    size={15}
                    className="transition ease-in-out duration-300 cursor-pointer hover:text-gray-500"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(data?.admin_wallet_address)
                        .then(() => {
                          alert("Admin Wallet Address Copied");
                        })
                        .catch((err) => {
                          console.error("Failed to copy: ", err);
                        });
                    }}
                  />
                </span>
              </div>

              {/* Sender Wallet */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  Sender Wallet
                </span>
                <span className="text-gray-900 text-base flex items-center gap-3">
                  {data?.data.merchant_wallet_address.slice(0, 5) +
                    "..." +
                    data?.data.merchant_wallet_address.slice(-5)}
                  <Copy
                    size={15}
                    className="transition ease-in-out duration-300 cursor-pointer hover:text-gray-500"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(data?.data.merchant_wallet_address)
                        .then(() => {
                          alert("Sender Wallet Address Copied");
                        })
                        .catch((err) => {
                          console.error("Failed to copy: ", err);
                        });
                    }}
                  />
                </span>
              </div>

              {/* PAN Number */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  PAN Number
                </span>
                <span className="text-gray-900 text-base">
                  {data?.data.pan_no}
                </span>
              </div>

              {/* Aadhaar Number */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  Aadhaar Number
                </span>
                <span className="text-gray-900 text-base">
                  {data?.data.aadhar_no}
                </span>
              </div>

              {/* Transaction Hash */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  Transaction Hash
                </span>
                <span className="text-gray-900 text-base flex items-center gap-3">
                  {data?.data.transaction_hash.slice(0, 5) +
                    "..." +
                    data?.data.transaction_hash.slice(-5)}
                  <Copy
                    className="transition ease-in-out duration-300 cursor-pointer hover:text-gray-500"
                    size={15}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(data?.data.transaction_hash)
                        .then(() => {
                          alert("Transaction Hash Copied");
                        })
                        .catch((err) => {
                          console.error("Failed to copy: ", err);
                        });
                    }}
                  />
                </span>
              </div>

              {/* Amount (spans full width) */}
              <div className="flex flex-col md:col-span-2">
                <span className="font-semibold text-gray-500 uppercase tracking-wide">
                  Amount
                </span>
                <span className="text-green-600 font-semibold text-xl mt-1">
                  {data?.data.security_amount} USDT
                </span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#4D43EF] cursor-pointer transtion ease-in-out duration-300"
            >
              Go Back{" "}
            </Button>
          </Card>
        </div>
      ) : (
        <div className="px-4 py-5 flex flex-col gap-3 justify-center min-h-screen max-w-lg mx-auto">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center">Verify Merchant</h2>

          {/* Wallet + QR Section */}
          <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center gap-3 mt-2">
            <p className="font-semibold text-center">
              Transfer Payment (USDT BEP20)
            </p>

            {/* QR Code */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <QRCode value={walletAddress ? walletAddress : ""} size={150} />
            </div>
            <div className="flex gap-3 font-semibold">
              Amount:
              <span className="font-bold text-[#4D43EF]">
                {securityAmount} USDT
              </span>{" "}
            </div>
            <div className="p-3 flex items-center justify-center gap-3 bg-gray-100 rounded-lg w-full break-all text-center select-all cursor-pointer">
              {walletAddress?.slice(0, 10) +
                "....." +
                walletAddress?.slice(-10)}{" "}
              <Copy
                size={15}
                className="cursor-pointer hover:text-gray-600 transition ease-in-out duration-300"
                onClick={() => {
                  navigator.clipboard
                    .writeText(walletAddress)
                    .then(() => {
                      alert("Wallet Address Copied");
                    })
                    .catch((err) => {
                      console.error("Failed to copy: ", err);
                    });
                }}
              />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 bg-white p-5 rounded-xl border shadow-sm"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aadhaar Number */}
              <FormField
                control={form.control}
                name="aadhaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Aadhaar number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aadhaar Images Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Front */}
                <FormField
                  control={form.control}
                  name="aadhaarFront"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Front</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Back */}
                <FormField
                  control={form.control}
                  name="aadhaarBack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Back</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* PAN Number */}
              <FormField
                control={form.control}
                name="pan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PAN number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PAN Image */}
              <FormField
                control={form.control}
                name="panImg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Proof Image (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Wallet Address */}
              <FormField
                control={form.control}
                name="wallet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Wallet Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Wallet address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transaction Hash */}
              <FormField
                control={form.control}
                name="hash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Hash</FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction hash" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4D43EF] cursor-pointer transtion ease-in-out duration-300"
              >
                {loading ? "Please Wait..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default Verify;
