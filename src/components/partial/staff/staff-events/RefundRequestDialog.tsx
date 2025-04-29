import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleX, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Event, EventRefundDTO } from "@/models/Event";
import { useEventSchedule } from "@/hooks/student/useEventRegister";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RefundRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: EventRefundDTO | null;
  onUploadBill: (file: File) => void;
  event: Event;
}

export const RefundRequestDialog: React.FC<RefundRequestDialogProps> = ({
  isOpen,
  onClose,
  request,
  onUploadBill,
  event,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { getRefundDetail } = useEventSchedule();
  const refundRequest = getRefundDetail(request?.refundId ?? "");
  const refund = refundRequest.data?.data;
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFile && request) {
      onUploadBill(selectedFile);
      setSelectedFile(null);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Refund Request Details
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Review and manage refund request information
          </DialogDescription>
        </DialogHeader>
        {refund ? (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-[#136CB9]/10 to-[#49BBBD]/10 p-3 rounded-lg border border-[#136CB9]/20">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Event Name</p>
                      <p className="font-medium">{event.eventName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="font-medium">{refund?.fullname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">
                        {event.price.toLocaleString()} VND
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          // Sử dụng màu xám cho trạng thái NOT_YET
                          request.refundStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800" // Sử dụng màu vàng cho trạng thái PENDING
                            : request.refundStatus === "REFUNDED"
                            ? "bg-green-100 text-green-800" // Sử dụng màu xanh lá cho trạng thái REFUNDED
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.refundStatus}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bank Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="font-medium">{refund?.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-medium">{refund?.bankNumber}</p>
                  </div>
                </div>
              </div>

              {refund?.bankQR && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">QR Code</h3>
                    <div className="flex justify-center">
                      <img
                        src={refund?.bankQR}
                        onClick={() => setPreviewImage(refund.bankQR)}
                        alt="QR Code"
                        className="w-48 h-48 object-contain border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </>
              )}
              <div>
                <h3 className="text-lg font-semibold">Evidence</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div className="space-y-4 flex flex-col items-center">
                    <h4 className="text-lg font-semibold">Registration</h4>
                    <div className="flex justify-center">
                      <img
                        src={refund?.evidenceRegistration}
                        onClick={() =>
                          setPreviewImage(refund.evidenceRegistration)
                        }
                        alt="QR Code"
                        className="w-48 h-48 object-contain border rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 flex flex-col items-center">
                    {refund.evidenceRefund && (
                      <>
                        <h4 className="text-lg font-semibold">Refund</h4>
                        <div className="flex justify-center">
                          <img
                            src={refund?.evidenceRefund}
                            onClick={() =>
                              setPreviewImage(refund.evidenceRefund)
                            }
                            alt="QR Code"
                            className="w-48 h-48 object-contain border rounded-lg p-2"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {refund?.status.toLowerCase() === "pending" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Upload Payment Bill
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label
                            htmlFor="bill"
                            className="text-sm text-gray-500"
                          >
                            Payment Bill
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="bill"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="mt-1"
                            />
                            <Button
                              onClick={handleUploadSubmit}
                              disabled={!selectedFile}
                              variant={"custom"}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                      {selectedFile && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <X
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => setSelectedFile(null)}
                          />
                          <span>{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
            <img
              src="https://img.freepik.com/premium-vector/man-tourist-request-special-accommodations-services-discover-new-horizon-travel-tourism-start-adventure-concept_48369-46279.jpg?w=2000"
              alt="No sub-tasks"
              className="w-2/5 mb-4 opacity-90"
            />
            <h3 className="text-2xl font-semibold text-[#136CB5] mb-2">
              There is no request yet!
            </h3>
            <p className="text-sm max-w-md text-gray-500">
              Currently, the student has not requested to be refunded yet. Check
              back later! 💡
            </p>
          </div>
        )}
        {previewImage && (
          <div
            className="space-y-0 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 max-h-full overflow-auto"
            onClick={() => setPreviewImage(null)}
            style={{ opacity: previewImage ? 1 : 0 }}
          >
            <div className="relative max-w-[90%] max-h-[90%] overflow-hidden rounded-lg shadow-lg p-4 bg-white">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg shadow-xl transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: previewImage.endsWith(".png")
                    ? "transparent"
                    : "none",
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn không cho sự kiện click trên nút đóng ảnh tràn ra ngoài
                  setPreviewImage(null);
                }}
                className="absolute top-4 right-4 bg-white text-black rounded-full p-2 hover:bg-gray-300 transition-all duration-150"
              >
                <CircleX className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
