import ErrorException from "@/components/global/ErrorException";
import AppShell from "@/components/layout/AppShell";
import PaymentConfirmation from "@/components/partial/representative/confirm-payment";
import DashboardRepresentative from "@/pages/representative/dashboard/dashboardRepresentative";
import PackageContract from "@/components/partial/representative/representative-signature/PackageContract";
import AdditionInfoUniversityForm from "@/components/partial/university-representative-register/additionInfoUniversityForm";
import GuestAuth from "@/Guard/GuestAuth";
import Dashboard from "@/pages/admin/dashboard/dashboard";
import Notifications from "@/pages/admin/notification/Notification";
import Package from "@/pages/admin/package/Package";
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
import WaitingCheckRepresentativePage from "@/pages/representative/additionRegister/waitingCheckRepresentativePage";
import PackageList from "@/pages/representative/package/packageListPage";
import { createBrowserRouter } from "react-router-dom";
import WaitingCheckout from "@/components/partial/representative/representative-checkout/WaitingCheckOut";
import PendingUniversity from "@/pages/admin/university/PendingUni";
import GuestLandingPage from "@/components/partial/landing/LandingPage";
import HomePage from "@/pages/student/home/HomePage";
import StudentAppShell from "@/components/layout/StudentAppShell";
import Contract from "@/pages/admin/contract/Contract";
import ContractDetail from "@/components/partial/admin/contract/ContractDetail";
import { Event } from "@/pages/student/events/Event";
import { Clubs } from "@/pages/student/clubs/Clubs";
import RoleBasedGuard from "@/Guard/RoleBaseGuard";
import RequestClubPage from "@/pages/club-owner/RequestClubPage";
import WalletRepresentative from "@/components/partial/representative/representative-personal/walletRepresentative";
import ExtendCheckOut from "@/components/partial/representative/representative-checkout/ExtendCheckOut";
import RepresentativeContractDetail from "@/components/partial/representative/representative-contract/ContractDetail";
import ApproveStudentPage from "@/pages/representative/approveStudent/ApproveStudentPage";
import ClubListPage from "@/pages/club-owner/manage-club/ClubListPage";
import ClubDetailPage from "@/pages/club-owner/manage-club/ClubDetailPage";
import WaitingStudentPage from "@/components/partial/student/waiting/WaitingStudentPage";
import InvitationClubPage from "@/pages/club-owner/manage-club/InvitationClubPage";
import Area from "@/pages/staff/area/Area";
import Wallet from "@/pages/staff/wallet/Wallet";
import Events from "@/pages/staff/event/Event";
import { EventDetail } from "@/components/partial/staff/staff-events/ViewEventDialog";
import { RequestEventDetail } from "@/components/partial/staff/staff-events/RequestEventForm";
import { CreateEvent } from "@/components/partial/staff/staff-events/CreateEventFormDialog";
import CheckingClubPage from "@/pages/representative/manage-club/CheckingClubPage";
import { CreateEventClub } from "@/components/partial/representative/representative-event/CreateEventUni";
import { CreateTaskClub } from "@/components/partial/representative/representative-task/CreateTaskClub";

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
    element: (
      <RoleBasedGuard accessibleRoles={["ADMIN"]}>
        <PrivateRoute />
      </RoleBasedGuard>
    ),
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
        path: "/admin/contract",
        element: <Contract />,
      },
      {
        path: "/admin/contract/:contractId",
        element: <ContractDetail />,
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
    path: "/update-university",
    element: (
      <RoleBasedGuard accessibleRoles={["REPRESENTATIVE"]}>
        <AdditionInfoUniversityForm />
      </RoleBasedGuard>
    ),
    errorElement: <ErrorException />,
  },
  {
    path: "/waiting-representative",
    element: <WaitingCheckRepresentativePage />,
  },
  {
    path: "/representative",
    element: (
      <RoleBasedGuard accessibleRoles={["REPRESENTATIVE"]}>
        <PrivateRoute />
      </RoleBasedGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardRepresentative />,
      },
      {
        path: "/representative/wallet-representative",
        element: <WalletRepresentative />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/contract/:contractId",
        element: <RepresentativeContractDetail />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/request-student",
        element: <ApproveStudentPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/area",
        element: <Area />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/wallet",
        element: <Wallet />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/event",
        element: <Events />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/event/:eventId",
        element: <EventDetail />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/event/request/:eventId",
        element: <RequestEventDetail />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/event/new",
        element: <CreateEvent />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/club",
        element: <CheckingClubPage />,
        errorElement: <ErrorException />,
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
    element: (
      <RoleBasedGuard
        accessibleRoles={["REPRESENTATIVE", "ADMIN", "STUDENT", "CLUB-OWNER"]}
      >
        <PrivateRoute />
      </RoleBasedGuard>
    ),
    children: [
      {
        path: "/common/profile",
        element: <ProfilePage />,
      },
    ],
    errorElement: <ErrorException />,
  },
  {
    path: "/student",
    element: <StudentAppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/student/event",
        element: <Event />,
      },
      {
        path: "/student/club",
        element: <Clubs />,
      },
      {
        path: "/student/waiting",
        element: <WaitingStudentPage />,
      },
    ],
    errorElement: <ErrorException />,
  },
  {
    path: "/extend-checkout",
    element: <ExtendCheckOut />,
    errorElement: <ErrorException />,
  },
  {
    path: "/club",
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <ClubListPage />,
      },
      {
        path: "/club/detail/:clubId",
        element: <ClubDetailPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/create-club",
        element: <RequestClubPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/invitation",
        element: <InvitationClubPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/create-event",
        element: <CreateEventClub />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/create-task",
        element: <CreateTaskClub />,
        errorElement: <ErrorException />,
      }
    ],
    errorElement: <ErrorException />,
  },
]);
