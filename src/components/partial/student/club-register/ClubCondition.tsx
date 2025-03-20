import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ClubRequirements = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">
        Club Requirements:
      </h3>
      <div className="overflow-x-auto overflow-y-auto rounded-md">
        <Table className="min-w-full rounded-lg">
          <TableBody className="rounded-lg">
            <TableRow className="bg-white rounded-lg">
              <TableCell className="font-medium text-gray-600">
                Required Skill Level
              </TableCell>
              <TableCell className="font-medium text-blue-700">
                Intermediate
              </TableCell>
              <TableCell className="font-medium text-center">
                <div className="flex justify-center items-center">
                  <Checkbox />
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white rounded-lg">
              <TableCell className="font-medium text-gray-600">
                Registration Period
              </TableCell>
              <TableCell className="font-medium text-blue-700">
                2024-01-01 - 2024-12-31
              </TableCell>
              <TableCell className="font-medium text-center">
                <div className="flex justify-center items-center">
                  <Checkbox />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClubRequirements;
