import React from "react";
import { TextAnimate } from "@/components/ui/text-animate";
import { LoginDialog } from "@/components/login/LoginDialog";
import InstallButton from "@/components/PWAInstall/InstallButton";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen ">
      <div className="flex flex-col justify-center items-center flex-1 sm:min-h-screen max-w-lg mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex text-2xl font-extrabold items-center">
            <img className="logo" src="icon.jpeg" alt="icon" width={100} />
            <TextAnimate>Scan2Pay.direct Merchant</TextAnimate>
          </div>
          <TextAnimate className="font-semibold mt-3 text-center">
            Sell your USDT BNB CHAIN/BEP20 ↔ INR(₹) Instantly
          </TextAnimate>
        </div>
        <div className="my-10 sm:my-15">
          <img src="/merchant/login/tx2.svg" width={300} />
        </div>
        <div className="">
          <LoginDialog />
          <InstallButton />
          <p className="text-sm text-center mt-4">
            By logging in, you agree to our{" "}
            <span
              onClick={() =>
                (window.location.href =
                  "https://scan2pay.direct/terms&condition")
              }
              className="cursor-pointer font-semibold text-[#4D43EF] hover:text-[#1206f3] transition ease-in-out duration-300"
            >
              Terms & Conditions
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
