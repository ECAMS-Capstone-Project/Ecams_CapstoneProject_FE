import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import type { Contract } from "@/models/Contract";
import { ContractRepresentative } from "@/api/representative/ContractAPI";
import useAuth from "@/hooks/useAuth";
import ContractStaffTable from "@/components/partial/representative/representative-contract/ContractStaffTable";

const ContractRepresentativePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth()
  useEffect(() => {
    const loadContract = async () => {
      if (user) {
        try {
          //   // Tải cả component lười biếng và dữ liệu API song song
          const contractData = await ContractRepresentative(pageSize, pageNo, user.userId);
          setContractList(contractData.data?.data || []);
          setTotalPages(contractData.data?.totalPages || 1);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsLoading(false); // Hoàn tất tải
        }
      }
    };
    loadContract();
  }, [pageNo, pageSize, user]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {/* Hiển thị spinner nếu API chưa tải xong */}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <Separator />
          <ContractStaffTable data={contractList} />
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

export default ContractRepresentativePage;
