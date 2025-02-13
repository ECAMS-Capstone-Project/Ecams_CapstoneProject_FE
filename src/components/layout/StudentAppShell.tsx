/* eslint-disable @typescript-eslint/no-unused-vars */
// StudentAppShell.tsx
import { Outlet } from "react-router-dom";
import { Layout } from "./layout";
import { StudentHeader } from "./StudentHeader";
import { Footer } from "./footer";

export default function StudentAppShell() {
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <main id="content" className="h-full w-full">
        <Layout>
          {/* ===== Header for Student ===== */}
          <Layout.Header sticky className="w-full m-0 px-0 box-border">
            <StudentHeader />
          </Layout.Header>

          <Layout.Body>
            <Outlet />
          </Layout.Body>
          <Footer />
        </Layout>
      </main>
    </div>
  );
}
