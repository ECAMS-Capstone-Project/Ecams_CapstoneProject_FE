import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { University } from "@/models/University";
import { RequestTable } from "./RequestTable";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface UniversityProps {
  data: University[];
}

const PendingUniversityList = ({ data }: UniversityProps) => {
  const navigate = useNavigate();
  return (
    <Card className="col-span-1 lg:col-span-4 mt-5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Request</CardTitle>
          <Button
            variant="custom"
            className="w-fit"
            onClick={() => navigate("/admin/university/pending")}
          >
            View More <ArrowRight size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <RequestTable data={data} />
      </CardContent>
    </Card>
  );
};

export default PendingUniversityList;
