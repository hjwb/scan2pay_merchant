import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setTrxFail } from "@/store/slices/modelSlice";

interface ModalProps {
  open: boolean;
}

export default function FailedModal({ open }: ModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        dispatch(setTrxFail({ showTrxFail: false }));
      }}
    >
      <DialogContent className="max-w-sm p-6 rounded-2xl shadow-lg">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-3"
        >
          <XCircle className="w-16 h-16 text-red-500" />

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Transaction Failed
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-sm text-muted-foreground">
            The transaction could not be completed. Please raise a ticket.
          </p>

          <DialogFooter className="w-full">
            <Button
              onClick={() => {
                dispatch(setTrxFail({ showTrxFail: false }));
              }}
              className="w-full bg-[#4D43EF] hover:bg-[#4D43EF]/90 cursor-pointer"
            >
              Okay
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
