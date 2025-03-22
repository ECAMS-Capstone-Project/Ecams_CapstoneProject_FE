/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import useAuth from "@/hooks/useAuth";
import { GetScheduleStudentByIdAPI, StudentScheduleData } from "@/api/representative/StudentAPI";
import LoadingAnimation from "@/components/ui/loading";

// Updated dayMap (includes "Webnesday")
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

// Helper function: get a dtstart for a given weekday using a fixed base date.
function getDtStartForWeekday(weekday: string): string {
    const baseDate = new Date("2025-03-17"); // 2025-03-17 is a Monday.
    const weekdayMap: Record<string, number> = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
    };
    const offset = weekdayMap[weekday] ?? 0;
    const dt = new Date(baseDate);
    dt.setDate(dt.getDate() + offset);
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Helper function: split a multi‑day event into one event per day.
function splitMultiDayEvent(event: any) {
    const events = [];
    const start = new Date(event.start);
    const end = new Date(event.end);
    // In FullCalendar, the end date is exclusive so we iterate until day before end.
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dayISO = d.toISOString().split("T")[0];
        events.push({
            ...event,
            id: event.id + "-" + dayISO,
            start: dayISO,
            end: dayISO,
            allDay: true,
        });
    }
    return events;
}

export const StudentSchedule = () => {
    const [data, setData] = useState<StudentScheduleData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Fetch schedule data from your API endpoint.
    useEffect(() => {
        async function fetchSchedule() {
            try {
                if (!user) return;
                const response = await GetScheduleStudentByIdAPI(user.userId);
                setData(response.data ?? null);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchSchedule();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <div>
                    <LoadingAnimation />
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-4 text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }
    if (!data) return null;

    // Process one-time event schedules.
    let eventEvents: any[] = [];
    if (Array.isArray(data.eventSchedules)) {
        data.eventSchedules.forEach((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            const baseEvent = {
                id: event.eventId,
                title: `Event: ${event.eventName}`,
                start: event.startDate,
                end: event.endDate,
                backgroundColor: "#3788d8",
                extendedProps: { type: "event", link: `/student/events/${event.eventId}` },
            };
            if (diffDays > 1) {
                // If event spans multiple days, split it.
                eventEvents.push(...splitMultiDayEvent(baseEvent));
            } else {
                eventEvents.push(baseEvent);
            }
        });
    }

    // Process club schedules (recurring events).
    const clubEvents = Array.isArray(data.clubSchedules)
        ? data.clubSchedules
            .filter((club) => club.status)
            .map((club, index) => {
                const weekdayAbbrev = dayMap[club.dayOfWeek] || "MO";
                const dtstart = getDtStartForWeekday(club.dayOfWeek);
                const durationHours = Number(club.endTime) - Number(club.startTime);
                const durationISO = `PT${durationHours}H`;
                return {
                    id: `club-${index}`,
                    title: `${club.clubName}: ${club.scheduleName}`,
                    rrule: {
                        freq: "weekly",
                        byweekday: [weekdayAbbrev],
                        dtstart: `${dtstart}T${club.startTime.padStart(2, "0")}:00:00`,
                        until: "2025-12-31T00:00:00",
                    },
                    duration: durationISO,
                    backgroundColor: "#28a745",
                    extendedProps: {
                        type: "club",
                        link: `/student/club/${encodeURIComponent(club.clubName)}`,
                    },
                };
            })
        : [];

    // Combine events.
    const calendarEvents = [...eventEvents, ...clubEvents];

    return (
        <div className="p-4 pb-20">
            <div className="mx-auto" style={{ maxWidth: "1350px" }}>
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        listPlugin,
                        interactionPlugin,
                        rrulePlugin,
                    ]}
                    initialView="dayGridMonth"
                    initialDate="2025-03-21"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    events={calendarEvents}
                    height="auto"
                    displayEventTime={false}
                    eventClick={(info) => {
                        info.jsEvent.preventDefault();
                        const link = info.event.extendedProps.link;
                        if (link) {
                            window.location.href = link;
                        }
                    }}
                />
            </div>
        </div>
    );
};
