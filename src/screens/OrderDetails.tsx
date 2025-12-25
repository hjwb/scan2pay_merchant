import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FaCheckCircle } from "react-icons/fa";
import { Copy } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const OrderDetails: React.FC = () => {
  const { order_id } = useParams<{ order_id: string }>();

  const navigate = useNavigate();

  const [data, setData] = React.useState(null);

  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state?.user?.token);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await axios.post(
          `${baseUrl}/merchant/transactions-details`,
          { order_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.log("Error fetching order details:", error);
      }
    }
    
    fetchDetails();
  }, []);

  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <FaCheckCircle className="text-[110px] mx-auto text-[#493FEE]" />
      <p className="mx-auto font-semibold text-[50px] text-[#493FEE]">
        {" "}
        {data?.amount.toFixed(4) ?? "0.0000"}{" "}
        {data?.payment_method.toUpperCase() ?? "-"}
      </p>
      <div className="mt-5 flex flex-col gap-1 border-2 py-3 px-5 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Order ID</p>
          <p>{order_id}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Type</p>
          <p>
            {data ? data?.type[0].toUpperCase() + data?.type.slice(1) : "-"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Amount</p>
          <p>
            {data?.amount.toFixed(4) ?? "0.0000"}{" "}
            {data?.payment_method.toUpperCase() ?? "-"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">INR Amount</p>
          <p>₹ {data?.inr_amount.toFixed(4) ?? "0.0000"}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Fees</p>
          <p>
            ₹ {((data?.inr_amount * data?.charge) / 100).toFixed(4) ?? "0.0000"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">From Upi</p>
          <p>{data?.from_upi_id ?? "-"}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">To Upi</p>
          <p>{data?.to_upi_id ?? "-"}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Hash</p>
          <p>
            {data?.transaction_hash
              ? data?.transaction_hash?.slice(0, 5) +
                "..." +
                data?.transaction_hash?.slice(-5)
              : "xxxxx...xxxxx"}
            <Copy
              className="inline-block ml-2 cursor-pointer hover:text-gray-500 transition ease-in-out duration-300"
              size={16}
            />
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Date</p>
          <p>
            {data?.created_at.slice(0, 10).split("-").reverse().join("-") ??
              "00-00-0000"}
          </p>
        </div>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer">
            The shopkeeper is asking to see the payment – what should I do?
          </AccordionTrigger>
          <AccordionContent>
            1. Copy the merchant's UPI ID from your order.
            <br /> 2. Paste it in your UPI app to see their name. <br /> 3. Tell
            the shopkeeper: "You should've received ₹XXXX from [Name]." <br />{" "}
            4. If they still deny it, contact support — we'll send your
            screenshot to show them.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex">
        <Button
          onClick={() => {
            navigate("/transactions");
          }}
          className="flex-1 bg-[#493FEE] hover:bg-[#493FEE]/80 cursor-pointer transition ease-in-out duration-300 "
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
