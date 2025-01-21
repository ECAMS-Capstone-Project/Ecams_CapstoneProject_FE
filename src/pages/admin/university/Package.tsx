import { PackageList } from "@/api/agent/PackageAgent";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import type { Package } from "@/models/Package";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { packageColumns } from "./package-table/column";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditPackageDialog } from "@/components/partial/admin/package/packageFormDialog";
const DataTable = React.lazy(
  () => import("@/components/ui/datatable/data-table")
);

const University = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        //   // Tải cả component lười biếng và dữ liệu API song song
        const packageData = await PackageList();
        setPackageList(packageData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };
    loadPackage();
  }, []);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage University`}
              description="Manage University in the system"
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
          <div className="-mx-4 mt-5 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <DataTable columns={packageColumns} data={packageList} />
          </div>
        </>
      )}
    </React.Suspense>
  );
};

export default University;
