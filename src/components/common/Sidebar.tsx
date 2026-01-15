import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setSidebar } from "@/store/slices/modelSlice";
import { signout } from "@/store/slices/userSlice";
import { AnimatePresence, motion } from "motion/react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { RiTwitterXFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import {
  MdBorderColor,
  MdDashboard,
  MdFormatListBulletedAdd,
  MdOutlinePendingActions,
  MdDeleteForever
  // MdReportProblem,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GiReceiveMoney } from "react-icons/gi";
import { BiWallet } from "react-icons/bi";
// import { IoMdSettings } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import { FaArrowRightLong } from "react-icons/fa6";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { ImConnection } from "react-icons/im";
import { useNavigate } from "react-router";
import { setLimit } from "@/store/slices/priceSlice";
import axios from "axios";
// import ThemeSwitcher from "./ThemeSwitcher";

const Sidebar: React.FC = () => {
  const isOnline = useOnlineStatus();

  const navigate = useNavigate();

  const Data = [
    {
      id: 1,
      icon: MdDashboard,
      tag: "Dashboard",
      click: () => {
        navigate("/dashboard");
      },
    },
    {
      id: 5,
      icon: MdBorderColor,
      tag: "Orders",
      click: () => {
        navigate("/pending-request");
      },
    },
    {
      id: 8,
      icon: MdOutlinePendingActions,
      tag: "Pending Orders",
      click: () => {
        navigate("/processing-orders");
      },
    },
    {
      id: 2,
      icon: CgProfile,
      tag: "Profile",
      click: () => {
        navigate("/profile");
      },
    },
    {
      id: 4,
      icon: BiWallet,
      tag: "Wallet",
      click: () => {
        navigate("/wallet");
      },
    },
    {
      id: 3,
      icon: GrTransaction,
      tag: "Transactions",
      click: () => {
        navigate("/transactions");
      },
    },

    {
      id: 7,
      icon: GiReceiveMoney,
      tag: "Funds Detail",
      click: () => {
        navigate("/funds-detail");
      },
    },
    {
      id: 9,
      icon: MdFormatListBulletedAdd,
      tag: "Dispute Status",
      click: () => {
        navigate("/dispute-details");
      },
    },
    {
      id: 11,
      icon: MdDeleteForever,
      tag: "Close Account",
      click: () => {
        navigate("/close-account");
      },
    },
    {
      id: 6,
      icon: ImConnection,
      tag: "Connection Status",
    },
  ];

  const authType: Record<string, string> = {
    email: "E-Mail",
    mobile: "Phone No.",
    google: "Google Auth",
    github: "Github Auth",
  };

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);
  const userData = useSelector((state: RootState) => state.user.userData);
  const isSideBarVisible = useSelector(
    (state: RootState) => state.model.showSidebar
  );
  const dispatch = useDispatch<AppDispatch>();

  function handleClose() {
    dispatch(setSidebar({ showSidebar: false }));
  }

 // alert(baseUrl);
  async function handleLogout() {
    try {
      await axios.post(
        `${baseUrl}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(
        setLimit({
          limit: null,
        })
      );
      dispatch(signout());
      localStorage.removeItem("seenPendingOrders_v1");
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isSideBarVisible && (
        <motion.div
          key="sidebar-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
        >
          <motion.div
            key="sidebar"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#E5E5E5] border-r slider border-gray-300 h-full top-0  w-75 flex flex-col overflow-y-auto"
          >
            <div className="px-5 py-5 md:py-4 border-b border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img className="logo" src="icon.jpeg" alt="icon" width={40} />
                <div className="font-bold">Scan2Pay Direct</div>
              </div>
              <IoCloseCircleSharp
                onClick={handleClose}
                className="text-xl hover:text-[#4D43EF] transition ease-in-out duration-300 cursor-pointer"
              />
              {/* <ThemeSwitcher /> */}
            </div>
            <div className="flex-1 py-5 md:py-3 flex flex-col gap-2">
              {Data.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      item.click?.();
                      if (item.id !== 6) {
                        handleClose();
                      }
                    }}
                    className="txt2 flex items-center px-5 justify-between cursor-pointer transition ease-in-out duration-300 hover:bg-gray-300 py-3"
                  >
                    <div className="flex items-center gap-3 font-semibold">
                      <item.icon className="text-2xl text-[#4D43EF]" />
                      <div className="text-base">{item.tag}</div>
                    </div>
                    <div>
                      {item.id == 6 ? (
                        <div
                          className={`w-4 h-4  ${
                            isOnline ? "bg-green-300" : "bg-red-300"
                          } rounded-full flex items-center justify-center`}
                        >
                          <div
                            className={`w-2.5 h-2.5 ${
                              isOnline ? "bg-green-600" : "bg-red-600"
                            } rounded-full animate-ping`}
                            style={{ animationDuration: "1.4s" }}
                          ></div>
                        </div>
                      ) : (
                        <FaArrowRightLong />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-gray-300">
              <div className="bg-[#dfddfa] card p-2 rounded-lg shadow-lg font-semibold flex gap-3 items-center">
                <div className="bg-[#4D43EF] aspect-square w-7 font-semibold text-white rounded-full flex items-center justify-center">
                  {userData?.email
                    ? userData?.email.toString()[0].toUpperCase()
                    : userData?.phone_no.toString()[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm">
                    Logged in Via {authType[userData?.type ?? ""]}
                  </div>
                  <div className="text-xs">
                    {userData?.email || userData?.phone_no}
                  </div>
                </div>
              </div>
              <div className="mt-5 mb-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">Find Us On</div>
                  <div className="flex gap-3 mt-2">
                    <RiTwitterXFill
                      onClick={() => window.open("https://x.com/", "_")}
                      className="text-2xl txt3 cursor-pointer text-[#4D43EF] hover:text-[#4D43EF]/70 transition ease-in-out duration-300"
                    />
                    <FaTelegramPlane
                      onClick={() => window.open("https://t.me/scan2pay_direct/", "_")}
                      className="text-2xl txt3 cursor-pointer text-[#4D43EF] hover:text-[#4D43EF]/70 transition ease-in-out duration-300"
                    />
                  </div>
                </div>
                <div> 
                  <IoLogOut
                    onClick={handleLogout}
                    className="text-3xl txt3 cursor-pointer  text-[#4D43EF] hover:text-[#4D43EF]/70 transition ease-in-out duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
