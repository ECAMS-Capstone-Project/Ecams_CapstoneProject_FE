/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { CreateEventClubDialog } from "@/components/partial/representative/representative-eventclub/CreateEventClubForm";
import EventClubDetail from "@/components/partial/representative/representative-eventclub/EventClubDetail";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import LoadingAnimation from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useEvents } from "@/hooks/staff/Event/useEvent";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const EventClub = () => {
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getEventClubQuery, isLoading } = useEvents();
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

  const { data: eventClub } = getEventClubQuery(
    userInfo?.universityId || "",
    1,
    2
  );
  console.log("event", eventClub?.data?.data);

  return (
    <React.Suspense fallback={<LoadingAnimation />}>
      {isLoading || !eventClub ? (
        <LoadingAnimation />
      ) : (
        <>
          <div className="flex items-center justify-between pt-4">
            <Heading
              title={`University's Event Club`}
              description={`View information about the event club of ${userInfo?.universityName}`}
            />
          </div>
          <Separator />
          {eventClub?.data?.data &&
          eventClub.data.data.find((club) => club.isEventClub) ? (
            <>
              <EventClubDetail
                club={
                  eventClub.data.data.find((club) => club.isEventClub) as any
                } // Lấy club có isEventClub = true
              />
            </>
          ) : (
            <div className="min-h-[60vh] flex justify-center items-center">
              <div className="flex flex-col items-center justify-center space-y-3 mb-11">
                <AnimatedGradientText>
                  <span
                    className={
                      "inline animate-gradient text-center bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
                    }
                  >
                    Your University have not had any event club! <br /> Let's
                    create one!
                  </span>
                </AnimatedGradientText>
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
            </div>
          )}
        </>
      )}
    </React.Suspense>
  );
};
export default EventClub;
