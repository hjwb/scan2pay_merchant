import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import {
  setIsUserConnected,
  setToken,
  setUserData,
} from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();
  const executedRef = useRef(false);

  const text = "....";
  const letters = Array.from(text);

  // Each letter follows a sinusoidal wave motion
  const wave: Variants = {
    initial: { y: 0 },
    animate: (i: number) => ({
      y: [0, -5, 0], // jump up and back down
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        delay: i * 0.2, // offset for wave effect
      },
    }),
  };

  function redirect() {
    if (executedRef.current) return;
    executedRef.current = true;

    const params = new URLSearchParams(window.location.search);

    // console.log(window.location.search);

    const allParams = {
      status: params.get("status"),
      message: params.get("message"),
      token: params.get("token"),
      data: JSON.parse(decodeURIComponent(params.get("data") || "{}")),
      // registration: params.get("login_type"),
    };

     console.log(allParams);

    

    if (allParams.status === "verification_required") {
        navigate("/verify-merchant");
        dispatch(setUserData({ userData: allParams?.data }));     
        return;
    }

   if (allParams.status !== "success") {
      showError("Authntication Failed", "");
      navigate("/");
      return;
    }

    showSuccess("Success", "User Authentication Successful.");
    dispatch(setUserData({ userData: allParams?.data }));
    dispatch(setToken({ token: allParams?.token ?? "" }));
    dispatch(setIsUserConnected({ isConnected: true }));

    navigate("/dashboard");
  }

  useEffect(() => {
    setTimeout(() => {
      redirect();
    }, 1000);
  }, []);

  return (
    <div className="flex gap-3 items-center text-xl font-bold justify-center h-screen">
      <Spinner className="my-1 size-6 text-[#4D43EF]" />

      <div className="flex text-[#4D43EF]">
        Authenticating{" "}
        <>
          {letters.map((char, i) => (
            <motion.span
              key={i}
              variants={wave}
              custom={i} // pass index to motion variant
              initial="initial"
              animate="animate"
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </>
      </div>
    </div>
  );
};

export default Verification;
