import type { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { readSeenIds, writeSeenIds } from "@/utils/seenStorage";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { useShowError } from "@/hooks/useShowError";
import { useNavigate } from "react-router";

type Order = {
  id: number;
  order_id?: string;
  user_id?: number;
  amount?: number;
  inr_amount?: number;
  status?: string;
  type?: string;
  created_at?: string;
  order_type?: string;
  upi_id?: string;
  payment_mode?: string;
};

const PendingRequest: React.FC = () => {
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.userData);

  const [data, setData] = React.useState([]);
  const [sortType, setSortType] = React.useState("default");
  const [typeFilter, setTypeFilter] = React.useState("all"); // <-- NEW
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);

  // const [loadingBtn, setLoadingBtn] = React.useState(false);
  // const [show, setShow] = React.useState(false);
  const { showSuccess } = useShowSuccess();
  const { showError } = useShowError();

  const navigate = useNavigate();

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/merchant/other-pending-orders`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response?.data?.data?.pendingOrders);
      setData(response?.data?.data?.pendingOrders || []);
    } catch (err) {
      console.error("Pending fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(() => fetchPending(), 10000);
    return () => clearInterval(interval);
  }, []);

  const markSeen = (id: number) => {
    const seen = new Set(readSeenIds());
    seen.add(id);
    writeSeenIds([...seen]);
  };

  const handleAccept = async (o: Order) => {
    markSeen(o.id);
    console.log(o);
    try {
      const res = await axios.post(`${baseUrl}/merchant/accept-buy-order`, {
        order_id: o?.order_id,
        merchant_id: user?.id,
      });

      if (res.data.status) {
        showSuccess("Order accepted successfully", "");
        if (o.order_type === "buy") navigate(`/confirmation/${o.order_id}`);
        else if (o.order_type === "sell") {
          if (o.payment_mode == "automatic") {
            showSuccess("Request accepted.", "Transaction in Process.");
            setShow(true);
            setTimeout(() => {
              setShow(false);
              navigate(`/transactions`);
              showSuccess("Transaction completed successfully", "");
            }, 20000);

            return;
          }
          navigate(
            `/sell-confirmation/${o.order_id}/${res.data.upi_id}/${o.inr_amount}/${o.amount}/${o.type}`
          );
        } else
          navigate(
            `/scan-confirmation/${o.order_id}/${res.data.upi_id}/${o.amount}`
          );
      } else {
        showError("Order acceptance failed.", res.data.message);
      }
    } catch (err) {
      console.warn("Accept failed:", err);
    }
  };

  // SORT + TYPE FILTER
  const filteredData = data.filter((item) => {
    if (typeFilter === "all") return true;
    return item.order_type?.toLowerCase() === typeFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortType === "asc") return a.amount - b.amount;
    if (sortType === "desc") return b.amount - a.amount;
    return 0;
  });

  // async function handleClearRequest() {
  //   try {
  //     setLoadingBtn(true);

  //     await axios.post(
  //       `${baseUrl}/merchant/reject-accepted-order`,
  //       {},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (show)
  //       showSuccess(
  //         "Success",
  //         "Successfully cleared the last order. Now you can accept orders again."
  //       );
  //   } catch (error) {
  //     console.log(error);
  //     showError("Error", "Something went wrong while clearing the last order.");
  //   } finally {
  //     setLoadingBtn(false);
  //     setShow(true);
  //   }
  // }

  // useEffect(() => {
  //   handleClearRequest();
  //   setShow(true);
  // }, []);

  return (
    <div className="mt-18 px-2 flex flex-col gap-4 max-w-lg mx-auto">
      {/* FILTER UI */}
      {show && (
        <div className="absolute inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
          {" "}
          <div className="p-6 bg-white rounded-lg relative max-w-lg w-full mx-3">
            <div className="p-4 my-5 bg-green-50 border border-green-300 rounded-lg text-center">
              <img
                src="process.gif"
                className="aspect-square w-20 mx-auto mb-3"
              />
              <h2 className="text-lg font-semibold text-green-700">
                Order Accepted
              </h2>
              <p className="text-gray-700 mt-1">
                Please wait while we are processing you order
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-fit items-center sm:flex-row justify-between gap-3">
        {/* <Button
          onClick={handleClearRequest}
          disabled={loadingBtn}
          className="hover:bg-[#4D43EF]/70 flex-1 w-full bg-[#4D43EF] cursor-pointer transition ease-in-out duration-300"
        >
          {loadingBtn ? "Clearing Order ..." : "Clear Last Order"}
        </Button> */}

        {/* SORT SELECT */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border px-3 py-1 rounded-md flex-1 w-full"
        >
          <option value="default">Default Order</option>
          <option value="asc">Amount: Low → High</option>
          <option value="desc">Amount: High → Low</option>
        </select>

        {/* TYPE FILTER SELECT — NEW */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-3 py-1 rounded-md flex-1 w-full"
        >
          <option value="all">All Types</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
          <option value="scan">Scan</option>
        </select>
      </div>

      <div className="w-full rounded-xl border p-4 shadow-sm bg-white overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Action</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>INR</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length === 0 ? (
              loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center pt-5">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center pt-5">
                    No data found
                  </TableCell>
                </TableRow>
              )
            ) : (
              sortedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleAccept(item)}
                      size="sm"
                      className="cursor-pointer transition ease-in-out duration-300 hover:bg-[#4D43EF]/70 bg-[#4D43EF]"
                    >
                      Accept
                    </Button>
                  </TableCell>
                  <TableCell>{item.order_id}</TableCell>
                  <TableCell className="capitalize">
                    {item.order_type}
                  </TableCell>
                  <TableCell>{parseFloat(item.amount).toFixed(2)}</TableCell>
                  <TableCell>₹{item.inr_amount}</TableCell>
                  <TableCell className="capitalize">{item.status}</TableCell>
                  <TableCell>
                   {new Date(item.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingRequest;
