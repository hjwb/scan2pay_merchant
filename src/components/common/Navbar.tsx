import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
// import { TextAnimate } from "../ui/text-animate";
import { ShimmerButton } from "../ui/shimmer-button";
import { useNavigate, useLocation } from "react-router";
import { Menu } from "lucide-react";
import { setSidebar } from "@/store/slices/modelSlice";
import {
  setSellingPriceUSDT,
  setBuyingPriceUSDT,
  setSellingPriceUSDC,
  setBuyingPriceUSDC,
} from "@/store/slices/priceSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import axios from "axios";
import InstallButton from "../PWAInstall/InstallButton";
import { useParams } from "react-router";

const Navbar: React.FC = () => {
  const [showSelling, setShowSelling] = useState(0);

  const { order_id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isSidebarVisible = useSelector(
    (state: RootState) => state.model.showSidebar
  );
  const sellingPriceUSDC = useSelector(
    (state: RootState) => state.price.sellingPriceUSDC
  );
  const buyingPriceUSDC = useSelector(
    (state: RootState) => state.price.buyingPriceUSDC
  );
  const sellingPriceUSDT = useSelector(
    (state: RootState) => state.price.sellingPriceUSDT
  );
  const buyingPriceUSDT = useSelector(
    (state: RootState) => state.price.buyingPriceUSDT
  );

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);

  const isDashboard = location.pathname == "/dashboard";

  const routeTitles: Record<string, string> = {
    "/transactions": "Transaction",
    "/profile": "Profile",
    "/support": "Support",
    "/wallet": "Wallet",
    "/pending-request": "Requests",
    "/processing-orders": "Processing Requests",
    "/funds-detail": "Funds Details",
    "/dispute": "Dispute",
    "/dispute-details": "Dispute Details",
    "/dispute-form":"Dispute Form",
    "/close-account":"Close Account",
  };

  let title = routeTitles[location.pathname];

  if (location.pathname.startsWith("/confirmation")) {
    title = "Confirmation";
  }

  if (location.pathname.startsWith("/sell-confirmation")) {
    title = "Sell Confirmation";
  }

  if (location.pathname.startsWith("/scan-confirmation")) {
    title = "Scan Confirmation";
  }
  if (location.pathname.startsWith("/order")) {
    title = "Orders " + order_id;
  }

  const showHelp: Record<string, boolean> = {
    "/transactions": false,
    "/profile": false,
    "/support": false,
    "/wallet": false,
  };

  const show = showHelp[location.pathname];

  useEffect(() => {
    const interval = setInterval(
      () => setShowSelling((prev) => (prev == 1 ? 0 : prev + 1)),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${baseUrl}/buy-sell-rate`);
      // console.log(response);
      if (response?.data?.status != "success") {
        return;
      }
      dispatch(
        setSellingPriceUSDC({
          sellingPriceUSDC: response.data.data.usdc_sell_inr
            .toFixed(2)
            .toString(),
        })
      );
      dispatch(
        setBuyingPriceUSDC({
          buyingPriceUSDC: response.data.data.usdc_buy_inr
            .toFixed(2)
            .toString(),
        })
      );

      dispatch(
        setSellingPriceUSDT({
          sellingPriceUSDT: response.data.data.usdt_sell_inr
            .toFixed(2)
            .toString(),
        })
      );
      dispatch(
        setBuyingPriceUSDT({
          buyingPriceUSDT: response.data.data.usdt_buy_inr
            .toFixed(2)
            .toString(),
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (sellingPriceUSDC == "0.00" || buyingPriceUSDC == "0.00") fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [buyingPriceUSDC, sellingPriceUSDC]);

  return (
    <nav className="shadow-md shadow-[#ddd4ee] fixed top-0 left-0 bg-white w-full z-30">
      <div className={`${!isDashboard && "py-4"} max-w-lg mx-auto px-2 flex justify-between items-center`}>
        {" "}
        <div className="text-xl font-bold flex gap-1 items-center relative">
          {isDashboard ? (
            <Menu
              onClick={() => {
                dispatch(setSidebar({ showSidebar: !isSidebarVisible }));
              }}
              size={30}
              className="md:absolute border hover:bg-gray-100 rounded p-1 -left-10 cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300"
            />
          ) : (
            <FaArrowLeft
              onClick={() => {
                navigate("/dashboard");
              }}
              size={30}
              className="md:absolute p-1 border rounded-full hover:bg-gray-100 -left-10 cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300"
            />
          )}
          {isDashboard ? (
            <div
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              <img className="" src="icon.jpeg" alt="icon" width={82} />
              {/* <TextAnimate className="hidden sm:block">Scan2Pay Direct</TextAnimate> */}
            </div>
          ) : (
            <div>{title}</div>
          )}
        </div>
        {isDashboard ? (
          <div className="flex gap-2">
            <ShimmerButton
              disabled
              className="btn shadow-2xl flex gap-1 items-center relative overflow-hidden"
            >
              <div className="w-4 h-4 bg-[#dcdbfa] rounded-full flex items-center justify-center">
                <div
                  className="w-2.5 h-2.5 bg-[#4D43EF] rounded-full animate-ping"
                  style={{ animationDuration: "1.4s" }}
                ></div>
              </div>

              <div className="relative w-[150px] h-5 overflow-hidden flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {showSelling === 0 && (
                    <motion.span
                      key="usdtSell"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDT Selling Price - ₹{sellingPriceUSDT}
                    </motion.span>
                  )}

                  {showSelling === 1 && (
                    <motion.span
                      key="usdtBuy"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDT Buying Price - ₹{buyingPriceUSDT}
                    </motion.span>
                  )}

                  {/* {showSelling === 2 && (
                    <motion.span
                      key="usdcSell"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDC Selling Price - ₹{sellingPriceUSDC}
                    </motion.span>
                  )} */}

                  {/* {showSelling === 3 && (
                    <motion.span
                      key="usdcBuy"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute text-center text-xs leading-none font-medium tracking-tight text-white"
                    >
                      USDC Buying Price - ₹{buyingPriceUSDC}
                    </motion.span>
                  )} */}
                </AnimatePresence>
              </div>
            </ShimmerButton>
            <InstallButton />
          </div>
        ) : (
          show && (
            <div
              onClick={() => navigate("/support")}
              className="navbtn flex items-center gap-2 text-gray-600 border border-gray-300 cursor-pointer transition ease-in-out duration-300 hover:bg-gray-200 font-semibold rounded-full px-3 py-0.5"
            >
              <IoMdHelpCircle />
              Help
            </div>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
