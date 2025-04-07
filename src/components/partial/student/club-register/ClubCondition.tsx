import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useClubs } from "@/hooks/student/useClub";
import { ClubCondition } from "@/api/club-owner/ClubByUser";

interface ConditionProps {
  clubId: string;
}

const ClubRequirements = ({ clubId }: ConditionProps) => {
  const { getAllConditionsQuery } = useClubs();
  const { data: conditions, isLoading } = getAllConditionsQuery(clubId);

  if (isLoading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">
        Club Requirements:
      </h3>
      <div className="overflow-x-auto overflow-y-auto max-h-[300px] rounded-md">
        <Table className="min-w-full rounded-lg ">
          <TableBody className="rounded-lg">
            {conditions?.data?.map((condition: ClubCondition) => (
              <TableRow
                key={condition.conditionId}
                className="bg-white rounded-lg p-1"
              >
                <TableCell className="font-medium text-gray-600">
                  {condition.conditionName}
                </TableCell>
                <TableCell className="font-medium text-[#2e7fa7]">
                  {condition.conditionContent}
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
