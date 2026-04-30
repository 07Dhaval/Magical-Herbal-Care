import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const isAuth = localStorage.getItem("adminAuth");

  if (!isAuth) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}