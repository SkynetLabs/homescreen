import { TagIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import classNames from "classnames";

export default function Timeline({ dapp, activeSkylink, onChange }) {
  if (!dapp) return null;

  // reverse order so it starts from most recent to oldest
  const skylinks = dapp.skylinks.slice().reverse();

  return (
    <div className="flow-root w-full">
      <ul className="-mb-8">
        {skylinks.map((element, index) => (
          <li key={element.skylink}>
            <div className="relative pb-8">
              {index !== dapp.skylinks.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3 items-center">
                <div>
                  <span
                    onClick={() => onChange(element.skylink)}
                    className={classNames("h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white", {
                      "bg-primary": activeSkylink === element.skylink,
                      "bg-palette-200 cursor-pointer hover:bg-primary hover:opacity-50":
                        activeSkylink !== element.skylink,
                    })}
                  >
                    <TagIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 flex justify-between space-x-4 items-center">
                  <div>
                    <p className="text-sm text-palette-400 break-all">{element.skylink}</p>
                    <ul className="text-xs text-palette-300 divide-x divide-palette-200 flex flex-row space-x-2"></ul>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={dayjs(element.addedOn).format("YYYY-MM-DD")}>
                      {dayjs(element.addedOn).format("MMM D")}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
