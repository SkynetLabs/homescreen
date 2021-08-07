import * as React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ClockIcon } from "@heroicons/react/outline";
import Link from "../components/Link";
import SkappOptions from "../components/SkappOptions";

dayjs.extend(relativeTime);

const skappInitials = (project) => {
  if (project.initials) return project.initials;
  if (project.name) return project.name.slice(0, 4);

  return project.skylink.slice(-4);
};

export default function SkappCard({ skapp, actions = true }) {
  return (
    <div key={skapp.skylink} className="col-span-1 flex shadow-sm rounded-md border border-gray-200">
      <div
        className="flex-shrink-0 flex items-center justify-center w-16 p-2 text-white text-sm font-medium overflow-hidden"
        style={{ backgroundColor: skapp.icon ? null : skapp.bgColor ?? "#242424" }}
      >
        {skapp.icon ? <img src={skapp.icon} alt={skappInitials(skapp)} /> : skappInitials(skapp)}
      </div>

      <div className="flex-1 flex items-center justify-between bg-white truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate space-y-1 text-left">
          <Link href={skapp.skylinkUrl} className="font-semibold text-palette-600 hover:text-primary transition-colors">
            {skapp.name ?? skapp.skylink}
          </Link>

          <p className="text-gray-400 text-xs truncate">{skapp.description ?? skapp.skylink}</p>

          {skapp.access && (
            <p className="text-gray-500 text-xs flex items-center flex-row">
              <ClockIcon className="w-4 inline-flex mr-1" />
              {skapp.access ? dayjs(skapp.access).fromNow() : "never"}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center pr-4">
          <SkappOptions skapp={skapp} />
        </div>
      )}
    </div>
  );
}
