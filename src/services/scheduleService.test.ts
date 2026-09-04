import { describe, expect, it } from "vitest";
import { getScheduleContext } from "./scheduleService";

describe("scheduleService", () => {
  it("returns the Monday demo handoff from BUR to MEZ at 09:30", () => {
    const context = getScheduleContext({
      useDemoTime: true,
      day: "Monday",
      time: "09:30"
    });

    expect(context.nextClass?.courseCode).toBe("SPN 601D");
    expect(context.currentOrPreviousClass?.courseCode).toBe("ECO 304K");
    expect(context.origin).toBe("BUR");
    expect(context.destination).toBe("MEZ");
    expect(context.minutesUntilNextClass).toBe(30);
  });

  it("identifies Tuesday NTR 306 as remote after 12:30", () => {
    const context = getScheduleContext({
      useDemoTime: true,
      day: "Tuesday",
      time: "12:31"
    });

    expect(context.nextClass?.courseCode).toBe("NTR 306");
    expect(context.nextClass?.mode).toBe("remote");
    expect(context.isRemoteNext).toBe(true);
  });
});
