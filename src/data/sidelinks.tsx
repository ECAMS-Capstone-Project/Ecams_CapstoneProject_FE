import {
  BellRingIcon,
  DollarSignIcon,
  LayoutDashboardIcon,
  Package2Icon,
  UniversityIcon,
  UserIcon,
} from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Dashboard",
    label: "",
    href: "/admin",
    icon: <LayoutDashboardIcon size={18} />,
  },
  {
    title: "University",
    label: "",
    href: "/admin/university",
    icon: <UniversityIcon size={18} />,
  },
  {
    title: "Package",
    label: "",
    href: "/admin/package",
    icon: <Package2Icon size={18} />,
  },
  {
    title: "Payment",
    label: "",
    href: "/admin/payment",
    icon: <DollarSignIcon size={18} />,
  },
  {
    title: "User",
    label: "",
    href: "/admin/user",
    icon: <UserIcon size={18} />,
  },

  {
    title: "Notification",
    label: "",
    href: "/admin/notification",
    icon: <BellRingIcon size={18} />,
  },
];
