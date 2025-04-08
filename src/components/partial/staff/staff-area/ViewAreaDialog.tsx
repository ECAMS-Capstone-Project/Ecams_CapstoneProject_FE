import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogLoading from "@/components/ui/dialog-loading";
import { useEffect, useState } from "react";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { Button } from "@/components/ui/button";

interface AreaDialogProps {
  initialData: {
    universityId?: string;
    name?: string;
    description?: string;
    capacity?: number;
    imageUrl?: string;
    status?: boolean;
  } | null;
  setOpen?: (open: boolean) => void;
}

export const ViewAreaDialog: React.FC<AreaDialogProps> = ({ initialData }) => {
  const [, setUserInfo] = useState<UserAuthDTO>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialData) {
      fetchUserInfo();
    }
  }, [initialData]);

  return (
    <div className="min-h-[200px] sm:min-h-[300px] h-auto sm:min-w-[300px]">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <DialogLoading />
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>View Area</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {initialData ? "Viewing area details below." : "No data available."}
          </DialogDescription>
          <div className="p-4 space-y-4 bg-gray-50 rounded-lg mt-3">
            {initialData && (
              <div className="space-y-4">
                {initialData.imageUrl && (
                  <img
                    src={String(initialData.imageUrl)}
                    alt="Area Image"
                    className="w-full h-64 object-contain rounded-md shadow-lg"
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-700 font-semibold mr-1">
                      Name:
                    </span>
                    <span className="text-gray-900">
                      {initialData.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-semibold mr-1">
                      Capacity:
                    </span>
                    <span className="text-gray-900">
                      {initialData.capacity || "N/A"} people
                    </span>
                  </div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span className="text-gray-700 font-semibold">Status:</span>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-md w-fit ${
                      initialData.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {initialData.status ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="w-full">
                  <p className="text-gray-700 font-semibold">Description:</p>
                  <p className="text-gray-900">
                    {initialData.description || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full justify-end mt-4">
            <DialogClose>
              <Button variant="custom">Close</Button>
            </DialogClose>
          </div>
        </>
      )}
    </div>
  );
};
