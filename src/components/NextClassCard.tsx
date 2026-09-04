import { getLocationByAbbreviation } from "../data/locations";
import { formatTime } from "../services/scheduleService";
import type { ScheduleContext } from "../types/schedule";

interface NextClassCardProps {
  context: ScheduleContext;
  onFindCoolStudySpace: () => void;
}

export const NextClassCard = ({
  context,
  onFindCoolStudySpace
}: NextClassCardProps) => {
  const { nextClass, origin, destination, minutesUntilNextClass, isRemoteNext } =
    context;
  const originLocation = getLocationByAbbreviation(origin);
  const destinationLocation = getLocationByAbbreviation(destination);
  const currentOrPreviousClass = context.currentOrPreviousClass;

  if (!nextClass) {
    return (
      <section className="card next-class-card">
        <p className="eyebrow">Schedule</p>
        <h2>No more classes today</h2>
        <p>Use CoolRoute to choose a cooler return route or study location.</p>
      </section>
    );
  }

  if (isRemoteNext) {
    return (
      <section className="card next-class-card">
        <p className="eyebrow">Next Class</p>
        <h2>Your next class is remote.</h2>
        <p>{nextClass.courseCode}</p>
        <div className="remote-actions">
          <button type="button" className="secondary-button">
            Go Home
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onFindCoolStudySpace}
          >
            Find Cool Study Space
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card next-class-card">
      <div className="next-class-main">
        <p className="eyebrow">Next Class</p>
        <h2>{nextClass.courseCode}</h2>
        <p className="room-time">
          {nextClass.abbreviation} {nextClass.room} <span>|</span>{" "}
          {formatTime(nextClass.startTime)}
        </p>
        <strong className="deadline-text">
          You have {minutesUntilNextClass ?? 0} minutes
        </strong>
      </div>
      <dl className="route-endpoints">
        <div>
          <dt>From</dt>
          <dd>{originLocation?.name ?? "Rise at West Campus"}</dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>{destinationLocation?.name ?? nextClass.building}</dd>
        </div>
      </dl>
      {currentOrPreviousClass ? (
        <p className="current-class-note">
          Current/previous class: {currentOrPreviousClass.courseCode}{" "}
          {currentOrPreviousClass.abbreviation} {currentOrPreviousClass.room}{" "}
          {currentOrPreviousClass.startTime}–{currentOrPreviousClass.endTime}
        </p>
      ) : null}
    </section>
  );
};
