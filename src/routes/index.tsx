import ErrorException from "@/components/global/ErrorException";
import AppShell from "@/components/layout/AppShell";
import Contact from "@/components/partial/Contact/Contact";
import GuestAuth from "@/Guard/GuestAuth";
import Dashboard from "@/pages/admin/dashboard/dashboard";
import Package from "@/pages/admin/package/Package";
import University from "@/pages/admin/university/Package";
import ChooseRegister from "@/pages/authentication/chooseRegister";
import ForgotPassword from "@/pages/authentication/forgotPassword";
import Login from "@/pages/authentication/login";
import Register from "@/pages/authentication/register";
import RegisterUniversity from "@/pages/authentication/registerUniversity";
import VerifyCode from "@/pages/authentication/verifyCode";
import { createBrowserRouter } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivateRoute = ({ element, ...rest }: any) => {
  // const { isLoggedIn } = useAuth();

  // if (!isLoggedIn) {
  //   return <Navigate to="/" replace />;
  // }

  return <AppShell {...rest}>{element}</AppShell>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Contact />,
    errorElement: <ErrorException />,
  },
  {
    path: "/login",
    element: (
      <GuestAuth>
        {" "}
        <Login />{" "}
      </GuestAuth>
    ),
    errorElement: <ErrorException />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorException />,
  },
  {
    path: "/register-university",
    element: <RegisterUniversity />,
    errorElement: <ErrorException />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorException />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
    errorElement: <ErrorException />,
  },
  {
    path: "/choose-register",
    element: <ChooseRegister />,
    errorElement: <ErrorException />,
  },
  {
    path: "/admin",
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/admin/package",
        element: <Package />,
      },
      {
        path: "/admin/university",
        element: <University />,
      },
    ],
  },
]);
