import * as React from "react";
import { ClockIcon } from "@heroicons/react/outline";
import Link from "../components/Link";
import DappOptions from "../components/DappOptions";
import skynetClient from "../services/skynetClient";
import RelativeDate from "../components/RelativeDate";

const dappInitials = (dapp) => {
  if (dapp.initials) return dapp.initials;
  if (dapp.metadata.name) return dapp.metadata.name.slice(0, 4).trim();

  return dapp.skylink.slice(-4);
};

export default function DappCard({ dapp, actions = true }) {
  const [skylinkUrl, setSkylinkUrl] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const skylinkUrl = await skynetClient.getSkylinkUrl(dapp.skylink, { subdomain: true });

      setSkylinkUrl(skylinkUrl);
    })();
  }, [dapp.skylink]);

  const iconUrl = React.useMemo(() => {
    if (dapp.metadata.icon && skylinkUrl) return new URL(dapp.metadata.icon, skylinkUrl).toString();
  }, [dapp.metadata.icon, skylinkUrl]);
  const wasUpdated = dapp.skylinks?.length > 1;
  const lastModificationDate = wasUpdated ? dapp.skylinks[dapp.skylinks.length - 1].addedOn : dapp.addedOn;

  return (
    <div key={dapp.skylink} className="col-span-1 flex shadow-sm rounded-md border border-palette-200">
      <Link
        href={skylinkUrl}
        className="flex-shrink-0 flex items-center justify-center w-16 h-16 m-2 text-white text-sm font-medium overflow-hidden rounded-md"
        style={{ backgroundColor: iconUrl ? null : dapp.metadata.themeColor ?? "#242424" }}
      >
        {iconUrl ? <img src={iconUrl} alt={dappInitials(dapp)} /> : dappInitials(dapp)}
      </Link>

      <div className="flex-1 flex items-center justify-between truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate space-y-1 text-left">
          <Link href={skylinkUrl} className="font-semibold text-palette-600 hover:text-primary transition-colors">
            {dapp.metadata.name ?? dapp.skylink}
          </Link>

          <p className="text-palette-400 text-xs truncate">{dapp.metadata.description ?? dapp.skylink}</p>

          {dapp.addedOn && (
            <p className="text-palette-300 text-xs flex items-center flex-row truncate">
              <ClockIcon className="w-4 inline-flex mr-1 flex-shrink-0" /> {wasUpdated ? "updated" : "installed"}{" "}
              <RelativeDate date={lastModificationDate} />
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center pr-4">
          <DappOptions dapp={dapp} />
        </div>
      )}
    </div>
  );
}
