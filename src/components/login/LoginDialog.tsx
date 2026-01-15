import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  setIsUserConnected,
  setToken,
  setUserData,
} from "@/store/slices/userSlice";
import { Input } from "../ui/input";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "react-router";

export function LoginDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [view, setView] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const [emailVerificationLoader, setEmailVerificationLoader] = useState(false);
  const [numberVerificationLoader, setNumberVerificationLoader] =
    useState(false);

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);

  //Oauth google
  const handleGoogleLogin = async () => {
    try {
      setLoadingButton("google");
      const response = await axios.post(`${baseUrl}/auth/google`, {
        referred_id: id ? id : "",
        isMerchant: 1,
      });

      if (response.status !== 200) {
        showError("Google Authentication Failed.", "");
        return;
      }
      console.log(response.data);
      window.location.href = response.data;
    } catch (error) {
      showError("Google Authentication Failed.", "");
      console.log(error);
      setLoadingButton(null);
    }
    // finally {
    //   setTimeout(() => {
    //     setLoadingButton(null);
    //   }, 1000);
    // }
  };

  //Oauth github
  const handleGithubLogin = async () => {
    try {
      setLoadingButton("github");
      const response = await axios.post(`${baseUrl}/auth/github`, {
        referred_id: id ? id : "",
        isMerchant: true,
      });

      if (response.status !== 200) {
        showError("Github Authentication Failed.", "");
        return;
      }
      window.location.href = response.data;
    } catch (error) {
      showError("Github Authentication Failed.", "");
      console.log(error);
      setLoadingButton(null);
    }
    // finally {
    //   setLoadingButton(null);
    // }
  };

  //Oauth linkedin
  const handleLinkedinLogin = async () => {
    try {
      setLoadingButton("linkedin");
      const response = await axios.get(`${baseUrl}/auth/github`);

      if (response.status !== 200) {
        showError("LinkedIn Authentication Failed.", "");
        return;
      }
      window.location.href = response.data;
    } catch (error) {
      showError("LinkedIn Authentication Failed.", "");
      console.log(error);
      setLoadingButton(null);
    }
    // finally {
    //   setLoadingButton(null);
    // }
  };

  //Oauth facebook
  const handleFacebookLogin = async () => {
    try {
      setLoadingButton("facebook");
      const response = await axios.get(`${baseUrl}/auth/github`);

      if (response.status !== 200) {
        showError("Facebook Authentication Failed.", "");
        return;
      }
      window.location.href = response.data;
    } catch (error) {
      showError("Facebook Authentication Failed.", "");
      console.log(error);
      setLoadingButton(null);
    }
    // finally {
    //   setLoadingButton(null);
    // }
  };

  //Sending otp to email
  const sendOtpEmail = async () => {
    if (!email) {
      showError("Email Field Can't Be Empty.", "");
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      showError("Enter A Valid Email.", "");
      return;
    }

    try {
      setOtpLoader(true);
      const response = await axios.post(`${baseUrl}/email-otp`, {
        email,
      });

      console.log(response.data);

      if (response.data.status != "success") {
        showError("Failed To Send Otp.", "");
        setEmail("");
        return;
      }

      setOtpValue(response.data.otp);
      showSuccess("OTP Sent", response.data.message);
      setOtpSent(true);
    } catch (error) {
      console.log(error);
      setEmail("");
      showError("Failed To Send Otp.", "");
    } finally {
      setOtpLoader(false);
    }
  };

  //signing in via email
  const handleEmailVerification = async () => {
    if (otp.length != 6) {
      showError("Entered OTP Is Invalid.", "");
      return;
    }

    try {
      setEmailVerificationLoader(true);

      const response = await axios.post(`${baseUrl}/register-email`, {
        email,
        otp,
        isMerchant: 1,
      });

      console.log(response.data);

      if (response.data.status === "verification_required") {
        navigate("/verify-merchant");
        dispatch(setUserData({ userData: response.data.data }));
        return;
      }

      if (response.data.status !== "success") {
        showError("Verification Failed", response.data.message);
        return;
      }

      showSuccess("Login Successful.", "");

     

  

      dispatch(setUserData({ userData: response.data.data }));
      dispatch(setToken({ token: response.data.token }));
      dispatch(setIsUserConnected({ isConnected: true }));      
      localStorage.setItem("login_time", Date.now().toString());

      
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      if (error.response.data.redirect === "verification_pending") {
        navigate("/verify-merchant");
        dispatch(setUserData({ userData: error.response.data.data }));
        return;
      }
      showError("Verification Failed", "");
    } finally {
      setEmailVerificationLoader(false);
      setOtp("");
      setOtpSent(false);
      setEmail("");
    }
  };

  //Sending otp to mobile number
  const sendOtpNumber = async () => {
    if (!number) {
      showError("Phone Number Field Can't Be Empty.", "");
      return;
    }
    try {
      setOtpLoader(true);
      const response = await axios.post(`${baseUrl}/mobile-otp`, {
        phone_no: number,
      });

      // console.log(response.data);
      setOtpValue(response.data.otp);
      showSuccess("Success", response.data.message);
      setOtpSent(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(
          "Error Sending OTP.",
          error?.response?.data?.message?.phone_no[0]
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setOtpLoader(false);
    }
    //
  };

  //signing in via mobile number
  const handleNumberVerification = async () => {
    if (otp.length != 6) {
      showError("Entered OTP Is Invalid.", "");
      return;
    }

    try {
      setNumberVerificationLoader(true);

      const response = await axios.post(`${baseUrl}/register-mobile`, {
        phone_no: number,
        otp,
        referred_id: id ? id : "",
        isMerchant: true,
      });

      // console.log(response.data);

      showSuccess("Login Successful.", "");
      dispatch(setToken({ token: response.data.token }));
      dispatch(setUserData({ userData: response.data.data }));
      dispatch(setIsUserConnected({ isConnected: true }));
    
       localStorage.setItem("login_time", Date.now().toString());

    
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showError(
          "Verification Failed.",
          error?.response?.data?.message?.phone_no[0]
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setNumberVerificationLoader(false);
      setOtp("");
      setOtpSent(false);
      setNumber("");
    }
  };

  //initiating type of mode to signin
  const handleOptionClick = (option: number) => {
    setView(option);
  };

  //handle navigation to previous page
  const handleBack = () => {
    setOtp("");
    setView(0);
    setOtpSent(false);
    setEmail("");
    setNumber("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setOtp("");
          setView(0);
          setOtpSent(false);
          setEmail("");
          setNumber("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full text-white bg-[#4D43EF] cursor-pointer transition ease-in-out duration-300">
          Merchant Login 
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px] bg-white"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <DialogHeader>
          {view != 0 ? (
            <DialogTitle className="flex items-center font-bold gap-2">
              <IoMdArrowRoundBack
                className="cursor-pointer hover:text-[#4D43EF] transition ease-in-out duration-300"
                onClick={handleBack}
              />
              <img className="logo" src="icon.jpeg" alt="icon" width={45} />
              OTP
            </DialogTitle>
          ) : (
            <DialogTitle className="flex items-center font-bold gap-2">
              <img className="logo" src="icon.jpeg" alt="icon" width={45} />
              Login
            </DialogTitle>
          )}

          {view == 1 ? (
            <DialogDescription className="text-left">
              Enter the OTP sent to your Email. {otpValue}
            </DialogDescription>
          ) : view == 2 ? (
            <DialogDescription className="text-left">
              Enter the OTP sent to your Phone Number. {otpValue}
            </DialogDescription>
          ) : (
            <DialogDescription className="text-left">
              Choose your preferred login method below.
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Conditional rendering based on view */}
        {view === 0 && (
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={loadingButton !== null && loadingButton !== "google"}
              className="disabled:bg-gray-200 relative flex items-center justify-center w-full cursor-pointer py-6 border border-gray-300 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out"
            >
              {loadingButton == "google" ? (
                <>
                  <Spinner className="text-gray-700 size-6" />
                  <span className="text-gray-700">Signing In</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.94 0 7.47 1.5 10.23 3.97l7.61-7.61C37.24 1.9 30.97 0 24 0 14.62 0 6.53 5.05 2.48 12.46l8.9 6.92C13.1 13.67 18.14 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.98 24.5c0-1.57-.14-3.08-.41-4.54H24v9.04h12.97c-.56 2.96-2.2 5.46-4.66 7.14l7.2 5.59c4.19-3.87 6.47-9.57 6.47-16.23z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M9.37 28.62a14.42 14.42 0 0 1-.76-4.62c0-1.6.27-3.14.76-4.62l-8.9-6.92A23.933 23.933 0 0 0 0 24c0 3.89.93 7.56 2.48 10.92l8.9-6.92z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M24 48c6.48 0 11.9-2.13 15.86-5.77l-7.2-5.59c-2.01 1.35-4.6 2.15-8.66 2.15-5.86 0-10.9-4.17-12.62-9.88l-8.9 6.92C6.53 42.95 14.62 48 24 48z"
                    />
                  </svg>

                  <span className="font-medium text-gray-700 text-base">
                    Sign in with Google
                  </span>
                </>
              )}
            </Button>

            <Button
              onClick={handleGithubLogin}
              disabled={loadingButton !== null && loadingButton !== "github"}
              className="disabled:bg-gray-200 relative flex items-center justify-center cursor-pointer w-full py-6 border border-gray-300 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out"
            >
              {loadingButton == "github" ? (
                <>
                  <Spinner className="text-gray-700 size-6" />
                  <span className="text-gray-700">Signing In</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-3 fill-current text-gray-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.43c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.32-1.74-1.32-1.74-1.08-.74.08-.73.08-.73 1.19.08 1.82 1.23 1.82 1.23 1.06 1.82 2.78 1.29 3.46.99.11-.77.42-1.29.76-1.59-2.66-.3-5.47-1.33-5.47-5.91 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0112 6.8c1.02 0 2.05.14 3.01.4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.59-2.81 5.6-5.49 5.9.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="font-medium text-gray-700 text-base">
                    Sign in with GitHub
                  </span>
                </>
              )}
            </Button>

            <Button
              onClick={handleLinkedinLogin}
              disabled={loadingButton !== null && loadingButton !== "linkedin"}
              className="disabled:bg-gray-200 relative flex items-center justify-center cursor-pointer w-full py-6 border border-gray-300 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out"
            >
              {loadingButton == "linkedin" ? (
                <>
                  <Spinner className="text-gray-700 size-6" />
                  <span className="text-gray-700">Signing In</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-3 fill-[#0A66C2]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.76S5.53 5.2 6.5 5.2 8.25 6 8.25 6.95c0 .97-.78 1.76-1.75 1.76zM20 19h-3v-4.74c0-1.13-.02-2.58-1.57-2.58-1.58 0-1.82 1.23-1.82 2.5V19h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.85-1.54 3.04 0 3.6 2 3.6 4.6V19z" />
                  </svg>
                  <span className="font-medium text-gray-700 text-base">
                    Sign in with LinkedIn
                  </span>
                </>
              )}
            </Button>

            <Button
              onClick={handleFacebookLogin}
              disabled={loadingButton !== null && loadingButton !== "facebook"}
              className="disabled:bg-gray-200 relative flex items-center justify-center cursor-pointer w-full py-6 border border-gray-300 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out"
            >
              {loadingButton == "facebook" ? (
                <>
                  <Spinner className="text-gray-700 size-6" />
                  <span className="text-gray-700">Signing In</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-3 fill-[#1877F2]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35C.597 0 0 .6 0 1.333v21.333C0 23.4.597 24 1.325 24H12v-9.294H9.294v-3.622H12V8.413c0-2.68 1.634-4.141 4.022-4.141 1.14 0 2.12.084 2.405.122v2.79h-1.651c-1.295 0-1.546.616-1.546 1.52v1.982h3.09l-.403 3.622h-2.687V24h5.27C23.403 24 24 23.4 24 22.667V1.333C24 .6 23.403 0 22.675 0z" />
                  </svg>
                  <span className="font-medium text-gray-700 text-base">
                    Sign in with Facebook
                  </span>
                </>
              )}
            </Button>

            <div className="flex md:flex-row flex-col gap-3">
              <Button
                onClick={() => handleOptionClick(1)}
                className="md:flex-1 flex items-center py-6 justify-center cursor-pointer gap-2 bg-[#4D43EF] hover:bg-[#4D43EF]/80 text-white transition ease-in-out duration-300"
              >
                <MdEmail className="text-lg" /> Login with Email
              </Button>

              {/* <Button
                onClick={() => handleOptionClick(2)}
                className="md:flex-1 flex items-center justify-center cursor-pointer gap-2 py-6 bg-black hover:bg-gray-800 text-white transition ease-in-out duration-300"
              >
                <MdPhoneIphone className="text-lg" /> Login with Phone No.
              </Button> */}
            </div>
          </div>
        )}

        {/* Email Login View */}
        {view === 1 && (
          <div className="flex flex-col items-center justify-center text-2xl font-semibold">
            {!otpSent ? (
              <>
                <Input
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter You Email..."
                  type="email"
                />
                <button
                  onClick={sendOtpEmail}
                  disabled={otpLoader}
                  className="text-base my-3 bg-[#4D43EF] text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/70 cursor-pointer transition ease-in-out duration-300"
                >
                  {!otpLoader ? (
                    "Send OTP"
                  ) : (
                    <Spinner className="my-1 mx-auto" />
                  )}
                </button>
              </>
            ) : (
              <>
                <InputOTP
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <button
                  onClick={handleEmailVerification}
                  disabled={emailVerificationLoader}
                  className="text-base mt-5 bg-[#4D43EF] text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/70 cursor-pointer transition ease-in-out duration-300"
                >
                  {!emailVerificationLoader ? (
                    "Confirm OTP"
                  ) : (
                    <Spinner className="my-1 mx-auto" />
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Phone Login View */}
        {view === 2 && (
          <div className="flex flex-col items-center justify-center text-2xl font-semibold">
            {!otpSent ? (
              <>
                <Input
                  value={number}
                  type="tel"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    setNumber(numericValue);
                  }}
                  placeholder="Enter You Phone Number..."
                  className=""
                />
                <button
                  onClick={sendOtpNumber}
                  disabled={otpLoader}
                  className="text-base my-3 bg-[#4D43EF] text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/70 cursor-pointer transition ease-in-out duration-300"
                >
                  {!otpLoader ? (
                    "Send OTP"
                  ) : (
                    <Spinner className="my-1 mx-auto" />
                  )}
                </button>
              </>
            ) : (
              <>
                <InputOTP
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <button
                  onClick={handleNumberVerification}
                  className="text-base mt-5 bg-[#4D43EF] text-white w-full py-2 rounded-lg hover:bg-[#4D43EF]/70 cursor-pointer transition ease-in-out duration-300"
                >
                  {!numberVerificationLoader ? (
                    "Confirm OTP"
                  ) : (
                    <Spinner className="my-1 mx-auto" />
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
