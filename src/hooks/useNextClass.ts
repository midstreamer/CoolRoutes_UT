import { useMemo } from "react";
import { getScheduleContext } from "../services/scheduleService";

export const useNextClass = () =>
  useMemo(() => getScheduleContext(), []);
