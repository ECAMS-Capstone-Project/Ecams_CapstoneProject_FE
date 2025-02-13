import { Policy } from "@/models/Policy";
import { PolicyRegisterTable } from "./PolicyRegisterTable";

interface PolicyProps {
  data: Policy[];
  type: string
}
function StudentStaffPolicies({ data, type }: PolicyProps) {
  const staffPolicies = data.filter((policy) =>
    policy.roleName.includes("STAFF")
  );
  const studentPolicies = data.filter((policy) =>
    policy.roleName.includes("STUDENT")
  );
  return (
    <div >
      {type.toLowerCase() == 'student' && (
        <PolicyRegisterTable data={studentPolicies} />
      )}
      {type.toLowerCase() == 'staff' && (
        <PolicyRegisterTable data={staffPolicies} />
      )}
    </div>
  );
}

export default StudentStaffPolicies;
