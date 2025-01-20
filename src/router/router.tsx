/* eslint-disable @typescript-eslint/no-explicit-any */
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/admin/dashboard/dashboard";
import Login from "@/pages/authentication/login";

import { createBrowserRouter } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }: any) => {
  // const { isLoggedIn } = useAuth();

  // if (!isLoggedIn) {
  //   return <Navigate to="/" replace />;
  // }

  return <AppShell {...rest}>{element}</AppShell>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  //   {
  //     path: "/change-password",
  //     element: <ChangePassword />,
  //   },
  {
    path: "/admin",
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
