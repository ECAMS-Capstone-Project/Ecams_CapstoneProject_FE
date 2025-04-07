import { ReactNode, useState, useEffect } from "react";
import { Alert, AlertTitle, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import WaitingModal from "@/components/global/WaitingModal";

// ----------------------------------------------------------------------
// Define Props
interface RoleBasedGuardProps {
  accessibleRoles: string[] | "Null"; // Example: ['admin', 'leader']
  children: ReactNode;
  status?: string;
}

// Hook to get the current role
const useCurrentRole = (): string[] => {
  const { user } = useAuth();
  return user?.roles || ["null"];
};

// ----------------------------------------------------------------------
const useCurrentStatus = () => {
  // Logic here to get current user role
  const { user } = useAuth();
  const status = user?.status;
  return status || "Pending";
};
export default function RoleBasedGuard({
  accessibleRoles,
  children,
  status = "ACTIVE",
}: RoleBasedGuardProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateDashboard = () => {
    navigate("/staff");
  };

  const handleNavigateLogin = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigateHomePage = () => {
    navigate("/");
  };

  const currentRole = useCurrentRole();
  const currentStatus = useCurrentStatus();

  if (loading) {
    return (
      <div
        style={{
          background: "#f1f5f9",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WaitingModal open={loading} />
      </div>
    );
  }

  // if (currentRole === "Null") {
  //   return <HomePage />;
  // }

  if (
    !currentRole.some((role) => accessibleRoles.includes(role)) ||
    currentStatus !== status
  ) {
    return (
      <div
        style={{
          background: "#f1f5f9",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert style={{ fontSize: "20px" }} severity="error">
          <AlertTitle style={{ fontSize: "20px" }}>
            You can't reach this page
          </AlertTitle>
          You don't have permission to access this page
          <AlertTitle style={{ fontSize: "20px", marginTop: "15px" }}>
            {currentRole && currentRole.includes("ADMIN") && (
              <Button onClick={handleNavigateDashboard}>Back to Admin</Button>
            )}
            {currentRole && currentRole.includes("REPRESENTATIVE") && (
              <Button onClick={handleNavigateDashboard}>Back to Staff</Button>
            )}
            {currentRole &&
              currentRole.includes("STUDENT") &&
              currentStatus == "CHECKING" && (
                <Button onClick={handleNavigateLogin}>Back to Log in</Button>
              )}
            {(!currentRole || currentRole.includes("null")) && (
              <Button onClick={handleNavigateHomePage}>
                Back to home page
              </Button>
            )}
          </AlertTitle>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
