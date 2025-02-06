import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

interface GuestAuthProps {
    children: ReactNode
}

export default function GuestAuth({ children }: GuestAuthProps) {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user && user.roles[0] == "STAFF") {
            return <Navigate to="/staff" />;
        }
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}