import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

interface GuestAuthProps {
    children: ReactNode
}

export default function GuestAuth({ children }: GuestAuthProps) {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user && user.roles[0] == "STAFF" && (user.universityId != null && user.universityId != undefined)) {
            return <Navigate to="/staff" />;
        }
        if (user && user.roles[0] == "STAFF" && (user.universityId == null || user.universityId == undefined)) {
            return <Navigate to="/update-university" />;
        }
        if (user && user.roles[0] == "ADMIN") {
            return <Navigate to="/admin" />;
        }
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}