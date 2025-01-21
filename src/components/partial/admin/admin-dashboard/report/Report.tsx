import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Report } from "@/models/Report";
import { ReportTable } from "./ReportTable";

interface ReportProps {
  data: Report[];
}

const ReportList = ({ data }: ReportProps) => {
  return (
    <Card className="col-span-1 lg:col-span-4 mt-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Report</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ReportTable data={data} />
      </CardContent>
    </Card>
  );
};

export default ReportList;
