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

  const handleDownload = async () => {
    try {
      const response = await fetch(`${contract.contractUrl}?fl_attachment`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Chuyển dữ liệu thành Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> ẩn để tải file
      const a = document.createElement("a");
      a.href = url;
      a.download = "Contract.pdf"; // Đổi tên file nếu cần
      document.body.appendChild(a);
      a.click();

      // Xóa thẻ <a> sau khi tải
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
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
      <div className="grid mx-auto px-8 gap-3">
        {/* PDF Viewer */}

        <div className="grid-cols-1 md:grid-cols-2 gap-2">
          {/* Contract Info */}
          <MagicCard
            className="p-8 bg-white shadow-lg rounded-lg  h-fit"
            gradientColor="#F3FAFB"
            gradientOpacity={0.5}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Contract Information</h2>
                <h3 className="text-2xl font-bold text-[#136CB9]">
                  {contract.universityName}
                </h3>
                <p>Staff: {contract.representativeName}</p>
                <p className="font-semibold text-[#136CB9]">
                  Package type: {contract.packageName}
                </p>
                <p className="text-sm">
                  📅 From: {String(contract.signedDate).split("T")[0]}
                </p>
                <p className="text-sm">
                  📅 To: {String(contract.endDate).split("T")[0]}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-3 py-1 block w-fit rounded text-sm font-semibold ${
                    contract.status
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {contract.status ? "Active ✅" : "Inactive ❌"}
                </span>

                <Button
                  className="mt-4 hover:scale-105 transition duration-300 shadow-md hover:shadow-lg"
                  variant="custom"
                >
                  <a
                    // onClick={handleDownload}
                    className="text-white hover:underline"
                    href={contract.contractUrl}
                    target="_blank"
                  >
                    📄 View Contract
                  </a>
                </Button>

                <Button
                  className="mt-4 hover:scale-105 transition duration-300 shadow-md hover:shadow-lg"
                  variant="custom"
                >
                  <a
                    onClick={handleDownload}
                    className="text-white hover:underline"
                  >
                    📄 Download Contract
                  </a>
                </Button>
              </div>
            </div>
          </MagicCard>
          {/* Transactions Table */}
          <TransactionTable data={contract} />
        </div>
        {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden h-screen ">
          <iframe
            src={contract.contractUrl}
            title="Contract PDF"
            className="w-full h-full"
          />
        </div> */}
      </div>

      {/* Action Buttons */}
    </div>
  );
}
