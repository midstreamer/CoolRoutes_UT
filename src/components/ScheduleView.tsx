import { pilotSchedule } from "../data/schedule";
import { formatTime } from "../services/scheduleService";
import type { ScheduleDay } from "../types/schedule";

const days: ScheduleDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

export const ScheduleView = () => (
  <section className="stack" aria-label="Pilot schedule">
    <div className="section-heading">
      <p className="eyebrow">Pilot Schedule</p>
      <h2>Known Student Week</h2>
      <p>Monday BUR to MEZ is the flagship v0.1 route scenario.</p>
    </div>
    {days.map((day) => {
      const classes = pilotSchedule.filter((classSession) => classSession.day === day);

      return (
        <article key={day} className="card schedule-day">
          <h3>{day}</h3>
          <div className="schedule-items">
            {classes.map((classSession) => (
              <div key={classSession.id} className="schedule-item">
                <time>
                  {formatTime(classSession.startTime)} -{" "}
                  {formatTime(classSession.endTime)}
                </time>
                <strong>{classSession.courseCode}</strong>
                <span>
                  {classSession.mode === "remote"
                    ? "REMOTE / ONLINE"
                    : `${classSession.building} (${classSession.abbreviation} ${classSession.room})`}
                </span>
              </div>
            ))}
          </div>
        </article>
      );
    })}
  </section>
);
