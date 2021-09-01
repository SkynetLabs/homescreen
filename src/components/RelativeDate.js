import * as React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ms from "ms";
import { useInterval } from "react-use";

dayjs.extend(relativeTime);

export default function RelativeDate({ date }) {
  const [relativeDate, setRelativeDate] = React.useState(dayjs(date).fromNow());

  useInterval(() => {
    setRelativeDate(dayjs(date).fromNow());
  }, ms("10s"));

  return relativeDate;
}
