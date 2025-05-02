/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { GetStudentByIdAPI } from "@/api/representative/StudentAPI";
import StudentRequest from "@/models/StudentRequest";
import LoadingAnimation from "@/components/ui/loading";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleX, XCircle, FileText, Eye } from "lucide-react";
import { DenyMemberJoinClub } from "./DenialDialog";
import { ApproveOrDenyRequestJoinClub, ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export interface UserDetailDialogProps {
  initialData: ClubMemberDTO | null;
  setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
  clubId: string;
}

const MemberDetailDialog: React.FC<UserDetailDialogProps> = ({ initialData, setFlag, clubId }) => {
  const [member, setMember] = useState<StudentRequest>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      if (!initialData?.userId) return;
      try {
        setLoading(true);
        const response = await GetStudentByIdAPI(initialData.userId);
        setMember(response.data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [initialData]);
  console.log(initialData?.clubMemberId);

  const handleApprove = async () => {
    if (!initialData || !user) return;
    try {
      setLoading(true);
      await ApproveOrDenyRequestJoinClub(clubId, initialData.clubMemberId, {
        acceptedBy: user.userId,
        clubMemberId: initialData.clubMemberId,
        isAccepted: true,
        reason: "",
      });
      toast.success("Student approved successfully.");
      if (setFlag) setFlag(prev => !prev);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isImageFile = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const isDocFile = (url: string) => {
    const docExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    return docExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="p-6 max-h-[920px] overflow-y-auto bg-white">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-24 h-24 ">
              <AvatarImage
                src={member?.imageUrl || "https://github.com/shadcn.png"}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </Avatar>
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-900">{member?.fullname}</h2>
              <p className="text-sm text-gray-500">{member?.email}</p>
            </div>
          </div>


          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Student ID", member?.studentId],
              ["Gender", member?.gender],
              ["Major", member?.major],
              ["Academic Year", member?.yearOfStudy],
            ].map(([label, value], i) => (
              <div key={i}>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-base font-semibold">{value || "—"}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              The reason for joining the club
            </h3>
            <div className="bg-blue-50 border-l-4 max-h-[130px] overflow-y-auto border-blue-400 rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed">
              <span className=" text-base text-justify italic">
                <DescriptionWithToggle text={initialData?.reason || ""} />
              </span>
            </div>
          </div>

          <div className="border-t pt-3">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Condition Evidence
            </h3>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
              {initialData?.conditionEvidences?.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-sm flex items-start gap-5 bg-gray-50"
                >
                  {isImageFile(item.evidenceLink) ? (
                    <img
                      src={item.evidenceLink}
                      alt={item.conditionName}
                      onClick={() => {
                        setPreviewImage(item.evidenceLink);
                      }}
                      className="w-28 h-28 object-cover rounded-lg border cursor-pointer"
                    />
                  ) : (
                    <div 
                      className="w-28 h-28 flex flex-col items-center justify-center gap-2 bg-gray-100 rounded-lg border cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        if (isPdfFile(item.evidenceLink) || isDocFile(item.evidenceLink)) {
                          window.open(item.evidenceLink, '_blank');
                        }
                      }}
                    >
                      <FileText className="w-8 h-8 text-gray-600" />
                      <span className="text-xs text-gray-600 text-center px-2">
                        {isPdfFile(item.evidenceLink) ? 'PDF File' : 'Document File'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.evidenceLink, '_blank');
                        }}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="font-semibold text-base">{item.conditionName}</p>
                    <p className="text-sm">{item.conditionContent}</p>
                    <p className="text-xs italic text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="w-32 bg-green-100 text-green-800 hover:bg-green-200"
            >
              <CheckCircle2 size={18} className="mr-2" /> Approve
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-32 bg-red-100 text-red-800 hover:bg-red-200"
            >
              <XCircle size={18} className="mr-2" /> Reject
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {initialData && (
              <DenyMemberJoinClub
                clubId={clubId}
                memberId={initialData.clubMemberId}
                onClose={() => setIsDialogOpen(false)}
                setFlag={setFlag}
                open={isDialogOpen}
              />
            )}
          </Dialog>
          {previewImage && isImageFile(previewImage) && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
              onClick={() => setPreviewImage(null)}
            >
              <div className="relative max-w-[90%] max-h-[90%]">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg shadow-xl transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: previewImage.endsWith('.png') ? 'transparent' : 'none',
                  }}
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 bg-white text-black rounded-full p-2 hover:bg-gray-300 transition-all duration-150"
                >
                  <CircleX className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default MemberDetailDialog;
