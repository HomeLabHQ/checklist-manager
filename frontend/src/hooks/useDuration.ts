import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { DurationFormat } from "../settings/settings";
dayjs.extend(duration);
dayjs.extend(relativeTime);

export function useDuration(seconds?: number): string {
  if (!seconds) {
    return "";
  }
  return dayjs.duration(seconds, "seconds").format(DurationFormat);
}
