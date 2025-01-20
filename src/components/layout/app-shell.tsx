import { Outlet, useLocation } from "react-router-dom";
// import { UserNav } from "./user-nav";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import { Layout } from "./layout";
import Sidebar from "../ui/sidebar";

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
          <Layout.Header sticky>
            {isDashboard}
            <div className="ml-auto flex items-center space-x-4">
              {/* <UserNav /> */}
            </div>
          </Layout.Header>

          <Layout.Body>
            <Outlet />
          </Layout.Body>
        </Layout>
      </main>
    </div>
  );
}
