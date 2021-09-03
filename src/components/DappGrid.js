import * as React from "react";
import DappCard from "./DappCard";

export default function DappGrid({ title, dapps = [] }) {
  return (
    <div>
      <h2 className="text-gray-500 text-xs uppercase tracking-wide">{title}</h2>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dapps.map((dapp) => (
          <li key={dapp.id}>
            <DappCard dapp={dapp} />
          </li>
        ))}
      </ul>
    </div>
  );
}
