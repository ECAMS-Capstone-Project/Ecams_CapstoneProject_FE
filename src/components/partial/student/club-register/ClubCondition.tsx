import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useClubs } from "@/hooks/student/useClub";
import { ClubCondition } from "@/api/club-owner/ClubByUser";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CircleX, ImageUp, Smile } from "lucide-react";
import { ConditionEvidence } from "./JoinClubDialog";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";

interface ConditionProps {
  clubId: string;
  conditionEvidences: ConditionEvidence[];
  setConditionEvidences: React.Dispatch<
    React.SetStateAction<ConditionEvidence[]>
  >;
  setAllConditions: React.Dispatch<React.SetStateAction<ClubCondition[]>>;
}

const ClubRequirements = ({
  clubId,
  conditionEvidences,
  setConditionEvidences,
  setAllConditions,
}: ConditionProps) => {
  const { getAllConditionsQuery } = useClubs();
  const { data: conditions, isLoading } = getAllConditionsQuery(clubId);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (conditions?.data) {
      setAllConditions(conditions.data);
    }
  }, [conditions, setAllConditions]);

  const handleButtonClick = (conditionId: string) => {
    const fileInput = fileInputRefs.current[conditionId];
    if (fileInput) fileInput.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    conditionId: string,
    conditionName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setConditionEvidences((prev) => {
        const exists = prev.find((item) => item.conditionId === conditionId);
        if (exists) {
          return prev.map((item) =>
            item.conditionId === conditionId
              ? { ...item, evidenceFile: file }
              : item
          );
        } else {
          return [...prev, { conditionId, evidenceFile: file }];
        }
      });
      toast.success(`File selected for condition ${conditionName}`);
    }
  };

  const getFileNameByCondition = (conditionId: string) => {
    const found = conditionEvidences.find((c) => c.conditionId === conditionId);
    return found?.evidenceFile?.name || "";
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!conditions?.data || conditions.data.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">
          Club Requirements:
        </h3>
        <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
          <Smile className="w-8 h-8 text-blue-400" />
          <p>No requirements for this club yet!</p>
          <p className="text-sm text-gray-400">
            You can join without any conditions
          </p>
        </div>
      </div>
    );
  }

  const handleRemoveFile = (conditionId: string) => {
    setConditionEvidences((prev) =>
      prev.filter((e) => e.conditionId !== conditionId)
    );
    const input = fileInputRefs.current[conditionId];
    if (input) input.value = "";
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">
        Club Requirements:
      </h3>
      <div className="overflow-x-auto overflow-y-auto max-h-[300px] rounded-md">
        <Table className="min-w-full rounded-lg">
          <TableBody>
            {conditions?.data
              ?.sort((a, b) => (b.isRequired ? 1 : 0) - (a.isRequired ? 1 : 0))
              .map((condition: ClubCondition) => (
                <TableRow key={condition.conditionId} className="bg-white">
                  <TableCell
                    className="font-medium text-gray-600"
                    style={{ width: "180px" }}
                  >
                    {condition.conditionName}{" "}
                    {condition.isRequired ? (
                      <span className="text-red-600 align-top">*</span>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell
                    className="font-medium text-[#2e7fa7]"
                    style={{ width: "250px" }}
                  >
                    {condition.conditionContent}
                  </TableCell>
                  <TableCell
                    className="font-medium text-justify text-[#2e7fa7]"
                    style={{ width: "600px" }}
                  >
                    <DescriptionWithToggle text={condition.description} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <div className="flex items-center gap-3">
                      {getFileNameByCondition(condition.conditionId) && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black truncate max-w-[200px]">
                            Attachment file
                          </span>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleRemoveFile(condition.conditionId)
                            }
                            title="Delete file"
                          >
                            <CircleX />
                          </button>
                        </div>
                      )}
                      <div className="ml-auto">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          ref={(el) =>
                            (fileInputRefs.current[condition.conditionId] = el)
                          }
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              condition.conditionId,
                              condition.conditionName
                            )
                          }
                        />
                        <Button
                          variant="custom"
                          size="sm"
                          onClick={() =>
                            handleButtonClick(condition.conditionId)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <ImageUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClubRequirements;
