import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface DashboardProps {
  usdtAmount?: number;
  usdcAmount?: number;
  transactionCount?: number;
  walletAddress?: number;
}
interface DepositeFormProps {
  setBalance: (value: { usdtAmount: number; usdcAmount: number }) => void;
}

const DataBox: React.FC<DepositeFormProps> = ({ setBalance }) => {
  const [loading, setloading] = useState(false);
  const [data, setData] = useState<DashboardProps | null>(null);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);

  async function fetchData() {
    try {
      console.log(loading);
      setloading(true);
      const response = await axios.post(
        `${baseUrl}/merchant/index`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data.data);

      if (response.data.status == "false") {
        setData(null);
        return;
      }

      setData({
        usdtAmount: response.data.data.total_usdt,
        usdcAmount: response.data.data.total_usdc,
        transactionCount: response.data.data.total_transactions,
        walletAddress: response.data.data.wallet_address,
      });
      setBalance({
        usdtAmount: response.data.data.total_usdt,
        usdcAmount: response.data.data.total_usdc,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 10000);

    // console.log(transaction.length)
  }, []);

  return (
    <div className="card relative overflow-hidden border-b-2 border-r border-[#4D43EF] bg-[#ebe5f7] shadow-2xl rounded-2xl">
      <div className="absolute inset-0 bg-linear-to-br from-[#7728E2] via-[#5C5AD7] to-[#22BDCF] opacity-90 rounded-2xl" />

      <div className="relative z-10 p-4 sm:p-5 md:p-6 text-white">
        <div className="mb-4 text-center sm:text-left">
          <h3 className="font-semibold text-lg sm:text-xl tracking-wide">
            Your Balance
          </h3>
          <p className="text-xs sm:text-sm text-gray-100 font-medium">
            Balance Details
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="sm:col-span-2 grid grid-cols-1 xs:grid-cols-1 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4">
              <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
                ${data ? data.usdtAmount.toFixed(4) : "0.0000"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                USDT Holding
              </div>
            </div>

            {/* <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4">
              <div className="font-extrabold text-2xl sm:text-3xl text-gray-100">
                ${data ? data.usdcAmount.toFixed(4) : "0.0000"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">
                USDC Holding
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBox;
