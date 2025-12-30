import React from "react";
import DepositeForm from "@/components/wallet/DepositeForm";
import DataBox from "@/components/wallet/DataBox";

const Wallet: React.FC = () => {
  const [balance, setBalance] = React.useState(null);
  return (
    <div className="mt-24 px-2 flex flex-col gap-5 max-w-lg mx-auto"> 
      <DataBox setBalance={setBalance} />
      <DepositeForm balance={balance} />
      
    </div>
  );
};

export default Wallet;
