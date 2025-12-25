import type { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Funds: React.FC = () => {
  const [data, setData] = useState(null);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(
          `${baseUrl}/merchant/transaction-data-details`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.totals);
        setData(response.data.totals);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="mt-24 mb-10 px-3 flex flex-col gap-8 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            title: "Total INR",
            value: data?.inr ? `₹ ${data?.inr?.total.toFixed(4)}` : "₹ 0.0000",
          },
          {
            title: "Buy INR Amount",
            value: data?.inr ? `₹ ${data?.inr?.buy.toFixed(4)}` : "₹ 0.0000",
          },
          {
            title: "Sell INR Amount",
            value: data?.inr ? `₹ ${data?.inr?.sell.toFixed(4)}` : "₹ 0.0000",
          },
          {
            title: "Scan&Pay INR Amount",
            value: data?.inr ? `₹ ${data?.inr?.scan.toFixed(4)}` : "₹ 0.0000",
          },

          // {
          //   title: "Total USDC",
          //   value: data?.usdc
          //     ? `${data?.usdc?.total.toFixed(4)} USDC`
          //     : "0.0000 USDC",
          // },
          // {
          //   title: "Buy USDC Amount",
          //   value: data?.usdc
          //     ? `${data?.usdc?.total.toFixed(4)} USDC`
          //     : "0.0000 USDC",
          // },
          // {
          //   title: "Sell USDC Amount",
          //   value: data?.usdc
          //     ? `${data?.usdc?.total.toFixed(4)} USDC`
          //     : "0.0000 USDC",
          // },
          // {
          //   title: "Scan&Pay USDC Amount",
          //   value: data?.usdc
          //     ? `${data?.usdc?.total.toFixed(4)} USDC`
          //     : "0.0000 USDC",
          // },

          {
            title: "Total USDT",
            value: data?.usdt
              ? `${data?.usdt?.total.toFixed(4)} USDT`
              : "0.0000 USDT",
          },
          {
            title: "Buy USDT Amount",
            value: data?.usdt
              ? `${data?.usdt?.buy.toFixed(4)} USDT`
              : "0.0000 USDT",
          },
          {
            title: "Sell USDT Amount",
            value: data?.usdt
              ? `${data?.usdt?.sell.toFixed(4)} USDT`
              : "0.0000 USDT",
          },
          {
            title: "Scan&Pay USDT Amount",
            value: data?.usdt
              ? `${data?.usdt?.scan.toFixed(4)} USDT`
              : "0.0000 USDT",
          },

          {
            title: "Freezed USDT Amount",
            value: data?.usdt
              ? `${data?.usdt?.frozen.toFixed(4)} USDT`
              : "0.0000 USDT",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-[#4947F1] bg-white shadow-md flex flex-col"
          >
            <p className="text-sm font-medium text-black">{item.title}</p>
            <p className="text-xl font-bold mt-1 text-[#4947F1]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funds;
