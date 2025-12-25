import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setTrxSuccess } from "@/store/slices/modelSlice";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
}

export default function SuccessModal({ open }: ModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const audio = new Audio("/merchant/audio1.wav");
    audio.play();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        dispatch(setTrxSuccess({ showTrxSuccess: false }));
      }}
    >
      <DialogContent className="max-w-sm p-6 rounded-2xl shadow-lg">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-3"
        >
          <img src="/merchant/check.gif.gif" className="aspect-square w-30" />

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Transaction Successful
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-sm text-muted-foreground">
            The transaction has been processed successfully.
          </p>

          <DialogFooter className="w-full">
            <Button
              onClick={() => {
                dispatch(setTrxSuccess({ showTrxSuccess: false }));
                location.reload();
              }}
              className="w-full bg-[#4D43EF] hover:bg-[#4D43EF]/90 cursor-pointer"
            >
              Continue
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
