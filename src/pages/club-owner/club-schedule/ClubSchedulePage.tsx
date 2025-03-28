/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { Button } from "@/components/ui/button";
import CreateClubScheduleDialog from "@/components/partial/club_owner/club-schedule/CreateClubScheduleDialog";
import EditClubScheduleDialog from "@/components/partial/club_owner/club-schedule/EditClubScheduleDialog";
import toast from "react-hot-toast";

// Fake data theo schema: ClubScheduleId, ClubId, ScheduleName, DayOfWeek, StartTime, EndTime, Status.
interface ClubSchedule {
    ClubScheduleId: string;
    ClubId: string;
    ScheduleName: string;
    DayOfWeek: string;
    StartTime: string; // format: "HH:MM", ví dụ "12:00"
    EndTime: string;   // format: "HH:MM", ví dụ "13:00"
    Status: boolean;
}

const fakeClubSchedules: ClubSchedule[] = [
    {
        ClubScheduleId: "cs1",
        ClubId: "club1",
        ScheduleName: "Weekly Meeting",
        DayOfWeek: "Wednesday",
        StartTime: "12:00",
        EndTime: "13:00",
        Status: true,
    },
    {
        ClubScheduleId: "cs2",
        ClubId: "club1",
        ScheduleName: "Workshop",
        DayOfWeek: "Friday",
        StartTime: "14:00",
        EndTime: "16:00",
        Status: true,
    },
];

// Mapping day names to rrule weekday abbreviations.
const dayMap: Record<string, string> = {
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Webnesday: "WE",
    Thursday: "TH",
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

// Helper: Tính dtstart dựa trên một ngày cố định (ví dụ 2025-03-17 là thứ Hai) cộng thêm offset của ngày.
function getDtStartForWeekday(weekday: string): string {
    const baseDate = new Date("2025-03-17"); // 2025-03-17 là thứ Hai.
    const weekdayOffset: Record<string, number> = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Webnesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
    };
    const offset = weekdayOffset[weekday] ?? 0;
    const dt = new Date(baseDate);
    dt.setDate(dt.getDate() + offset);
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const ClubSchedulePage: React.FC = () => {
    const [schedules, setSchedules] = useState<ClubSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<ClubSchedule | null>(null);

    // Giả lập fetch dữ liệu từ API
    useEffect(() => {
        async function fetchSchedules() {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSchedules(fakeClubSchedules);
            setLoading(false);
        }
        fetchSchedules();
    }, []);

    // Chuyển các lịch club sang dạng event của FullCalendar (sử dụng rrule cho sự lặp lại hàng tuần).
    const calendarEvents = schedules
        .filter((sch) => sch.Status)
        .map((sch) => {
            const weekdayAbbrev = dayMap[sch.DayOfWeek] || "MO";
            const dtstart = getDtStartForWeekday(sch.DayOfWeek);
            // Giả sử StartTime và EndTime có format "HH:MM"
            const [startH, startM] = sch.StartTime.split(":").map(Number);
            const [endH, endM] = sch.EndTime.split(":").map(Number);
            const startDecimal = startH + startM / 60;
            const endDecimal = endH + endM / 60;
            const durationHours = endDecimal - startDecimal;
            const durationISO = `PT${durationHours}H`;
            return {
                id: sch.ClubScheduleId,
                title: sch.ScheduleName,
                rrule: {
                    freq: "weekly",
                    byweekday: [weekdayAbbrev],
                    dtstart: `${dtstart}T${sch.StartTime}:00`,
                    until: "2025-12-31T00:00:00",
                },
                duration: durationISO,
                backgroundColor: "#28a745",
                extendedProps: {
                    dayOfWeek: sch.DayOfWeek,
                    startTime: sch.StartTime,
                    endTime: sch.EndTime,
                    schedule: sch,
                },
            };
        });

    // Custom render cho event trong list view.
    const renderEventContent = (eventInfo: any) => {
        return (
            <div className="p-2 border-b">
                <div className="font-bold text-lg">{eventInfo.event.title}</div>
                <div className="text-sm">
                    Day: {eventInfo.event.extendedProps.dayOfWeek} | Time:{" "}
                    {eventInfo.event.extendedProps.startTime} -{" "}
                    {eventInfo.event.extendedProps.endTime}
                </div>
            </div>
        );
    };

    // Xử lý click vào event: Nếu event có ngày bắt đầu từ hôm nay trở đi thì mở dialog chỉnh sửa.
    const handleEventClick = (info: any) => {
        info.jsEvent.preventDefault();
        const eventStart = info.event.start;
        const today = new Date();
        if (eventStart && eventStart >= today) {
            const schedule: ClubSchedule = info.event.extendedProps.schedule;
            setOpenEditDialog(schedule);
        } else {
            toast.error("Cannot edit past schedule.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-left">Club Schedules</h2>
            <div className="flex justify-end mb-10">
                <Button onClick={() => setOpenCreateDialog(true)}>
                    Create Club Schedule
                </Button>
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
                        views={{
                            listMonth: { buttonText: "Month" },
                            listWeek: { buttonText: "Week" },
                            listDay: { buttonText: "Day" },
                        }}
                        events={calendarEvents}
                        eventContent={renderEventContent}
                        height="auto"
                        eventClick={handleEventClick}
                    />
                </div>
            )}
            {openCreateDialog && (
                <CreateClubScheduleDialog
                    onClose={() => setOpenCreateDialog(false)}
                    onSubmit={(data) => {
                        const newSchedule: ClubSchedule = {
                            ClubScheduleId: `cs-${Date.now()}`,
                            ClubId: "club1",
                            ScheduleName: data.scheduleName,
                            DayOfWeek: data.dayOfWeek,
                            StartTime: data.startTime,
                            EndTime: data.endTime,
                            Status: data.status,
                        };
                        setSchedules((prev) => [...prev, newSchedule]);
                        setOpenCreateDialog(false);
                    }}
                />
            )}
            {openEditDialog && (
                <EditClubScheduleDialog
                    schedule={openEditDialog}
                    onClose={() => setOpenEditDialog(null)}
                    onSubmit={(updatedSchedule) => {
                        setSchedules((prev) =>
                            prev.map((sch) =>
                                sch.ClubScheduleId === updatedSchedule.ClubScheduleId
                                    ? updatedSchedule
                                    : sch
                            )
                        );
                        setOpenEditDialog(null);
                    }}
                />
            )}
        </div>
    );
};

export default ClubSchedulePage;
