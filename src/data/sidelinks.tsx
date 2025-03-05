import useAuth from "@/hooks/useAuth";
import {
  AreaChart,
  BellRingIcon,
  DollarSignIcon,
  FileText,
  LayoutDashboardIcon,
  Package2Icon,
  ReceiptText,
  Settings,
  UniversityIcon,
  UserCheck,
  UserIcon,
  Wallet,
} from "lucide-react";
import Groups2Icon from "@mui/icons-material/Groups2";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Event, EventAvailableTwoTone } from "@mui/icons-material";
export interface NavLink {
  title: string;
  href: string;
  icon: JSX.Element;
  label?: string;
  id: number;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

const SidebarLinks = () => {
  const { user } = useAuth(); // Lấy user từ context

  const sidelinks: SideLink[] = [];

  if (user?.roles[0].toLocaleLowerCase() === "admin") {
    sidelinks.push(
      {
        title: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboardIcon size={18} />,
        id: 1,
      },
      {
        title: "University",
        href: "/admin/university",
        icon: <UniversityIcon size={18} />,
        id: 2,
      },
      {
        title: "Package",
        href: "/admin/package",
        icon: <Package2Icon size={18} />,
        id: 3,
      },
      {
        title: "Contract",
        href: "/admin/contract",
        icon: <DollarSignIcon size={18} />,
        id: 4,
      },
      {
        title: "User",
        href: "/admin/user",
        icon: <UserIcon size={18} />,
        id: 5,
      },
      {
        title: "Notification",
        href: "/admin/notification",
        icon: <BellRingIcon size={18} />,
        id: 6,
      },
      {
        title: "Policy",
        href: "/admin/policy",
        icon: <FileText size={18} />,
        id: 7,
      }
    );
  }

  if (user?.roles[0].toLocaleLowerCase() === "representative") {
    sidelinks.push(
      {
        title: "Dashboard",
        href: "/representative",
        icon: <LayoutDashboardIcon size={18} />,
        id: 1,
      },
      {
        title: "Package",
        href: "/view-package",
        icon: <FileText size={18} />,
        id: 8,
      },
      {
        title: "Contract",
        href: "/representative/wallet-representative",
        icon: <ReceiptText size={18} />,
        id: 22,
      },
      {
        title: "Request Student",
        href: "/representative/request-student",
        icon: <UserCheck size={18} />,
        id: 23,
      },
      {
        title: "Area",
        href: "/representative/area",
        icon: <AreaChart size={18} />,
        id: 24,
      },
      {
        title: "Wallet",
        href: "/representative/wallet",
        icon: <Wallet size={18} />,
        id: 24,
      },
      {
        title: "Event",
        href: "/representative/event",
        icon: <Event />,
        id: 24,
      },

      {
        title: "Club",
        href: "/representative/club",
        icon: <Groups2Icon />,
        id: 24,
        sub: [
          {
            title: "Event-Club",
            href: "/representative/event-club",
            icon: <EventAvailableTwoTone />,
            id: 24,
          },
          {
            title: "Club",
            href: "/representative/club",
            icon: <EventAvailableTwoTone />,
            id: 24,
          },
        ],
      }
    );
  }
  if (
    user?.roles.some(
      (role) =>
        role.toLocaleLowerCase() === "student" ||
        role.toLocaleLowerCase() === "club-owner"
    )
  ) {
    sidelinks.push(
      {
        title: "My Club",
        href: "/club",
        icon: <Groups2Icon />,
        id: 0,
      },
      {
        title: "Invitation Club",
        href: "/club/invitation",
        icon: <HowToRegIcon />,
        id: 21,
      }
    );
  }
  sidelinks.push({
    title: "Setting",
    href: "/common/profile",
    icon: <Settings size={18} />,
    id: 10,
  });
  return sidelinks;
};

export default SidebarLinks;
