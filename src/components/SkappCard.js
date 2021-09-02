import * as React from "react";
import { ClockIcon } from "@heroicons/react/outline";
import Link from "../components/Link";
import SkappOptions from "../components/SkappOptions";
import skynetClient from "../services/skynetClient";
import RelativeDate from "../components/RelativeDate";

const skappInitials = (skapp) => {
  if (skapp.initials) return skapp.initials;
  if (skapp.metadata.name) return skapp.metadata.name.slice(0, 4).trim();

  return skapp.skylink.slice(-4);
};

export default function SkappCard({ skapp, actions = true }) {
  const [skylinkUrl, setSkylinkUrl] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const skylinkUrl = await skynetClient.getSkylinkUrl(skapp.skylink, { subdomain: true });

      setSkylinkUrl(skylinkUrl);
    })();
  }, [skapp.skylink]);

  return (
    <div key={skapp.skylink} className="col-span-1 flex shadow-sm rounded-md border border-palette-200">
      <Link
        href={skylinkUrl}
        className="flex-shrink-0 flex items-center justify-center w-16 h-16 m-2 text-white text-sm font-medium overflow-hidden rounded-md"
        style={{ backgroundColor: skapp.metadata.icon ? null : skapp.metadata.themeColor ?? "#242424" }}
      >
        {skapp.metadata.icon ? <img src={skapp.metadata.icon} alt={skappInitials(skapp)} /> : skappInitials(skapp)}
      </Link>

      <div className="flex-1 flex items-center justify-between truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate space-y-1 text-left">
          <Link href={skylinkUrl} className="font-semibold text-palette-600 hover:text-primary transition-colors">
            {skapp.metadata.name ?? skapp.skylink}
          </Link>

          <p className="text-palette-400 text-xs truncate">{skapp.metadata.description ?? skapp.skylink}</p>

          {skapp.addedOn && (
            <p className="text-palette-300 text-xs flex items-center flex-row">
              <ClockIcon className="w-4 inline-flex mr-1" /> installed <RelativeDate date={skapp.addedOn} />
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
