import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import type { Package } from "@/models/Package";
import { Plus } from "lucide-react";
import { useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditPackageDialog } from "@/components/partial/admin/package/packageFormDialog";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { usePackages } from "@/hooks/admin/usePackage";
const PackageTable = React.lazy(
  () => import("@/components/partial/admin/package/PackageTable")
);

const Package = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { packages, totalPages, isLoading } = usePackages(pageNo, pageSize);
  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage Package`}
              description="Manage Pakage in the system"
            />

            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <EditPackageDialog initialData={null} />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <PackageTable data={packages} />
          <DataTablePagination
            currentPage={pageNo}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
          />
        </>
      )}
    </React.Suspense>
  );
};

export default Package;
