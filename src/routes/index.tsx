import ErrorException from "@/components/global/ErrorException";
import AppShell from "@/components/layout/AppShell";
import PaymentConfirmation from "@/components/partial/staff/confirm-payment";
import DashboardStaff from "@/pages/staff/dashboard/dashboardStaff";
import PackageContract from "@/components/partial/staff/staff-signature/PackageContract";
import AdditionInfoUniversityForm from "@/components/partial/university-staff-register/additionInfoUniversityForm";
import GuestAuth from "@/Guard/GuestAuth";
import Dashboard from "@/pages/admin/dashboard/dashboard";
import Notifications from "@/pages/admin/notification/Notification";
import Package from "@/pages/admin/package/Package";
import Payment from "@/pages/admin/payment/Payment";
import Policy from "@/pages/admin/policy/Policy";
import University from "@/pages/admin/university/University";
import User from "@/pages/admin/user/User";
import ChooseRegister from "@/pages/authentication/chooseRegister";
import ForgotPassword from "@/pages/authentication/forgotPassword";
import Login from "@/pages/authentication/login";
import Register from "@/pages/authentication/register";
import RegisterUniversity from "@/pages/authentication/registerUniversity";
import VerifyCode from "@/pages/authentication/verifyCode";
import VerifyEmail from "@/pages/authentication/verifyEmail";
import ProfilePage from "@/pages/common/Profile";
import WaitingCheckStaffPage from "@/pages/staff/additionRegister/waitingCheckStaffPage";
import PackageList from "@/pages/staff/package/packageListPage";
import { createBrowserRouter } from "react-router-dom";
import WaitingCheckout from "@/components/partial/staff/staff-checkout/WaitingCheckOut";
import PendingUniversity from "@/pages/admin/university/PendingUni";
import GuestLandingPage from "@/components/partial/landing/LandingPage";

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
    element: <GuestLandingPage />,
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
    path: "/verify-code/:email",
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
      {
        path: "/admin/university/pending",
        element: <PendingUniversity />,
      },
      {
        path: "/admin/payment",
        element: <Payment />,
      },
      {
        path: "/admin/user",
        element: <User />,
      },
      {
        path: "/admin/notification",
        element: <Notifications />,
      },
      {
        path: "/admin/policy",
        element: <Policy />,
      },
    ],
  },
  {
    path: "/verify-email/:email",
    element: (
      <GuestAuth>
        <VerifyEmail />
      </GuestAuth>
    ),
    errorElement: <ErrorException />,
  },
  {
    path: "/staff",
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <AdditionInfoUniversityForm />,
      },
      {
        path: "/staff/waiting-staff",
        element: <WaitingCheckStaffPage />,
      },
      {
        path: "/staff/dashboard",
        element: <DashboardStaff />,
      },
    ],
    errorElement: <ErrorException />,
  },
  {
    path: "/view-package",
    element: <PackageList />,
    errorElement: <ErrorException />,
  },
  {
    path: "/payment-confirm",
    element: <PaymentConfirmation />,
    errorElement: <ErrorException />,
  },
  {
    path: "/package-contract",
    element: <PackageContract />,
    errorElement: <ErrorException />,
  },
  {
    path: "/waiting-checkout",
    element: <WaitingCheckout />,
    errorElement: <ErrorException />,
  },
  {
    path: "/common",
    element: <PrivateRoute />,
    children: [
      {
        path: "/common/profile",
        element: <ProfilePage />,
      },
    ],
    errorElement: <ErrorException />,
  },
]);
