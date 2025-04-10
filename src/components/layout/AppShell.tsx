import { Outlet, useLocation } from "react-router-dom";
// import { UserNav } from "./user-nav";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import Sidebar from "../ui/sidebar";
import { Layout } from "./layout";
import { UserNav } from "../ui/user-nav";
import { Separator } from "../ui/separator";

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const location = useLocation();

  // Check if the current route is the dashboard
  const isDashboard = location.pathname === "/admin";
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? "md:ml-14" : "md:ml-64"
        } h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <Layout.Header sticky className="px-4 py-3">
            {isDashboard}
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </Layout.Header>
          <Separator className="opacity-50 " />

          <Layout.Body>
            <Outlet />
          </Layout.Body>
        </Layout>
      </main>
    </div>
  );
}
