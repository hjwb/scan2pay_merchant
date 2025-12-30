import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import type { RootState } from "@/store/store";
import axios from "axios";
import { Wallet, Receipt, ScanBarcode, Handshake, ShieldPlus } from "lucide-react";
import { useEffect, useState } from "react";
// import type { Root } from "react-dom/client";
import { BiRupee } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface DashboardProps {
  usdtAmount?: number;
  usdcAmount?: number;
  securityAmount?: number;
  transactionCount?: number;
  walletAddress?: number;
  inr?: number;
  trxCount?: number;
  trxAmt?: number;
  profit?: number;
}

export default function DashboardPage() {
  const [loading, setloading] = useState(false);
  const [data, setData] = useState<DashboardProps | null>(null);

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);
  const ordersCount = useSelector(
    (state: RootState) => state.consts.ordersCount
  );

  const navigate = useNavigate();

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
      console.log(response.data.data);

      if (response.data.status == "false") {
        setData(null);
        return;
      }

      setData({
        usdtAmount: response.data.data.total_usdt,
        usdcAmount: response.data.data.total_usdc,
        securityAmount:response.data.data.security_amount,
        transactionCount: response.data.data.total_transactions,
        walletAddress: response.data.data.wallet_address,
        inr: response.data.data.total_inr,
        trxCount: response.data.data.today_transactions,
        trxAmt: response.data.data.today_transactions_amount,
        profit: response.data.data.today_profit,
      });

    const autoPlay = response?.data?.data?.auto_play_sound === "1" ? "1" : "0";
    localStorage.setItem("auto_play_sound", autoPlay);


    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // console.log(transaction.length)
  }, []);
  return (
    <div className="mt-24 px-3 flex flex-col gap-8 max-w-lg mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-center gap-2">
        {/* <Sparkles className="text-[#4D43EF] animate-pulse" /> */}
        <h2 className="text-3xl font-extrabold bg-linear-to-r from-[#4D43EF] to-blue-600 bg-clip-text text-transparent">
          Merchant Dashboard
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3">
        {/* USDT */}
        <MagicCard
          gradientColor="#b7b3ff"
          goto="funds-detail"
          className="p-5 cursor-pointer rounded-2xl backdrop-blur-md border border-[#4D43EF]/40 
                    bg-white/60 hover:bg-[#4D43EF]/5 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-[#4D43EF]">
              USDT Balance
            </CardTitle>
            <Wallet
              size={24}
              className="text-[#4D43EF] drop-shadow-sm animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl text-2xl font-bold text-gray-900 tracking-tight">
              $ {data?.usdtAmount.toFixed(4) ?? 0.0}
            </p>
          </CardContent>
        </MagicCard>

        {/* USDC */}
        {/* <MagicCard
          gradientColor="#a4f0b0"
          goto="funds-detail"
          className="p-5 cursor-pointer rounded-2xl backdrop-blur-md border border-green-500/40 
                    bg-white/60 hover:bg-green-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-green-700">
              USDC Balance
            </CardTitle>
            <CircleDollarSign
              size={24}
              className="text-green-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl text-2xl font-bold text-gray-900 tracking-tight">
              $ {data?.usdcAmount.toFixed(4) ?? 0.0}
            </p>
          </CardContent>
        </MagicCard> */}

        <MagicCard
          goto="funds-detail"
          gradientColor="#f45858"
          className="p-5 rounded-2xl cursor-pointer backdrop-blur-md border border-red-500/40
                    bg-white/60 hover:bg-orange-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-red-700">
              INR Balance
            </CardTitle>
            <BiRupee
              size={24}
              className="text-red-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl overflow-hidden text-2xl font-bold text-gray-900 tracking-tight">
              ₹ {data?.inr.toFixed(4) ?? 0.0}
            </p>
          </CardContent>
        </MagicCard>

        {/* Transaction Count */}
        <div className="flex gap-3">
          <div
            className="flex-2"
            onClick={() => {
              navigate("/transactions");
            }}
          >
            <MagicCard
              gradientColor="#b5cdf8"
              className="p-5 h-full cursor-pointer rounded-2xl backdrop-blur-md border border-blue-500/40
                    bg-white/60 hover:bg-blue-50 hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-1">
                <CardTitle className="text-lg font-semibold text-blue-700">
                  Total Transactions
                </CardTitle>
                <Receipt
                  size={24}
                  className="text-blue-600 animate-[pulse_2s_infinite]"
                />
              </CardHeader>
              <CardContent>
                <p className="md:text-4xl text-2xl font-bold text-gray-900 tracking-tight">
                  {data?.transactionCount ?? 0}
                </p>
              </CardContent>
            </MagicCard>
          </div>
          <div
            className="flex-1"
            onClick={() => {
              navigate("/pending-request");
            }}
          >
            <MagicCard
              gradientColor="#b5cdf8"
              className="p-5 h-full flex cursor-pointer items-center justify-center rounded-2xl backdrop-blur-md border border-blue-500/40
                    bg-white/60 hover:bg-blue-50 hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-center">
                <CardTitle className="text-lg flex gap-2 items-center  font-semibold text-blue-700">
                  Orders
                  <Receipt
                    size={24}
                    className="text-blue-600 animate-[pulse_2s_infinite]"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="md:text-4xl text-2xl font-bold text-gray-900 tracking-tight">
                  {ordersCount ?? 0}
                </p>
              </CardContent>
            </MagicCard>
          </div>
        </div>

        <MagicCard
          goto="funds-detail"
          gradientColor="#177A55"
          className="p-5 rounded-2xl cursor-pointer backdrop-blur-md border border-emerald-500/40
                    bg-white/60 hover:bg-orange-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-emerald-700">
              Today's Transaction
            </CardTitle>
            <ScanBarcode 
              size={24}
              className="text-emerald-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl overflow-hidden text-2xl font-bold text-gray-900 tracking-tight">
              {data?.trxCount ?? 0}
            </p>
          </CardContent>
        </MagicCard>

        <MagicCard
          goto="funds-detail"
          gradientColor="#C94376"
          className="p-5 rounded-2xl cursor-pointer backdrop-blur-md border border-pink-500/40
                    bg-white/60 hover:bg-orange-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-pink-700">
              Today's Business
            </CardTitle>
            <Handshake 
              size={24}
              className="text-pink-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl overflow-hidden text-2xl font-bold text-gray-900 tracking-tight">
              $ {data?.trxAmt.toFixed(4) ?? 0.0} 
            </p>
          </CardContent>
        </MagicCard>

        <MagicCard
          goto="funds-detail"
          gradientColor="#BB4D18"
          className="p-5 rounded-2xl  cursor-pointer backdrop-blur-md border border-amber-500/40
                    bg-white/60 hover:bg-orange-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-amber-700">
              Today's Profit
            </CardTitle>
            <ShieldPlus 
              size={24}
              className="text-amber-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl overflow-hidden text-2xl font-bold text-gray-900 tracking-tight">
              $ {data?.profit.toFixed(4) ?? 0.0}
            </p>
          </CardContent>
        </MagicCard>


         <MagicCard
          goto="funds-detail"
          gradientColor="#f5b0bbff"
          className="p-5 rounded-2xl mb-10 cursor-pointer backdrop-blur-md border border-red-500/40
                    bg-white/60 hover:bg-primary-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-red-700">
              Security Deposit
            </CardTitle>
            <Wallet 
              size={24}
              className="text-red-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl overflow-hidden text-2xl font-bold text-gray-900 tracking-tight">
              $ {data?.securityAmount.toFixed(4) ?? 0.0}
            </p>
          </CardContent>
        </MagicCard>



        


        {/* Total Business */}
        {/* <MagicCard
          gradientColor="#f5d3b0"
          className="p-5 rounded-2xl backdrop-blur-md border border-orange-500/40
                    bg-white/60 hover:bg-orange-50 hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-lg font-semibold text-orange-700">
              Wallet Address
            </CardTitle>
            <BarChart3
              size={24}
              className="text-orange-600 animate-[pulse_2s_infinite]"
            />
          </CardHeader>
          <CardContent>
            <p className="md:text-4xl overflow-hidden text-2xl font-bold text-gray-900 tracking-tight">
              $
              {data?.walletAddress
                ? data?.walletAddress.toString().slice(0, 7) +
                  "....." +
                  data?.walletAddress.toString().slice(-7)
                : "Loading..."}
            </p>
          </CardContent>
        </MagicCard> */}
      </div>
    </div>
  );
}
