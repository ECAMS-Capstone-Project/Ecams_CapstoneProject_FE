import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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
import { Card, Grid2 } from "@mui/material";
import { ContractRepresentativeById } from "@/api/representative/ContractAPI";
import useAuth from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { PackageDetail } from "@/models/Package";

export default function RepresentativeContractDetail() {
  const { contractId = "" } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  const details = location.state.rowData.details as PackageDetail[] || [];
  console.log(location.state.rowData.details);

  useEffect(() => {
    async function fetchContractDetail() {
      if (user) {
        const response = await ContractRepresentativeById(contractId);
        setContract(response.data || null);
      }
    }
    fetchContractDetail();
  }, [contractId, user]);
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
              <BreadcrumbLink href="/representative/wallet-representative">
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
              <h2 className="text-2xl font-bold mb-2"><Button onClick={() => window.history.back()} variant="link" className="p-0 mr-4"><ArrowLeft /></Button>Contract Informaion</h2>
              <Button
                className="block hover:scale-105"
                variant={'outline'}
                onClick={handleViewContract}
              >
                📄 View Contract PDF
              </Button>
            </div>
            <Grid2 container spacing={3} sx={{ width: "100%" }}>
              <Grid2 size={{ xs: 12, md: 6 }} boxShadow={1} p={2}>
                <h3 className="text-2xl text-center font-bold mb-2 text-[#136CB9]">
                  University: {contract?.universityName || "You don't have contract info"}
                </h3>
                <Grid2 container spacing={3} sx={{ width: "100%", mt: 2 }}>
                  <Grid2 size={{ xs: 12, md: 6 }} >
                    <p className="text-gray-600 font-semibold mt-2">
                      🔸 Representative: {contract?.representativeName}
                    </p>
                    <p className="text-gray-600 font-semibold mt-2">
                      📦 Package name: {contract?.packageName}
                    </p>
                    <p className="text-gray-600 font-semibold mt-2">
                      🔹 Contract status:  <span
                        className={`inline-block px-3 py-1 rounded text-sm font-semibold ${contract?.status
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {contract?.status ? "Active ✅" : "Inactive ❌"}
                      </span>
                    </p>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }} >
                    <p className="text-gray-600 font-semibold mt-2">
                      📅 Date sign: {String(contract?.signedDate).split("T")[0]} -{" "}
                    </p>
                    <p className="text-gray-600 font-semibold mt-2">
                      📅 Date end: {String(contract?.endDate).split("T")[0]}
                    </p>
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }} boxShadow={1} p={2}>
                <h3 className="text-2xl font-bold mb-2 text-[#136CB9] text-center">
                  Package Detail
                </h3>
                <div className="mt-3">
                  <ul className="flex gap-2">
                    {details && details.map((detail, index) => (
                      <li key={index + 1} className="flex w-1/3 items-center space-x-2 p-2 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300">
                        <span className="text-lg font-semibold text-blue-600">Max {detail.packageType}: </span>
                        <span className="text-sm text-gray-500 mt-0.5">{detail.value} </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Grid2>

            </Grid2>
          </Card>
          {/* Transactions Table */}
          {contract && <TransactionTable data={contract} />}
        </div>
      </div>
    </div>
  );
}
