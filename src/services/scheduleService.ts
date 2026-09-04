import { pilotSchedule } from "../data/schedule";
import type {
  ClassSession,
  ScheduleContext,
  ScheduleDay
} from "../types/schedule";

const dayNames: ScheduleDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

interface ScheduleOptions {
  day?: ScheduleDay;
  time?: string;
  useDemoTime?: boolean;
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getRuntimeDayTime = (): Pick<ScheduleContext, "day" | "time"> => {
  const now = new Date();
  const day = dayNames[now.getDay() - 1] ?? "Monday";
  const time = now.toTimeString().slice(0, 5);
  return { day, time };
};

export const getConfiguredScheduleTime = (): Pick<
  ScheduleContext,
  "day" | "time"
> => {
  const useDemoTime = import.meta.env.VITE_USE_DEMO_TIME !== "false";

  if (useDemoTime) {
    return {
      day: (import.meta.env.VITE_DEMO_DAY as ScheduleDay) || "Monday",
      time: import.meta.env.VITE_DEMO_TIME || "09:30"
    };
  }

  return getRuntimeDayTime();
};

export const getClassesForDay = (
  day: ScheduleDay,
  schedule = pilotSchedule
) =>
  schedule
    .filter((classSession) => classSession.day === day)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

export const getCurrentClass = (
  day: ScheduleDay,
  time: string,
  schedule = pilotSchedule
) => {
  const minute = timeToMinutes(time);
  return getClassesForDay(day, schedule).find(
    (classSession) =>
      timeToMinutes(classSession.startTime) <= minute &&
      minute < timeToMinutes(classSession.endTime)
  );
};

export const getNextClass = (
  day: ScheduleDay,
  time: string,
  schedule = pilotSchedule
) => {
  const minute = timeToMinutes(time);
  const currentClass = getCurrentClass(day, time, schedule);

  if (currentClass) {
    return currentClass;
  }

  return getClassesForDay(day, schedule).find(
    (classSession) => timeToMinutes(classSession.startTime) >= minute
  );
};

export const getPreviousInPersonClass = (
  day: ScheduleDay,
  time: string,
  schedule = pilotSchedule
) => {
  const minute = timeToMinutes(time);
  return getClassesForDay(day, schedule)
    .filter(
      (classSession) =>
        classSession.mode === "in-person" &&
        timeToMinutes(classSession.endTime) <= minute
    )
    .at(-1);
};

export const getMinutesUntilNextClass = (
  nextClass: ClassSession | undefined,
  time: string
) => {
  if (!nextClass) {
    return undefined;
  }

  return Math.max(0, timeToMinutes(nextClass.startTime) - timeToMinutes(time));
};

export const getScheduleContext = (
  options: ScheduleOptions = {},
  schedule = pilotSchedule
): ScheduleContext => {
  const configured = options.useDemoTime
    ? {
        day: options.day ?? "Monday",
        time: options.time ?? "09:30"
      }
    : options.day && options.time
      ? { day: options.day, time: options.time }
      : getConfiguredScheduleTime();

  const currentClass = getCurrentClass(configured.day, configured.time, schedule);
  const nextClass = getNextClass(configured.day, configured.time, schedule);
  const previousClass = getPreviousInPersonClass(
    configured.day,
    configured.time,
    schedule
  );
  const currentOrPreviousClass =
    currentClass?.mode === "in-person" ? currentClass : previousClass;
  const origin =
    currentClass?.mode === "in-person"
      ? currentClass.abbreviation
      : previousClass?.abbreviation ?? "HOME";
  const destination =
    nextClass?.mode === "in-person" ? nextClass.abbreviation : undefined;

  return {
    currentClass,
    previousClass,
    currentOrPreviousClass,
    nextClass,
    origin,
    destination,
    minutesUntilNextClass: getMinutesUntilNextClass(
      nextClass,
      configured.time
    ),
    isRemoteNext: nextClass?.mode === "remote",
    day: configured.day,
    time: configured.time
  };
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};
