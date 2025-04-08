/* eslint-disable react-hooks/exhaustive-deps */
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
// import WaitingCheckout from "@/components/partial/representative/representative-checkout/WaitingCheckOut";
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
import EventClub from "@/pages/representative/event-club/EventClub";
import ClubRankingPage from "@/components/partial/club_owner/manage_club/ClubRanking";
import ClubActiveListPage from "@/pages/representative/manage-club/ClubActiveListPage";
import CreateTaskClub from "@/components/partial/representative/representative-task/CreateTaskClub";
import { CreateEventClub } from "@/components/partial/representative/representative-event/CreateEventUni";
import { StudentEventDetail } from "@/components/partial/student/events/EventDetail/EventDetail";
import { FreeEventConfirm } from "@/components/partial/student/event-register/FreeConfirmation";
import { EventConfirmSuccess } from "@/components/partial/student/event-register/ConfirmSuccess";
import StudentClubDetail from "@/components/partial/student/clubs/ClubDetail/ClubDetail";
import EventPaymentConfirmation from "@/components/partial/student/event-register/PaymentConfirm";
import WaitingCheckout from "@/components/partial/student/event-register/WaitingCheckOut";
import { EventCheckIn } from "@/pages/club-owner/event/EventCheckIn";
import { StudentEventSection } from "@/components/partial/student/events/student-events/StudentEventSection";
import EventParticipants from "@/pages/club-owner/event/EventParticipants";
import { InterClubEvent } from "@/pages/club-owner/inter-club-event/InterclubEvent";
import { CreateInterClubEventPage } from "@/pages/club-owner/inter-club-event/CreateInterClubEvent";
import { EventDetailPage } from "@/pages/club-owner/inter-club-event/EventDetail";
import { StudentSchedule } from "@/components/partial/student/schedule/StudentSchedule";
import RepresentativeRequestsPage from "@/pages/representative/club-owner-request/RepresentativeOwnerRequestsPage";
import AdminRepRequestsPage from "@/pages/admin/request-representative/AdminRepRequestsPage";
import RepresentativeInformationPage from "@/pages/representative/request-to-change/RepresentativeInfoPage";
import UniversityRepresentativeHistory from "@/pages/representative/history-representative/UniversityRepresentativeHistory";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivateRoute = ({ element, ...rest }: any) => {
  const { user, logout } = useAuth();
  const userStatus = user?.status;

  useEffect(() => {
    const handleLogout = async () => {

      if (
        (user?.email !== "ecams@admin.com" && (user?.roles.includes("REPRESENTATIVE") || user?.roles.includes("ADMIN"))) &&
        userStatus !== "ACTIVE"
      ) {
        await logout();
        window.location.href = "/login";
      } else {
        return;
      }

    };
    handleLogout();
  }, [userStatus, logout, user?.roles, user?.email]);

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
      {
        path: "/admin/request-representative",
        element: <AdminRepRequestsPage />,
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
    element: <PrivateRoute />,
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
        path: "/representative/event-club",
        element: <EventClub />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/club",
        element: <CheckingClubPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/club-ranking",
        element: <ClubRankingPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/active-club",
        element: <ClubActiveListPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/request-change-owner",
        element: <RepresentativeRequestsPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/request-change",
        element: <RepresentativeInformationPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/representative/history-representative",
        element: <UniversityRepresentativeHistory />,
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
    path: "/events/payment-confirm",
    element: <EventPaymentConfirmation />,
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
        accessibleRoles={["REPRESENTATIVE", "ADMIN", "STUDENT", "CLUB_OWNER"]}
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
    element: (
      <RoleBasedGuard accessibleRoles={["STUDENT"]}>
        <StudentAppShell />
      </RoleBasedGuard>
    ),
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
        path: "/student/events/:eventId",
        element: <StudentEventDetail />,
      },
      {
        path: "/student/student-events",
        element: <StudentEventSection />,
      },
      {
        path: "/student/events/free-confirmation",
        element: <FreeEventConfirm />,
      },
      {
        path: "/student/events/fee-confirmation",
        element: <FreeEventConfirm />,
      },
      {
        path: "/student/events/success",
        element: <EventConfirmSuccess />,
      },

      {
        path: "/student/club",
        element: <Clubs />,
      },
      {
        path: "/student/club/:clubId",
        element: <StudentClubDetail />,
      },

      {
        path: "/student/schedule",
        element: <StudentSchedule />,
        errorElement: <ErrorException />,
      },
    ],
    errorElement: <ErrorException />,
  },
  {
    path: "/student/waiting",
    element: <WaitingStudentPage />,
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
        path: "/club/event-check-in",
        element: <EventCheckIn />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/event-participants/:eventId",
        element: <EventParticipants />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/event-check-in",
        element: <EventCheckIn />,
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
      },
      {
        path: "/club/inter-club-event",
        element: <InterClubEvent />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/inter-club-event/create",
        element: <CreateInterClubEventPage />,
        errorElement: <ErrorException />,
      },
      {
        path: "/club/inter-club-event/:clubEventId",
        element: <EventDetailPage />,
        errorElement: <ErrorException />,
      },
    ],
    errorElement: <ErrorException />,
  },
]);
