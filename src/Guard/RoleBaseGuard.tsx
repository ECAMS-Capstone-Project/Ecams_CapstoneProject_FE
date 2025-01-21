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
  return user?.roles || ["admin"];
};

// ----------------------------------------------------------------------

export default function RoleBasedGuard({
  accessibleRoles,
  children,
}: RoleBasedGuardProps): JSX.Element {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateDashboard = () => {
    navigate("/dashboard");
  };

  const currentRole = useCurrentRole();

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

  if (!accessibleRoles.includes(currentRole[0])) {
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
            Quyền truy cập bị từ chối
          </AlertTitle>
          Bạn không có quyền để truy cập địa chỉ này
          <AlertTitle style={{ fontSize: "20px", marginTop: "15px" }}>
            {currentRole && currentRole.includes("Admin") && (
              <Button onClick={handleNavigateDashboard}>
                Trở về trang Admin
              </Button>
            )}
            {currentRole && currentRole.includes("Staff") && (
              <Button onClick={handleNavigateHome}>Trở về trang chủ</Button>
            )}
          </AlertTitle>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
