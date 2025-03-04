import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { CreateEventClubDialog } from "@/components/partial/representative/representative-eventclub/CreateEventClubForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import LoadingAnimation from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const EventClub = () => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //   const { getEventDetailQuery } = useEvents();
  const [loading] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getCurrentUserAPI();

        if (userInfo) {
          setUserInfo(userInfo.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);
  const handleCloseDialog = () => setIsDialogOpen(false);

  //   const { data: eventClubDetail, isLoading: isEventDetailLoading } =
  //     getEventDetailQuery(clubId);

  //   if (isEventDetailLoading) {
  //     return (
  //       <div className="flex justify-center items-center h-screen text-xl">
  //         Loading...
  //       </div>
  //     );
  //   }

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`Manage University's Event Club`}
              description={`View information about the event club of ${userInfo?.universityName}`}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <Button className="bg-gradient-to-r from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                  <Plus className="mr-1 h-4 w-4" />
                  Create Event Club
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <CreateEventClubDialog
                  initialData={null}
                  onSuccess={() => {}}
                  setOpen={handleCloseDialog}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator />

          {/* <WalletCard wallets={wallets} /> */}
        </>
      )}
    </React.Suspense>
  );
};
export default EventClub;
