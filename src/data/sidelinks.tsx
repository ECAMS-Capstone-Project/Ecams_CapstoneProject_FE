import {
  LayoutDashboardIcon,
  Package2Icon,
  UniversityIcon,
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
];
