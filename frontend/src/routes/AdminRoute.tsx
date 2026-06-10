import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}