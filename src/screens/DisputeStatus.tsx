import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

type Order = {
  id: number;
  order_id?: string;
  user_id?: number;
  amount?: string;
  inr_amount?: number;
  disputed_status?: string;
  type?: string;
  created_at?: string;
  order_type?: string;
  upi_id?: string;
};

const DisputeStatus: React.FC = () => {
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);

  const navigate = useNavigate();

  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${baseUrl}/disputed-orders`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response?.data?.data?.disputedOrders);
        setData(response?.data?.data?.disputedOrders || []);
      } catch (err) {
        console.error("Pending fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  return (
    <div className="mt-24 mb-10 px-3 flex flex-col gap-8 max-w-lg mx-auto">
      <div className="w-full rounded-xl border p-4 shadow-sm bg-white overflow-x-auto">
        {/* <h2 className="text-lg font-semibold mb-4">Pending Requests</h2> */}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>INR</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
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
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.order_id}</TableCell>
                  <TableCell className="capitalize">
                    {item.order_type}
                  </TableCell>
                  <TableCell>
                    {parseFloat(item?.amount).toFixed(2)}{" "}
                    {item?.type.toUpperCase()}
                  </TableCell>
                  <TableCell>₹{item.inr_amount}</TableCell>
                  <TableCell className="capitalize">
                    {item.disputed_status}
                  </TableCell>
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

                  <TableCell className="text-right">
                    {item.disputed_status.toLowerCase() == "pending" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate("/dispute-form", {
                            state: item,
                          })
                        }
                        className="cursor-pointer transition ease-in-out duration-300 hover:bg-[#4D43EF]/70 bg-[#4D43EF]"
                      >
                        Raise Dispute
                      </Button>
                    )}
                    {item.disputed_status.toLowerCase() == "requested" &&
                      "In Process"}

                    {item.disputed_status.toLowerCase() == "approve" &&
                      "Refund Approved"}

                    {item.disputed_status.toLowerCase() == "reject" &&
                      "Refund Rejected"}
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

export default DisputeStatus;
