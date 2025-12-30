import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { ExternalLink } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import axios from "axios";
import { useNavigate } from "react-router";
interface Transaction {
  amount: number; //
  type: string; //
  income_id: string; //
  transaction_type: "USDT" | "USDC";
  transaction_hash: string;
  payment_method: string;
  inr_amount: number;
 created_at: string;
}

const Transaction: React.FC = () => {
  const [loading, setloading] = useState(false);
  const [count, setCount] = useState(1);
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  const navigate = useNavigate();

  const baseUrl = useSelector((state: RootState) => state?.consts?.baseUrl);
  // const userData = useSelector((state: RootState) => state?.user?.userData);
  const token = useSelector((state: RootState) => state?.user?.token);

  async function fetchTransactions() {
    try {
      setloading(true);
      const response = await axios.post(
        `${baseUrl}/merchant/transactions-list`,
        {
          // user_id: userData?.id,
          count,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.data);

      if (response.data.status == "false") {
        setTransaction([]);
        return;
      }

      setTransaction(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    // console.log(transaction.length)
  }, [count]);



  const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });


  return (
    <div className="mt-24 px-2 flex flex-col gap-2 max-w-lg mx-auto">
      <div
        className={`flex flex-col gap-2 overflow-hidden ${
          transaction.length !== 15 ? "h-fit" : "min-h-150"
        }`}
      >
        {loading ? (
          <div className="min-h-150 flex-1 font-semibold bg-[#4D43EF]/10 rounded-lg flex justify-center items-center gap-2 py-30">
            <Spinner className="size-6" /> Loading...
          </div>
        ) : transaction.length == 0 ? (
          <div className="min-h-150 font-semibold bg-[#4D43EF]/10 flex-1 flex justify-center rounded-lg items-center gap-2 py-30">
            No Data Found.
          </div>
        ) : (
          <div className="max-h-180 border rounded-lg overflow-x-auto">
            <Table className="">
              <TableCaption>
                <div className="flex justify-between mx-1 mb-2">
                  <button
                    onClick={() => {
                      setCount((prev) => prev - 1);
                    }}
                    disabled={count == 1}
                    className="border-2 px-3 rounded cursor-pointer border-[#4D43EF] hover:bg-[#4D43EF]/90 hover:border-[#4D43EF]/70 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:border-[#4D43EF] disabled:hover:bg-[#4D43EF] text-white bg-[#4D43EF] transtion ease-in-out duration-300"
                  >
                    Prev
                  </button>
                  <div>A list of your recent transactions.</div>
                  <button
                    disabled={transaction.length !== 10}
                    onClick={() => {
                      setCount((prev) => prev + 1);
                    }}
                    className="border-2 px-3 rounded cursor-pointer border-[#4D43EF] hover:bg-[#4D43EF]/90 hover:border-[#4D43EF]/70 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:border-[#4D43EF] disabled:hover:bg-[#4D43EF] text-white bg-[#4D43EF] transtion ease-in-out duration-300"
                  >
                    Next
                  </button>
                </div>
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Trx Id</TableHead>
                  <TableHead>Trx Type</TableHead>
                  <TableHead>INR</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-center">Hash</TableHead>

                   <TableHead>Date/Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.map((item, index) => {
                  return (
                    <TableRow
                      onClick={() => {
                        navigate("/order/" + item.income_id);
                      }}
                      className="odd:bg-[#4D43EF]/10 hover:bg-gray-100 cursor-pointer"
                      key={index}
                    >
                      <TableCell>{item?.income_id ?? "-"}</TableCell>
                      <TableCell>
                        {item?.type[0].toUpperCase() + item?.type.slice(1)}
                      </TableCell>
                      <TableCell className="">
                       ₹{item?.inr_amount ?? "-"}
                      </TableCell>
                      <TableCell>
                        ${item?.amount?.toFixed(2) ?? "00.00"}
                      </TableCell>
                      <TableCell className="flex items-center gap-1 hover:text-[#4D43EF] cursor-pointer transition ease-in-out duration-300">
                        {item?.transaction_hash && <ExternalLink size={14} />}
                        {item?.transaction_hash ? (
                          item?.transaction_hash.slice(0, 6) +
                          "..." +
                          item?.transaction_hash.slice(-6)
                        ) : (
                          <p className="w-full text-center">-</p>
                        )}
                      </TableCell>

                      <TableCell>
                      <div className="flex flex-col text-sm leading-tight">
                        <span>{formatDate(item.created_at)}</span>
                        <span className="text-gray-500">{formatTime(item.created_at)}</span>
                      </div>
                    </TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
