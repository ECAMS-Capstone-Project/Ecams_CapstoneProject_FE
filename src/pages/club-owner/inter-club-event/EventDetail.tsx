/* eslint-disable @typescript-eslint/no-explicit-any */
import { InterClubChat } from "@/components/partial/club_owner/inter-club/InterClubChat";
import { InterClubTask } from "@/components/partial/club_owner/inter-club/InterClubTask";
import { EventDetailsCard } from "@/components/partial/club_owner/inter-club/EventDetailsCard";
import { useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useEventDetail } from "@/hooks/club/useEventDetail";
import useAuth from "@/hooks/useAuth";
import { useClubs } from "@/hooks/student/useClub";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export const EventDetailPage = () => {
  const { clubEventId } = useParams();
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const {
    getInterEventDetailQuery,
    approveInterEvent,
    isApproving,
    rejectInterEvent,
    isRejecting,
  } = useEventDetail(clubEventId || "");
  const { data: event } = getInterEventDetailQuery(clubEventId || "");
  const { user } = useAuth();
  const { clubs } = useClubs(user?.universityId, 1, 20);

  // Lấy club của user đang login
  const currentClub = clubs?.find((club) =>
    club.clubMembers?.some(
      (member) =>
        member.userId === user?.userId && member.clubRoleName === "CLUB_OWNER"
    )
  );

  // Tìm club hiện tại trong danh sách clubs của event
  const currentClubInEvent = event?.data?.clubs?.find(
    (club) => club.clubId === currentClub?.clubId
  );

  // Lấy status của club trong event
  const clubStatus = currentClubInEvent?.status;

  // Kiểm tra xem club hiện tại có phải là club tạo event không
  const isCreatorClub = !currentClubInEvent;

  const handleAccept = async () => {
    try {
      await approveInterEvent({
        eventId: event?.data?.eventId || "",
        clubId: currentClub?.clubId || "",
        reason: reason,
      });
      toast.success("Accepted event invitation successfully!");
      setIsApproveDialogOpen(false);
      setReason("");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeny = async () => {
    try {
      await rejectInterEvent({
        eventId: event?.data?.eventId || "",
        clubId: currentClub?.clubId || "",
        reason: reason,
      });
      toast.success("Denied event invitation successfully!");
      setIsRejectDialogOpen(false);
      setReason("");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // const getStatusColor = (status: InterClubEventDTO["status"]) => {
  //   switch (status) {
  //     case "WAITING":
  //       return "bg-[#136CB9]/10 text-[#136CB9] border border-[#136CB9]/20";
  //     case "ACTIVE":
  //       return "bg-[#49BBBD]/10 text-[#49BBBD] border border-[#49BBBD]/20";
  //     case "INACTIVE":
  //       return "bg-gray-100 text-gray-800 border border-gray-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border border-gray-200";
  //   }
  // };

  if (!event) return null;

  return (
    <div className="container mx-auto space-y-6 pb-8">
      {event.data && (
        <div className="space-y-6">
          <EventDetailsCard selectedEvent={event.data} />
        </div>
      )}

      {/* Hiển thị nút Accept/Deny nếu club có status PENDING */}
      {currentClubInEvent && clubStatus === "PENDING" && (
        <div className="flex gap-4 justify-end">
          <Button
            onClick={() => setIsApproveDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept Invitation
          </Button>
          <Button
            onClick={() => setIsRejectDialogOpen(true)}
            variant="destructive"
          >
            <X className="w-4 h-4 mr-2" />
            Deny Invitation
          </Button>
        </div>
      )}

      {/* Dialog Approve */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Event Invitation</DialogTitle>
            <DialogDescription>
              Please provide a reason for accepting this event invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={!reason.trim() || isApproving}
            >
              {isApproving ? "Accepting..." : "Accept"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Reject */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Event Invitation</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this event invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeny}
              variant="destructive"
              disabled={!reason.trim() || isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chỉ hiện chat và task nếu:
          1. Club là creator (không có trong danh sách clubs)
          2. Hoặc club có status ACTIVE */}
      {(isCreatorClub || clubStatus === "ACTIVE") && event.data && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#e5e7eb]">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#f8f9fa] p-1">
              <TabsTrigger
                value="chat"
                className={cn(
                  "data-[state=active]:bg-white data-[state=active]:text-[#136cb9]",
                  "data-[state=active]:shadow-sm transition-all duration-200"
                )}
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className={cn(
                  "data-[state=active]:bg-white data-[state=active]:text-[#136cb9]",
                  "data-[state=active]:shadow-sm transition-all duration-200"
                )}
              >
                Tasks
              </TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="chat" className="mt-0">
                <InterClubChat selectedEvent={event.data} />
              </TabsContent>
              <TabsContent value="tasks" className="mt-0">
                <InterClubTask selectedEvent={event.data} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};
