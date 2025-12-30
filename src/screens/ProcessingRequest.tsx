import type { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
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

type Order = {
  id: number;
  order_id?: string;
  user_id?: number;
  amount?: string;
  inr_amount?: number;
  status?: string;
  type?: string;
  created_at?: string;
  order_type?: string;
  upi_id?: string;
};

const ProcessingRequest: React.FC = () => {
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);
  const token = useSelector((state: RootState) => state.user.token);
  //   const user = useSelector((state: RootState) => state.user.userData);

  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = React.useState(false);
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);

  async function handleApprove(orderid) {
    try {
      setLoading2(true);
      setId(orderid);
      const response = await axios.post(
        `${baseUrl}/merchant/confirm-payment`,
        { order_id: orderid },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setCount((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading2(false);
      setId("");
    }
  }

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${baseUrl}/merchant/incomplete-orders`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response?.data?.data?.incompleteOrders);
        setData(response?.data?.data?.incompleteOrders || []);
      } catch (err) {
        console.error("Pending fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [count]);

  return (
    <div className="mt-18 px-2 flex flex-col gap-4 max-w-lg mx-auto">
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
              <TableHead>Created</TableHead>
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
                  <TableCell>{parseFloat(item?.amount).toFixed(2)}</TableCell>
                  <TableCell>₹{item.inr_amount}</TableCell>
                  <TableCell className="capitalize">{item.status}</TableCell>
                  {/* <TableCell>
                    {new Date(item.created_at).toLocaleString().slice(0, 10)}
                  </TableCell> */}
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
                    <Button
                      size="sm"
                      disabled={loading2}
                      onClick={() => handleApprove(item.order_id)}
                      className="cursor-pointer transition ease-in-out duration-300 hover:bg-[#4D43EF]/70 bg-[#4D43EF]"
                    >
                      {loading2 && id == item.order_id
                        ? "Please Wait..."
                        : "Approve Order"}
                    </Button>
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

export default ProcessingRequest;
