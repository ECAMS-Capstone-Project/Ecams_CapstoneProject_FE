import useAuth from "@/hooks/useAuth";
import {
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
} from "lucide-react";

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

  if (user?.roles[0].toLocaleLowerCase() === "staff") {
    sidelinks.push(
      {
        title: "Dashboard",
        href: "/staff",
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
        href: "/staff/wallet-staff",
        icon: <ReceiptText size={18} />,
        id: 22,
      },
      {
        title: "Request Student",
        href: "/staff/request-student",
        icon: <UserCheck size={18} />,
        id: 23,
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
