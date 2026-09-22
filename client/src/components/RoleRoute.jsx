import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ allowedAccountTypes, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedAccountTypes.includes(user.accountType)) {
    const fallbackPath =
      user.accountType === "tutor" ? "/dashboard/tutor" : "/dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export default RoleRoute;