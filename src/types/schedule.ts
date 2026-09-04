export type ClassMode = "in-person" | "remote";

export type ScheduleDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface ClassSession {
  id: string;
  courseCode: string;
  startTime: string;
  endTime: string;
  day: ScheduleDay;
  building?: string;
  abbreviation?: string;
  room?: string;
  mode: ClassMode;
}

export interface ScheduleContext {
  currentClass?: ClassSession;
  previousClass?: ClassSession;
  currentOrPreviousClass?: ClassSession;
  nextClass?: ClassSession;
  origin?: string;
  destination?: string;
  minutesUntilNextClass?: number;
  isRemoteNext: boolean;
  day: ScheduleDay;
  time: string;
}
