import * as React from "react";
import SkappCard from "./SkappCard";

export default function SkappGrid({ title, skapps = [] }) {
  return (
    <div>
      <h2 className="text-gray-500 text-xs uppercase tracking-wide">{title}</h2>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skapps.map((skapp) => (
          <li key={skapp.id}>
            <SkappCard skapp={skapp} />
          </li>
        ))}
      </ul>
    </div>
  );
}
