import { EventClubDTO } from "@/api/representative/EventAgent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit2Icon, EyeIcon, Mail, Phone } from "lucide-react";
import MemberTable from "./MemberList";
import { format } from "date-fns";

interface EventClubProps {
  club: EventClubDTO;
}

const EventClubDetail = ({ club }: EventClubProps) => {
  return (
    <div className="max-w-4xl mx-auto p-7 mt-1">
      <Card className="overflow-hidden shadow-lg rounded-xl">
        <CardHeader className="flex items-center space-x-4 bg-gradient-to-br from-[#197dd4] to-[#49BBBD] p-4">
          <img
            src={club?.logoUrl}
            alt="Club Logo"
            className="w-20 h-20 rounded-full border-2 border-white object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{club?.clubName}</h2>
            {/* <p className="text-sm text-white">{club?.contactEmail}</p> */}
          </div>
        </CardHeader>
        <div className="flex justify-start px-8 mt-3">
          <Dialog>
            <DialogTrigger>
              <Button className="bg-gradient-to-bl from-[#136CB9] to-[#49BBBD] shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
                <Edit2Icon className="mr-1 h-4 w-4" />
                Change Club's Leader
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              {/* <CreateEventClubDialog
                initialData={null}
                onSuccess={() => {}}
                setOpen={handleCloseDialog}
              /> */}
            </DialogContent>
          </Dialog>
        </div>
        <CardContent className="px-8 py-7  bg-white ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-start space-x-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  Members{" "}
                </h3>
                <div>
                  <Dialog>
                    <DialogTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="h-fit mt-2">
                              <EyeIcon size={19} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gradient-to-bl from-[#2a92ed] to-[#49BBBD]">
                            <p>View members</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <MemberTable members={club?.clubMembers || []} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              {club?.clubMembers &&
                club.clubMembers.filter(
                  (member) => member.clubRoleName === "CLUB_OWNER"
                ).length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {club.clubMembers
                    .filter((member) => member.clubRoleName === "CLUB_OWNER")
                    .map((member, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.fullname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-500">
                              <span className="text-white text-lg font-medium">
                                {member.fullname.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {member.fullname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.clubRoleName}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="mt-2 text-gray-600">No members yet</p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Founded Date
              </h3>
              <p className="mt-2 text-gray-600">
                {format(new Date(club?.foundingDate), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold text-gray-800">Description</h3>
            <p className="mt-2 text-gray-600">{club?.description}</p>
          </div>
          <div className="mt-5">
            <h3 className="text-xl font-semibold text-gray-800">Purpose</h3>
            <p className="mt-2 text-gray-600">{club?.purpose}</p>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-wrap gap-3 justify-end p-4 w-full">
          <Button
            variant="outline"
            className="transition-colors duration-200 hover:bg-blue-100"
            onClick={() => alert("Send email")}
          >
            <Mail size={14} />
            Contact Email: {club?.contactEmail || "Have yet to"}
          </Button>
          <Button
            variant="outline"
            className="transition-colors duration-200 hover:bg-blue-100"
            onClick={() => alert("Call phone")}
          >
            <Phone size={14} />
            Contact Phone: {club?.contactPhone || "Have yet to"}
          </Button>
          <Button
            variant="outline"
            className="transition-colors duration-200 hover:bg-blue-100"
            onClick={() => window.open(club?.websiteUrl || "#", "_blank")}
          >
            Visit Website
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventClubDetail;
