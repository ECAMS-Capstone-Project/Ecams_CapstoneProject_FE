import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Contract } from "@/models/Contract";
import { MagicCard } from "@/components/magicui/magic-card";
import { getContractDetail } from "@/api/agent/ContractAgent";
import { TransactionTable } from "./TransactionTable";
import { Button } from "@/components/ui/button";
import LoadingAnimation from "@/components/ui/loading";
import { CornerUpLeft } from "lucide-react";
import { format } from "date-fns";

export default function ContractDetail() {
  const { contractId = "" } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchContractDetail() {
      const response = await getContractDetail(contractId);

      if (response.data) {
        setContract(response.data);
      }
    }
    fetchContractDetail();
  }, [contractId]);

  if (!contract) return <LoadingAnimation />;

  return (
    <div className=" mx-auto px-4 ">
      <div className="flex items-center mb-7"></div>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6 flex items-center  gap-2">
        <CornerUpLeft
          size={24}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/contract">Contracts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Contract Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Layout 2 cột */}
      <div className="grid mx-auto px-8 gap-6">
        <div className="grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contract Info */}
          <MagicCard
            className="p-8 bg-white shadow-lg rounded-lg h-fit"
            gradientColor="#F3FAFB"
            gradientOpacity={0.5}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Contract Information
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    contract.status
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {contract.status ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#136CB9] mb-2">
                    {contract.universityName}
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Representative:</span>{" "}
                    {contract.representativeName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Package:</span>{" "}
                    <span className="text-[#136CB9] font-semibold">
                      {contract.packageName}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Signed Date</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(contract.signedDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(contract.startDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(contract.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-[#136CB9] hover:bg-[#136CB9]/90 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    variant="custom"
                  >
                    <a
                      className="flex items-center gap-2"
                      href={contract.contractUrl}
                      target="_blank"
                    >
                      <span>View Contract</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </MagicCard>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <TransactionTable data={contract} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
    </div>
  );
}
