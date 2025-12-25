import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Order = {
  id: number;
  order_id?: string;
  amount?: number;
  inr_amount?: number;
  type?: string;
  created_at?: string;
  user_id?: number;
  order_type?: string;
};

type Props = {
  notifications?: Order[];
  closingId: number | null;
  onAccept: (o: Order) => void;
  onDeny: (o: Order) => void;
  onClose: (o: Order) => void;
  onExited: (id: number) => void;
};

const NotificationSlider: React.FC<Props> = ({
  notifications = [],
  closingId,
  onAccept,
  onDeny,
  onClose,
  onExited,
}) => {
  const visible = notifications.filter((n) => n.id !== closingId);

  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.muted = true;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.muted = false;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    const audio = new Audio("/merchant/audio2.wav");
    audio.play().catch(() => {});
  }, [notifications.length]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 font-sans">
      <AnimatePresence>
        {visible.map((order) => (
          <motion.div
            key={order.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onAnimationComplete={() => {
              if (closingId === order.id) onExited(order.id);
            }}
            className="relative w-76 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200/60"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${
                order.order_type === "buy"
                  ? "bg-blue-600"
                  : order.order_type === "sell"
                  ? "bg-emerald-600"
                  : "bg-purple-600"
              } rounded-l-xl`}
            />

            <div className="p-4 pl-5">
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-1 rounded ${
                      order.order_type == "buy"
                        ? "bg-blue-50 text-blue-600"
                        : order?.order_type == "sell"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {/* Bag Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">
                    New{" "}
                    {order?.order_type == "buy"
                      ? "Buy"
                      : order?.order_type == "sell"
                      ? "Sell"
                      : "Scan"}{" "}
                    Order
                  </h3>
                </div>
                <button
                  onClick={() => onClose(order)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {/* Close Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              {/* Content Grid: Split into 2 columns to save vertical height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 items-center">
                {/* Left Column: The Money */}
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 leading-tight">
                    ₹{order.inr_amount.toFixed(2)}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    {order.amount.toFixed(4)} {order.type.toUpperCase()}
                  </div>
                </div>

                {/* Right Column: Meta Details (User & ID) */}
                <div className="text-xs text-slate-600 space-y-1.5 border-l border-slate-100 pl-4">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="truncate font-medium max-w-[120px]">
                      {order.user_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="font-mono opacity-80">
                      #{order.order_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <svg
                      className="w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {order.created_at &&
                        new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions - Compact padding */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  onClick={() => onDeny(order)}
                  className="text-xs cursor-pointer transition ease-in-out duration-300 font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                >
                  Deny
                </button>
                <button
                  onClick={() => onAccept(order)}
                  className={`text-xs cursor-pointer transition ease-in-out duration-300 font-semibold ${
                    order.order_type == "buy"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : order?.order_type == "sell"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white px-4 py-1.5 rounded shadow-sm  transition-colors`}
                >
                  Accept Order
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSlider;
