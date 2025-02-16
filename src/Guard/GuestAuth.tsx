import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

interface GuestAuthProps {
  children: ReactNode;
}

export default function GuestAuth({ children }: GuestAuthProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (
      user &&
      user.roles.includes("STAFF") &&
      user.universityId != null &&
      user.universityId != undefined &&
      user.universityStatus != "PENDING"
    ) {
      return <Navigate to="/staff" />;
    }
    if (
      user &&
      user.roles.includes("STAFF") &&
      (user.universityId == null || user.universityId == undefined)
    ) {
      return <Navigate to="/update-university" />;
    }
    if (
      user &&
      user.roles.includes("STAFF") &&
      user.universityStatus.toUpperCase() == "PENDING"
    ) {
      return <Navigate to="/waiting-staff" />;
    }
    if (user && user.roles.includes("ADMIN")) {
      return <Navigate to="/admin" />;
    }
    if (user && user.roles.includes("STUDENT")) {
      return <Navigate to="/student" />;
    }
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
