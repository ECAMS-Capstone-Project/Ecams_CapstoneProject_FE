import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditPackageDialog } from "@/components/partial/admin/package/packageFormDialog";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import { Transaction } from "@/models/Payment";
import { PaymentList } from "@/api/agent/TransactionAgent";

const PaymentTable = React.lazy(
  () => import("@/components/partial/admin/payment/PaymentTable")
);

const Payment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentList, setPaymentList] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const loadPackage = async () => {
      try {
        //   // Tải cả component lười biếng và dữ liệu API song song
        const transactionData = await PaymentList(pageSize, pageNo);
        setPaymentList(transactionData.data?.data || []); // Đảm bảo `data.data` tồn tại
        setTotalPages(transactionData.data?.totalPages || 1); // Đặt số trang
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false); // Hoàn tất tải
      }
    };
    loadPackage();
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
              title={`Manage Payments`}
              description="Manage Payments in the system"
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <EditPackageDialog initialData={null} />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <PaymentTable data={paymentList} />
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

export default Payment;
