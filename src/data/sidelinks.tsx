import useAuth from "@/hooks/useAuth";
import {
  BellRingIcon,
  DollarSignIcon,
  FileText,
  LayoutDashboardIcon,
  Package2Icon,
  Settings,
  UniversityIcon,
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

  const settingLink: SideLink = {
    title: "Setting",
    href: "/common/profile",
    icon: <Settings size={18} />,
    id: 999, // Đảm bảo không trùng ID
  };
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
        href: "/staff/dashboard",
        icon: <LayoutDashboardIcon size={18} />,
        id: 1,
      },
      {
        title: "Package",
        href: "/view-package",
        icon: <FileText size={18} />,
        id: 8,
      }
    );
  }
  sidelinks.push(settingLink);
  return sidelinks;
};

export default SidebarLinks;
