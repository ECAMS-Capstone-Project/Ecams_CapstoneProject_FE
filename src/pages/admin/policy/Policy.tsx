import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Policy } from "@/models/Policy";
import { EditPolicyDialog } from "@/components/partial/admin/policy/PolicyFormDialog";
import RolePolicy from "@/components/partial/admin/policy/RolePolicy";
import { usePolicy } from "@/hooks/admin/usePolicy";

const PolicyTable = React.lazy(
  () => import("@/components/partial/admin/policy/PolicyTable")
);

const Policy = () => {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { policies, isLoading, totalPages } = usePolicy(pageNo, pageSize);

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
              <PolicyTable data={policies} />
              <DataTablePagination
                currentPage={pageNo}
                totalPages={totalPages}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </TabsContent>
            <TabsContent value="rolePolicy">
              <RolePolicy data={policies} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </React.Suspense>
  );
};

export default Policy;
