import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const PublicRoute: React.FC = () => {
  const isConnected = useSelector((state: RootState) => state.user.isConnected);

  return !isConnected ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
