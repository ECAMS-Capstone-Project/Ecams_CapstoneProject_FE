import { useLocation, Navigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import useAuth from "../hooks/useAuth";
import GlobalLoading from "../components/global/GlobalLoading";
import Login from "@/pages/authentication/login";

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
    const { isInitialized, isAuthenticated } = useAuth();
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

    if (!isInitialized) {
        return <GlobalLoading />
    }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <Login />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }

    return <>{children}</>;
};

export default RequireAuth;