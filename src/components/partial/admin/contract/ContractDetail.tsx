import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function ContractDetail() {
  const { contractId = "" } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);

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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-3">
        {/* PDF Viewer */}

        <div className="grid-cols-1 md:grid-cols-2 gap-2">
          {/* Contract Info */}
          <MagicCard
            className="p-6 bg-white shadow-lg rounded-lg  h-fit"
            gradientColor="#F3FAFB"
            gradientOpacity={0.5}
          >
            <h2 className="text-2xl font-bold mb-2">Contract Informaion</h2>
            <h3 className="text-2xl font-bold mb-2 text-[#136CB9]">
              {contract.universityName}
            </h3>
            <p className="text-gray-600">Staff: {contract.staffName}</p>
            <p className="text-[#136CB9] font-semibold mt-1">
              Package type: {contract.packageName}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              📅 {String(contract.signedDate).split("T")[0]} -{" "}
              {String(contract.endDate).split("T")[0]}
            </p>
            <span
              className={`mt-2 inline-block px-3 py-1 rounded text-sm font-semibold ${
                contract.status
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {contract.status ? "Active ✅" : "Inactive ❌"}
            </span>
            <Button className="block mt-4 hover:scale-105" variant="custom">
              <a
                href={contract.contractUrl}
                target="_blank"
                className=" block text-white hover:underline"
              >
                📄 Download Contract
              </a>
            </Button>
          </MagicCard>
          {/* Transactions Table */}
          <TransactionTable data={contract} />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden h-screen ">
          <iframe
            src={contract.contractUrl}
            title="Contract PDF"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
    </div>
  );
}
