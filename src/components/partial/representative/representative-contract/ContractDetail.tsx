import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contract } from "@/models/Contract";
// import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "./TransactionTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@mui/material";
import { ContractRepresentativeById } from "@/api/representative/ContractAPI";
import useAuth from "@/hooks/useAuth";

export default function RepresentativeContractDetail() {
  const { contractId = "" } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchContractDetail() {
      if (user) {
        const response = await ContractRepresentativeById(contractId);
        console.log(response);
        setContract(response.data || null);
      }
    }
    fetchContractDetail();
  }, [contractId, user]);
  console.log(contract);
  const handleViewContract = () => {
    if (contract?.contractUrl) {
      window.open(contract.contractUrl, "_blank");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-600 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/staff/wallet-staff">
                Contracts
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Contract Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      {/* Layout 2 cột */}
      <div className="grid gap-3">
        {/* PDF Viewer */}

        <div className="grid-cols-1 md:grid-cols-1 gap-2 mr-4">
          {/* Contract Info */}
          <Card
            className="p-6 bg-white shadow-lg rounded-lg h-fit"
            style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          // gradientColor="#F3FAFB"
          // gradientOpacity={0.5}
          >
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-2">Contract Informaion</h2>
              <Button
                className="block hover:scale-105"
                variant={'outline'}
                onClick={handleViewContract}
              >
                📄 View Contract PDF
              </Button>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#136CB9]">
              {contract?.universityName || "You don't have contract info"}
            </h3>
            <p className="text-gray-600">Staff: {contract?.staffName}</p>
            <p className="text-[#136CB9] font-semibold mt-1">
              Package type: {contract?.packageName}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              📅 {String(contract?.signedDate).split("T")[0]} -{" "}
              {String(contract?.endDate).split("T")[0]}
            </p>
            <span
              className={`mt-4 inline-block px-3 py-1 rounded text-sm font-semibold ${contract?.status
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
                }`}
            >
              {contract?.status ? "Active ✅" : "Inactive ❌"}
            </span>
          </Card>
          {/* Transactions Table */}
          {contract && <TransactionTable data={contract} />}
        </div>
      </div>
    </div>
  );
}
