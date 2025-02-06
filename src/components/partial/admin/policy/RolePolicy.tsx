import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Policy } from "@/models/Policy";
import { RolePolicyTable } from "./RolePolicyDialog";

interface PolicyProps {
  data: Policy[];
}
function RolePolicy({ data }: PolicyProps) {
  const staffPolicies = data.filter((policy) =>
    policy.roleName.includes("STAFF")
  );
  const clubPolicies = data.filter((policy) =>
    policy.roleName.includes("CLUB_OWNER")
  );
  const studentPolicies = data.filter((policy) =>
    policy.roleName.includes("STUDENT")
  );
  return (
    <div className="flex justify-center items-center gap-3 mt-6">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Staff</CardTitle>
          <CardDescription>University's Staff</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Dialog>
            <DialogTrigger className="w-full">
              <Button className="w-full" variant="custom">
                View staff's policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <RolePolicyTable data={staffPolicies} />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Club</CardTitle>
          <CardDescription>University's Club</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Dialog>
            <DialogTrigger className="w-full">
              <Button className="w-full" variant="custom">
                View club's policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <RolePolicyTable data={clubPolicies} />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Student</CardTitle>
          <CardDescription>University's Student</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Dialog>
            <DialogTrigger className="w-full">
              <Button className="w-full" variant="custom">
                View student's policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <RolePolicyTable data={studentPolicies} />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RolePolicy;
