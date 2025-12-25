import React, { useState } from "react";
import { useLocation } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useShowError } from "@/hooks/useShowError";
import { useShowSuccess } from "@/hooks/useShowSuccess";
import { useNavigate } from "react-router";

const DisputeForm: React.FC = () => {
  const location = useLocation();
  const state = location.state || {};

  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);
  const baseUrl = useSelector((state: RootState) => state.consts.baseUrl);

  const { showError } = useShowError();
  const { showSuccess } = useShowSuccess();

  const handleSubmit = async () => {
    const payload = {
      order_id: state.order_id,
      amount: state.amount,
      inr_amount: state.inr_amount,
      order_type: state.order_type,
      upi_reference: state.upi_reference,
      scan_upi: state.scan_upi,
      accepted_at: state.accepted_at,
      description,
      payment_screenshot: paymentScreenshot,
    };

    try {
      setLoading(true);
      if (!description) {
        showError("Description can't be empty", "");
        return;
      }

      if (!paymentScreenshot) {
        showError("Payment Screenshot can't be empty", "");
        return;
      }

      const response = await axios.post(
        `${baseUrl}/request-to-dispute`,
        {
          order_id: payload.order_id,
          description: payload.description,
          payment_screenshot: payload.payment_screenshot,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      showSuccess("Dispute Raised", "");
      navigate("/dispute-details");
    } catch (error) {
      console.log(error);
      showError("Error Occured While Raising Dispute.", "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-24 mb-10 px-3 flex flex-col gap-5 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Dispute Form</h2>

      <div className="grid gap-2">
        <div>
          <Label>Order ID</Label>
          <Input value={state.order_id || ""} disabled />
        </div>

        <div>
          <Label>Amount</Label>
          <Input value={state.amount.toFixed(4) || ""} disabled />
        </div>

        <div>
          <Label>INR Amount</Label>
          <Input value={state.inr_amount.toFixed(4) || ""} disabled />
        </div>

        <div>
          <Label>Order Type</Label>
          <Input
            value={
              state.order_type[0].toUpperCase() + state.order_type.slice(1) ||
              ""
            }
            disabled
          />
        </div>

        <div>
          <Label>UPI Reference</Label>
          <Input value={state.upi_reference || ""} disabled />
        </div>

        <div>
          <Label>Scan UPI</Label>
          <Input value={state.scan_upi || ""} disabled />
        </div>

        <div>
          <Label>Accepted At</Label>
          <Input value={state.accepted_at || ""} disabled />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            placeholder="Enter dispute description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Payment Screenshot</Label>
          <Input
            type="file"
            required
            onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          className="bg-[#4B45F0] hover:bg-[#4B45F0]/80 cursor-pointer transition ease-in-out duration-300"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Dispute"}
        </Button>
      </div>
    </div>
  );
};

export default DisputeForm;
