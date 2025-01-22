import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ReactNode } from "react";

interface GuestAuthProps {
    children: ReactNode
}

export default function GuestAuth({ children }: GuestAuthProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // if (user && user?.roleName == "Staff") {
        //     return <Navigate to="/personal-profile" />;
        // }
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}