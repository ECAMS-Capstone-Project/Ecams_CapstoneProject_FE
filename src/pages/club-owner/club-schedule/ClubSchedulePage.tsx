/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { Button } from "@/components/ui/button";
import CreateClubScheduleDialog from "@/components/partial/club_owner/club-schedule/CreateClubScheduleDialog";
import toast from "react-hot-toast";
import { ClubSchedule, CreateClubScheduleAPI, GetScheduleClubAPI, ScheduleRequest } from "@/api/representative/StudentAPI";

const dayMap: Record<string, string> = {
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Webnesday: "WE",
    Thursday: "TH",
    Thurday: "TH",
    Friday: "FR",
    Saturday: "SA",
    Sunday: "SU",
    monday: "MO",
    tuesday: "TU",
    wednesday: "WE",
    webnesday: "WE",
    thursday: "TH",
    friday: "FR",
    saturday: "SA",
    sunday: "SU",
};

function getFirstWeekdayFromStart(startDateStr: string, dayOfWeek: string): string {
    const dayCode = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const targetDay = dayCode.indexOf(dayMap[dayOfWeek]);
    if (targetDay === -1) return startDateStr;

    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return "2025-01-01";

    const startDay = start.getDay();
    const diff = (targetDay - startDay + 7) % 7;
    start.setDate(start.getDate() + diff);

    return start.toISOString().split("T")[0];
}

interface props {
    clubId: string;
}

const ClubSchedulePage: React.FC<props> = ({ clubId }: props) => {
    const [schedules, setSchedules] = useState<ClubSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [flag, setFlag] = useState<boolean>(false);

    useEffect(() => {
        async function fetchSchedules() {
            const response = await GetScheduleClubAPI(clubId);
            setSchedules(response.data?.data || []);
            setLoading(false);
        }
        fetchSchedules();
    }, [flag, clubId]);

    const calendarEvents = schedules
        .filter((sch) => sch.status)
        .map((sch) => {
            const weekdayAbbrev = dayMap[sch.dayOfWeek] || "MO";
            const dtStartDate = getFirstWeekdayFromStart(sch.startDate, sch.dayOfWeek);

            const startDateTime = new Date(`${dtStartDate}T${sch.startTime}`);
            const endDateTime = new Date(`${dtStartDate}T${sch.endTime}`);

            const untilDate = new Date(sch.endDate);
            const validUntil = isNaN(untilDate.getTime()) || untilDate.getFullYear() <= 1900
                ? new Date(new Date().getFullYear(), 11, 31, 23, 59, 59).toISOString()
                : untilDate.toISOString();

            return {
                id: sch.clubScheduleId,
                title: sch.scheduleName,
                rrule: {
                    freq: "weekly",
                    byweekday: [weekdayAbbrev],
                    dtstart: startDateTime.toISOString(),
                    until: validUntil,
                },
                start: startDateTime,
                end: endDateTime,
                backgroundColor: "#28a745",
                extendedProps: {
                    dayOfWeek: sch.dayOfWeek,
                    startTime: sch.startTime,
                    endTime: sch.endTime,
                    schedule: sch,
                },
            };
        })



    const renderEventContent = (eventInfo: any) => {
        const start = String(eventInfo.event.extendedProps.startTime).padStart(2, "0");
        const end = String(eventInfo.event.extendedProps.endTime).padStart(2, "0");

        return (
            <div className="p-2 border-b">
                <div className="font-bold text-lg">{eventInfo.event.title}</div>
                <div className="text-sm text-muted-foreground">
                    Day: {eventInfo.event.extendedProps.dayOfWeek} | Time: {start}:00 - {end}:00
                </div>
            </div>
        );
    };


    const handleSubmit = async (data: ScheduleRequest) => {
        const newSchedule: ScheduleRequest = {
            clubId: clubId,
            scheduleName: data.scheduleName,
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            startDate: data.startDate,
            endDate: data.endDate,
        };
        await CreateClubScheduleAPI(newSchedule)
        toast.success("Create schedule successfully!");
        setFlag((prev) => !prev);
    }

    return (
        <div className="p-6">
            <div className="flex justify-end mb-10 mt-3">
                <Button variant={'custom'} onClick={() => setOpenCreateDialog(true)}>Create Club Schedule</Button>
            </div>
            {loading ? (
                <p className="text-center">Loading schedules...</p>
            ) : (
                <div className="mx-auto" style={{ maxWidth: "1200px" }}>
                    <FullCalendar
                        plugins={[listPlugin, interactionPlugin, rrulePlugin]}
                        initialView="listWeek"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "listMonth,listWeek,listDay",
                        }}
                        eventTimeFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }}
                        views={{
                            listMonth: { buttonText: "Month" },
                            listWeek: { buttonText: "Week" },
                            listDay: { buttonText: "Day" },
                        }}
                        events={calendarEvents}
                        eventContent={renderEventContent}
                        height="auto"
                        timeZone="local"
                    />
                </div>
            )}
            {openCreateDialog && (
                <CreateClubScheduleDialog
                    onClose={() => setOpenCreateDialog(false)}
                    onSubmit={(data) => handleSubmit(data)}
                    clubId={clubId}
                />
            )}
        </div>
    );
};

export default ClubSchedulePage;
