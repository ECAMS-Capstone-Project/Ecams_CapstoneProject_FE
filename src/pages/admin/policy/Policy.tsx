import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Policy } from "@/models/Policy";
import { getPolicyList } from "@/api/agent/PolicyAgent";
import { EditPolicyDialog } from "@/components/partial/admin/policy/PolicyFormDialog";
import RolePolicy from "@/components/partial/admin/policy/RolePolicy";

const PolicyTable = React.lazy(
  () => import("@/components/partial/admin/policy/PolicyTable")
);

const Policy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [policyList, setPolicyList] = useState<Policy[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  // const [activeTab, setActiveTab] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      try {
        const policyData = await getPolicyList(pageSize, pageNo);
        if (policyData) {
          setPolicyList(policyData.data?.data || []); // Đảm bảo `data.data` tồn tại
          setTotalPages(policyData.data?.totalPages || 1); // Đặt số trang
        } else {
          console.warn("PolicyList returned no data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };

    loadUser();
  }, [pageNo, pageSize]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage Policy`}
              description="Manage Policy in the system"
            />

            <Dialog>
              <DialogTrigger>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <EditPolicyDialog initialData={null} />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <Tabs
            defaultValue="policyList"
            // value={activeTab}
            // onValueChange={setActiveTab}
            className="w-full mt-3 p-2"
          >
            <TabsList>
              <TabsTrigger value="policyList">List of policy</TabsTrigger>
              <TabsTrigger value="rolePolicy">Role's policy</TabsTrigger>
            </TabsList>

            <TabsContent value="policyList">
              <PolicyTable data={policyList} />
              <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </TabsContent>
            <TabsContent value="rolePolicy">
              <RolePolicy data={policyList} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </React.Suspense>
  );
};

export default Policy;
