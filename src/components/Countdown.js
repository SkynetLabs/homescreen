import { useEffect, useState } from "react";
import { useInterval } from "react-use";

const dateTargetUnix = 1619798400000; // April 30th, 2021
const dateLabels = ["days", "hours", "minutes", "seconds"];

export default function Countdown() {
  const [time, setTime] = useState(null);

  function pad(num, size) {
    return ("000000000" + num).substr(-size);
  }

  const tick = () => {
    let delta = Math.abs(dateTargetUnix - Date.now()) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60); // in theory the modulus is not required

    setTime(`${days}:${hours}:${minutes}:${seconds}`);
  };

  useEffect(tick, []); // run on init
  useInterval(tick, 1000); // run every second

  if (!time) return null;

  return (
    <div className="flex space-x-4">
      {time.split(":").map((value, index) => (
        <div
          key={index}
          className="flex flex-col bg-palette-100 border-palette-200 border rounded p-4 flex-shrink-0 items-center"
        >
          <div className="flex space-x-4 font-mono font-semibold text-5xl text-palette-400 sm:text-7xl">
            {pad(value, 2)}
          </div>
          <div className="mt-4 text-center text-palette-300 uppercase tracking-widest text-xs sm:text-sm md:text-base">
            {dateLabels[index]}
          </div>
        </div>
      ))}
    </div>
  );
}
