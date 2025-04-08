import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Ellipsis, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { ChangeClubOwnerAPI, ClubMemberDTO, EditClubAPI, GetMemberInClubsByStatusAPI, LeaveClubAPI } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClubResponse } from "@/models/Club";

interface props {
  isClubOwner: boolean;
  clubId: string
  clubOwnerId: string | undefined
  club: ClubResponse | null
}

const clubSchema = z.object({
  description: z.string().min(5, "Description is required"),
  purpose: z.string().min(5, "Purpose is required"),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().min(5, "Phone is required"),
  websiteUrl: z.string().url("Invalid URL"),
  logo: z.instanceof(File).optional(),
});

export type ClubFormData = z.infer<typeof clubSchema>;

export function PopoverClub({ isClubOwner, clubId, clubOwnerId, club }: props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      description: club?.description || "",
      purpose: club?.purpose || "",
      contactEmail: club?.contactEmail || "",
      contactPhone: club?.contactPhone || "",
      websiteUrl: club?.websiteUrl || "",
      logo: undefined,
    },
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [members, setMembers] = useState<ClubMemberDTO[]>([]);
  const [selectedMember, setSelectedMember] = useState<ClubMemberDTO | null>();
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const handleLeaveClub = () => {
    setOpenLeaveDialog(true)
  };

  useEffect(() => {
    if (openEditDialog) {
      reset({
        description: club?.description || "",
        purpose: club?.purpose || "",
        contactEmail: club?.contactEmail || "",
        contactPhone: club?.contactPhone || "",
        websiteUrl: club?.websiteUrl || "",
        logo: undefined,
      });
    }
  }, [openEditDialog, club, reset]);

  const handleChangeClubOwner = () => {
    setOpenRequestDialog(true)
  };

  async function handleLeave(event: React.FormEvent) {
    event.preventDefault();

    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }
    if (!user) return;

    try {
      setIsLoading(true);
      await LeaveClubAPI(clubId, user.userId, { reason });
      toast.success("Leave club successfully.");
      setOpenLeaveDialog(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequest(event: React.FormEvent) {
    event.preventDefault();
    if (clubOwnerId == undefined || !clubOwnerId) return
    if (!selectedMember) {
      toast.error('Please select a new club owner from the list.');
    }
    try {
      setIsLoading(true);
      await ChangeClubOwnerAPI(clubId, clubOwnerId, { leaveReason: reason, requestedMemberId: selectedMember!.userId });
      toast.success("Request to change successfully.");
      setOpenRequestDialog(false)
      setSelectedMember(null)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Gọi API danh sách member theo searchQuery
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const response = await GetMemberInClubsByStatusAPI(clubId, 1000, 1, "ACTIVE");
        setMembers((response.data?.data || []).filter(
          (member) => member.clubRoleName != "CLUB_OWNER"
        ));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [clubId]);

  const onSubmit = async (data: ClubFormData) => {
    console.log("ấn nè")
    const formData = new FormData();
    formData.append("ClubId", clubId);
    formData.append("Description", data.description);
    formData.append("Purpose", data.purpose);
    formData.append("ContactEmail", data.contactEmail);
    formData.append("ContactPhone", data.contactPhone);
    formData.append("WebsiteUrl", data.websiteUrl);
    if (data.logo) formData.append("LogoUrl", data.logo);

    try {
      await EditClubAPI(formData)
      toast.success("Updated club successfully!");
      setOpenEditDialog(false);
    } catch (err) {
      toast.error("Failed to update club.");
      console.error(err);
    }
  };


  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-2">
            {isClubOwner && (
              <>
                <button
                  onClick={() => setOpenEditDialog(true)}
                  className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
                >
                  Edit Club
                </button>
                <button
                  onClick={handleChangeClubOwner}
                  className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
                >
                  Request change club owner
                </button>
              </>
            )}
            {!isClubOwner && (
              <button
                onClick={handleLeaveClub}
                className="px-4 py-2 text-left hover:bg-gray-100 rounded-md w-full"
              >
                Leave Club
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Dialog hiển thị khi bấm "Edit Club" */}
      <Dialog open={openEditDialog} onOpenChange={(open) => {
        if (!open) setOpenEditDialog(false);
      }}>
        <DialogContent className="max-w-lg" onInteractOutside={(e) => e.preventDefault()} >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Edit Club</h3>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Input {...register("description")} />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Purpose</Label>
              <Input {...register("purpose")} />
              {errors.purpose && (
                <p className="text-sm text-red-500">{errors.purpose.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Contact Email</Label>
              <Input type="email" {...register("contactEmail")} />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Contact Phone</Label>
              <Input {...register("contactPhone")} />
              {errors.contactPhone && (
                <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Website URL</Label>
              <Input {...register("websiteUrl")} />
              {errors.websiteUrl && (
                <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setValue("logo", e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      <Dialog open={openLeaveDialog} onOpenChange={setOpenLeaveDialog}>
        <DialogContent className="max-w-lg">
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <h2 className="text-lg font-semibold">Leave Club</h2>
              <DialogDescription>
                Providing a reason for this action.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLeave}>
              <div className="flex flex-col gap-4 mb-4">
                <label className="text-lg font-semibold text-gray-800 mb-2">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-4 text-gray-700 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your reason why you want to leave this club"
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading} color="primary">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openRequestDialog} onOpenChange={setOpenRequestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Request change new club owner</h2>
          </DialogHeader>
          <DialogDescription>
            <h2 className="text-lg font-semibold text-black">Information</h2>
            Your current club owner's information is below
          </DialogDescription>

          {/* Thông tin chủ hiện tại */}
          <div className="flex items-center gap-4  p-4 border border-gray-200 rounded-md">
            <img
              src={user?.avatar || 'https://github.com/shadcn.png'}
              alt="Club Owner"
              className="h-12 w-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {user?.fullname || 'John Doe'}
              </p>
              <p className="text-gray-600">
                {user?.email || 'john.doe@example.com'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-1">
            <label className="text-lg font-semibold text-gray-800">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-4 text-gray-700"
              placeholder="Enter your reason why you want to leave this club"
              rows={2}
            />
          </div>
          <div className="mb-2 mt-1 ">
            <h2 className="text-lg font-semibold">Recommendation</h2>
            <DialogDescription className="mb-0">
              Search and select a new member to become the club owner.
            </DialogDescription>
          </div>
          <div className="max-w-xs">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {selectedMember ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedMember.avatar || 'https://github.com/shadcn.png'}
                        alt={selectedMember.fullname || 'Member'}
                        className="h-8 w-8 rounded-full"
                      />
                      <span>{selectedMember.fullname}</span>
                    </div>
                  ) : (
                    "Choose Recommend Member"
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-72 p-0" forceMount>
                <Command>
                  <CommandInput
                    placeholder="Search New Member"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="pl-10"
                  />
                  <div
                    className="max-h-32 overflow-y-auto"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <CommandList>
                      {isLoadingMembers ? (
                        <CommandEmpty>Loading...</CommandEmpty>
                      ) : members.length === 0 ? (
                        <CommandEmpty>No members found.</CommandEmpty>
                      ) : (
                        members.map((member) => (
                          <CommandItem
                            key={member.clubMemberId}
                            onSelect={() => {
                              setSelectedMember(member);
                            }}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={member.avatar || 'https://github.com/shadcn.png'}
                              alt={member.fullname || 'Member'}
                              className="h-8 w-8 rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {member.fullname}
                              </p>
                              <p className="text-gray-600 text-sm">{member.email}</p>
                            </div>
                          </CommandItem>
                        ))
                      )}
                    </CommandList>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleRequest} disabled={!selectedMember} color="primary">
              Request Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
