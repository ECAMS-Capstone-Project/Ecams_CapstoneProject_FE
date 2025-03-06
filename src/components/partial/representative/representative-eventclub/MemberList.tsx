// MemberTable.tsx
import { ClubMemberDTO } from "@/api/club-owner/ClubByUser";
import React from "react";

interface MemberTableProps {
  members: ClubMemberDTO[];
}

const MemberTable: React.FC<MemberTableProps> = ({ members }) => {
  return (
    <div className="p-2">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border-collapse rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Avatar</th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Club Role</th>
              <th className="p-3 text-left">Student ID</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={member.userId || index}
                className="border-b last:border-none"
              >
                <td className="p-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.fullname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 text-white font-medium">
                      {member.fullname?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="p-3">{member.fullname}</td>
                <td className="p-3">{member.email}</td>
                <td className="p-3">{member.clubRoleName}</td>
                <td className="p-3">{member.studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
