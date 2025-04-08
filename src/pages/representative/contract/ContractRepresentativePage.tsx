import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import React from "react";
import LoadingAnimation from "@/components/ui/loading";
import { DataTablePagination } from "@/components/ui/datatable/data-table-pagination";
import type { Contract } from "@/models/Contract";
import { ContractRepresentative } from "@/api/representative/ContractAPI";
import useAuth from "@/hooks/useAuth";
import ContractStaffTable from "@/components/partial/representative/representative-contract/ContractStaffTable";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface ContractRepresentativePageProps {
  dateRange: DateRange | undefined;
}

const ContractRepresentativePage = ({
  dateRange,
}: ContractRepresentativePageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [contractList, setContractList] = useState<Contract[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadContract = async () => {
      if (user) {
        try {
          const contractData = await ContractRepresentative(
            pageSize,
            pageNo,
            user.userId,
            undefined, // status
            dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
            dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
          );
          setContractList(contractData.data?.data || []);
          setTotalPages(contractData.data?.totalPages || 1);
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadContract();
  }, [pageNo, pageSize, user, dateRange]);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
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
