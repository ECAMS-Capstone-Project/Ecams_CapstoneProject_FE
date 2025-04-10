/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import useAuth from "@/hooks/useAuth";
import {
  GetScheduleStudentByIdAPI,
  StudentScheduleData,
} from "@/api/representative/StudentAPI";
import LoadingAnimation from "@/components/ui/loading";

const dayMap: Record<string, string> = {
  Monday: "MO",
  Tuesday: "TU",
  Wednesday: "WE",
  Thursday: "TH",
  Thurday: "TH",
  Friday: "FR",
  Saturday: "SA",
  Sunday: "SU",
  // lowercase
  monday: "MO",
  tuesday: "TU",
  wednesday: "WE",
  thursday: "TH",
  thurday: "TH",
  friday: "FR",
  saturday: "SA",
  sunday: "SU",
};

// Helper function: get a dtstart for a given weekday using a fixed base date.
function getFirstWeekdayFromStart(
  startDateStr: string,
  dayOfWeek: string
): string {
  const dayCode = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const targetDay = dayCode.indexOf(dayMap[dayOfWeek]);
  if (targetDay === -1) return startDateStr;

  const start = new Date(startDateStr);
  const startDay = start.getDay();

  const diff = (targetDay - startDay + 7) % 7;
  start.setDate(start.getDate() + diff);

  const date = start.toISOString().split("T")[0];
  return date;
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
      const diffDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const baseEvent = {
        id: event.eventId,
        title: `Event: ${event.eventName}`,
        start: event.startDate,
        end: event.endDate,
        backgroundColor: "#3788d8",
        extendedProps: {
          type: "event",
          link: `/student/events/${event.eventId}`,
        },
      };
      if (diffDays > 1) {
        // If event spans multiple days, split it.
        eventEvents.push(...splitMultiDayEvent(baseEvent));
      } else {
        eventEvents.push(baseEvent);
      }
    });
  }

  const clubEvents = Array.isArray(data.clubSchedules)
    ? data.clubSchedules
      .filter((club) => club.status)
      .map((club, index) => {
        const weekdayAbbrev = dayMap[club.dayOfWeek] || "MO";

        const baseDate = getFirstWeekdayFromStart(
          club.startDate,
          club.dayOfWeek
        );

        const formatTime = (time: string) => {
          if (time.includes(":")) return time.padStart(5, "0");
          return `${time.padStart(2, "0")}:00`;
        };

        const startTimeFormatted = formatTime(club.startTime);
        const endTimeFormatted = formatTime(club.endTime);

        const startDateTime = new Date(
          `${baseDate}T${startTimeFormatted}:00`
        );
        const endDateTime = new Date(`${baseDate}T${endTimeFormatted}:00`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.warn("⛔ Invalid datetime for:", club);
          return null;
        }

        const untilDate = new Date(club.endDate);
        const validUntil = isNaN(untilDate.getTime())
          ? new Date().toISOString()
          : untilDate.toISOString();

        return {
          id: `club-${index}`,
          title: `${club.clubName}: ${club.scheduleName}`,
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
            type: "club",
            startTime: startTimeFormatted,
            endTime: endTimeFormatted,
            schedule: club,
          },
        };
      })
      .filter(Boolean)
    : [];

  // Combine events.
  const calendarEvents = [...eventEvents, ...clubEvents];

  return (
    <div className="p-4 pb-20">
      <div className="mx-auto" style={{ maxWidth: "1550px" }}>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          initialView="dayGridMonth"
          initialDate={new Date()}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={calendarEvents}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          height="auto"
          displayEventTime={true}
          eventClick={(info) => {
            info.jsEvent.preventDefault();
            const link = info.event.extendedProps.link;
            if (link) {
              window.location.href = link;
            }
          }}
          slotEventOverlap={false}
          eventContent={(arg) => {
            const { event, timeText } = arg;
            const isClub = event.extendedProps.type === "club";
            return (
              <div
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  background: isClub ? "#eafaf1" : "#e8f0fe",
                  borderLeft: `4px solid ${isClub ? "#28a745" : "#1a73e8"}`,
                  fontSize: "12.5px",
                  lineHeight: 1.3,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontWeight: 600, color: "#333" }}>
                  ⏰ {timeText}
                </div>
                <div style={{ color: "#444" }}>{event.title}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
