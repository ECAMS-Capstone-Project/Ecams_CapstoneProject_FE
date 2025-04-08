import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import type { Contract } from "@/models/Contract";
import { ContractList } from "@/api/agent/ContractAgent";
import ContractTable from "@/components/partial/admin/contract/ContractTable";

const Contract = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const loadPackage = async () => {
      try {
        //   // Tải cả component lười biếng và dữ liệu API song song
        const contractData = await ContractList(pageSize, pageNo);
        setContractList(contractData.data?.data || []); // Đảm bảo `data.data` tồn tại
        setTotalPages(contractData.data?.totalPages || 1); // Đặt số trang
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
              title={`View Contracts`}
              description="View Contracts in the system"
            />
          </div>
          <Separator />
          <ContractTable data={contractList} />
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

export default Contract;
