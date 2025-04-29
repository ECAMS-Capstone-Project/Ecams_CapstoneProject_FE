import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, ClipboardList, User, BadgeDollarSign } from "lucide-react";
import { format } from "date-fns";
import { InterClub } from "@/models/Event";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useClubs } from "@/hooks/student/useClub";
import { DescriptionWithToggle } from "@/lib/DescriptionWithToggle";

interface EventItemProps {
    imageUrl: string;
    eventName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    numOfParticipants: number;
    status: string;
    numberOfTasks: number;
    price: number;
    clubEventId: string;
    clubs2: InterClub[];
    eventId: string;
}

const statusColor: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: "bg-green-100", text: "text-green-700" },
    INACTIVE: { bg: "bg-gray-100", text: "text-gray-700" },
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-700" },
    WAITING: { bg: "bg-blue-100", text: "text-blue-700" },
    ENDED: { bg: "bg-red-100", text: "text-red-700" },
    COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700" },
    CANCELLED: { bg: "bg-rose-100", text: "text-rose-700" },
};

const getStatusColor = (status: string) => {
    const defaultColor = { bg: "bg-gray-100", text: "text-gray-700" };
    return statusColor[status] || defaultColor;
};

export function EventItemOverView({
    imageUrl,
    eventName,
    description,
    startDate,
    endDate,
    numOfParticipants,
    status,
    numberOfTasks,
    price,
    clubEventId,
    clubs2,
    eventId
}: EventItemProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { clubs } = useClubs(user?.universityId, 1, 20);
    const statusStyle = getStatusColor(status);

    const isClubOwner = () => {
        if (!user || !clubs) return false;

        // Find club where user is CLUB_OWNER
        const userClub = clubs.find(club =>
            club.clubMembers?.some(
                member => member.userId === user.userId && member.clubRoleName === "CLUB_OWNER" && member.status == "ACTIVE"
            )
        );

        if (!userClub) return false;

        // Check if this club is in clubs2 array
        return clubs2.some(club => club.clubId === userClub.clubId);
    };

    const getUserClubId = () => {
        if (!user || !clubs) return clubs2[0].clubId;

        // Find the first club where user is a member
        const userClub = clubs.find(club =>
            club.clubMembers?.some(
                member => member.userId === user.userId && member.status === "ACTIVE"
            )
        );

        if (!userClub) return clubs2[0].clubId;

        // Check if this club is in clubs2 array
        const clubInEvent = clubs2.find(club => club.clubId === userClub.clubId);
        return clubInEvent ? clubInEvent.clubId : clubs2[0].clubId;
    };

    const canManage = isClubOwner();

    return (
        <Card
            className="group relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl rounded-2xl"
            onClick={() => {
                if (clubs2.length === 1) {
                    navigate(`/club/event-task/${eventId}`, {
                        state: {
                            isClubOwner: canManage,
                            clubId: clubs2[0].clubId,
                            clubEventId: clubEventId,
                        },
                    });
                } else {
                    if (canManage) {
                        navigate(`/club/inter-club-event/${clubEventId}`);
                    } else {
                        navigate(`/club/event-task/${eventId}`, {
                            state: {
                                isClubOwner: false,
                                clubId: getUserClubId(),
                                clubEventId: clubEventId,
                            },
                        });
                    }
                }
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#136CB5]/5 to-[#49BBBD]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center justify-between p-6 gap-4">
                <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0 self-center">
                        <img
                            src={imageUrl}
                            alt={eventName}
                            className="w-24 h-24 rounded-2xl object-cover shadow-md"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent">
                                {eventName}
                            </h3>
                            <Badge className={`${statusStyle.bg} ${statusStyle.text} text-sm rounded-md px-3 py-1 font-medium`}>
                                {status}
                            </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground text-justify">
                            <DescriptionWithToggle text={description} />
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                                <Calendar className="h-4 w-4 text-[#136cb9]" />
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">
                                        {format(startDate, "MMM d, yyyy")} - {" "}
                                        {format(endDate, "MMM d, yyyy")}
                                    </span>
                                    <span className="text-xs text-center text-gray-500">
                                        {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                                <User className="h-4 w-4 text-[#136cb9]" />
                                <span className="text-sm text-muted-foreground">
                                    {numOfParticipants} people
                                </span>
                            </div>

                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                                <BadgeDollarSign className="h-4 w-4 text-[#136cb9]" />
                                <span className="text-sm text-muted-foreground">
                                    {price === 0
                                        ? "Free"
                                        : `${price.toLocaleString()} VND`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-sm px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-[#136cb9]" />
                        {numberOfTasks} tasks remaining
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#136cb9] transition-colors" />
                </div>
            </div>
        </Card>
    );
}
