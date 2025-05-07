// /* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas-pro"; // Import thư viện html2canvas

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@/models/Event";
import useAuth from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

interface RefundFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RefundFormData) => void;
  event: Event;
  isRefunding: boolean;
}

export interface RefundFormData {
  UserId: string;
  EventId: string;
  BankNumber: string;
  BankQR: string;
  BankName: string;
  Description: string;
  EvidenceRegistration: string | File;
}

export const RefundFormPopup: React.FC<RefundFormPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
  isRefunding,
}) => {
  const [formData, setFormData] = useState<RefundFormData>({
    UserId: "",
    EventId: "",
    BankNumber: "",
    BankQR: "",
    BankName: "",
    Description: "",
    EvidenceRegistration: "",
  });
  const [selectedMethod, setSelectedMethod] = useState<"bank" | "qr" | null>(
    "qr"
  );
  const { user } = useAuth();
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value as "bank" | "qr");
    // Reset form data when changing method
    setFormData((prev) => ({
      ...prev,
      BankNumber: "",
      BankQR: "",
      BankName: "",
      Description: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) {
      toast.error("Choose a payment method!");
      return;
    }

    if (
      selectedMethod === "bank" &&
      (!formData.BankName || !formData.BankNumber)
    ) {
      toast.error("Please fill all the required information");
      return;
    }

    if (selectedMethod === "qr" && !formData.BankQR) {
      toast.error("Please upload QR");
      return;
    }

    if (formRef.current) {
      try {
        const element = formRef.current;
        const options = {
          logging: true,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scale: 2,
          width: element.scrollWidth,
          height: element.scrollHeight,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        };

        const canvas = await html2canvas(element, options);
        const screenshot = canvas.toDataURL("image/png", 1.0);
        const blob = await fetch(screenshot).then((res) => res.blob());
        const evidenceFile = new File([blob], "screenshot.png", {
          type: "image/png",
        });

        const updatedFormData = {
          ...formData,
          EvidenceRegistration: evidenceFile,
          UserId: user?.userId ?? "",
          EventId: event.eventId,
        };

        onSubmit(updatedFormData);
      } catch (error) {
        console.error("Failed to capture screenshot:", error);
      }
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div ref={formRef}>
          <DialogHeader>
            <DialogTitle>Refund Request</DialogTitle>
            <DialogDescription>
              Choose payment method and fill all the required information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-2">
            <ScrollArea className="h-fit">
              <div className="space-y-2">
                <Label htmlFor="reason" className="font-bold text-base">
                  Event Name
                </Label>
                <p className="text-[#136CB9] font-semibold">
                  {event.eventName}
                </p>
              </div>

              <div className="space-y-4 mt-4">
                <RadioGroup
                  value={selectedMethod || ""}
                  onValueChange={handleMethodChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Information</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr">QR Link</Label>
                  </div>
                </RadioGroup>

                {selectedMethod === "bank" && (
                  <div className="space-y-4 mt-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="BankName"
                        value={formData.BankName || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="BankNumber"
                        value={formData.BankNumber || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="Description"
                        value={formData.Description || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "qr" && (
                  <div className="space-y-4 mt-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="qrCodeImage">Upload QR</Label>
                      <Input
                        id="qrCodeImage"
                        name="BankQR"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">
                {isRefunding ? "Sending" : "Send request"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
