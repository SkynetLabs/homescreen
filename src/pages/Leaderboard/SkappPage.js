// import { FireIcon } from "@heroicons/react/solid";
import ordinal from "ordinal";
import React, { useState } from "react";
// import { getFullDomainUrlForPortal, SkynetClient } from "skynet-js";
import SearchBar from "./components/SearchBar";
import RecordList from "./components/RecordList";
import Link from "../../components/Link";
import AvatarIcon from "../../components/AvatarIcon";
import { skappNames } from "../../data/skappNames";
import { FaGithub } from "react-icons/fa";
import { client } from "../../state/SkynetContext";

// const client = new SkynetClient();
const endpoint = "skapps";
const searchLabel = "Search by skapp name";
const searchKey = "skapp";
const sortConfig = [
  { name: "Interactions (total)", field: "total" },
  { name: "Interactions (24 hours)", field: "last24H" },
];
const sortByDefault = "total";
const sortDirDefault = "desc";
const transform = async (data) => {
  let modified = await Promise.allSettled(
    data.map(async (record, index) => {
      let display = true;
      let name = undefined;
      let description = undefined;
      let github = undefined;
      let wip = undefined;
      let imageUrl = undefined;
      // let link = getFullDomainUrlForPortal(client., record.skapp);
      let link = await client.getFullDomainUrl(record.skapp, { subdomain: true });
      if (skappNames[record.skapp]) {
        const r = skappNames[record.skapp];
        display = r.hidden ? false : true;
        name = r.name ? r.name : undefined;
        description = r.description ? r.description : undefined;
        github = r.github ? r.github : undefined;
        link = r.link ? await client.getFullDomainUrl(r.link, { subdomain: true }) : link;
        wip = r.wip ? r.wip : wip;
        imageUrl = r.imageUrl ? r.imageUrl : imageUrl;
      }
      return { ...record, display, name, link, description, github, wip, imageUrl };
    })
  );

  modified = modified.map((record, index) => {
    return record.value;
  });

  // modified = modified.filter((record, index) => {
  //   return !record.hidden;
  // });

  return modified;
};

const render = (record, pos) => {
  let { link, skapp, total, last24H, name, description, github, wip, imageUrl } = record;

  const displayName = name ? name : skapp;

  return (
    <>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between space-x-8">
          <div className="flex flex-row space-x-4 truncate">
            <div className="flex items-center text-sm text-palette-600 font-semibold">
              <span className="text-gray-400 w-10">{ordinal(pos)}</span>
              <AvatarIcon avatar={imageUrl} skapp />
              {/* {pos <= 3 && <FireIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />}
              {pos <= 2 && <FireIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />}
              {pos <= 1 && <FireIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />} */}
            </div>
            <div className="flex items-center align-middle text-sm text-palette-600">
              <div className="text-sm truncate">
                {link ? <Link href={link}>{displayName}</Link> : displayName}
                {description && <span className="text-gray-500"> – {description}</span>}
              </div>
            </div>
            {wip && (
              <span className="text-xs items-center font-normal leading-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Test Version
              </span>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col xl:flex-row text-sm xl:space-x-4 xl:text-right tabular-nums">
            <p className="text-xl mr-6">
              {github && (
                <Link href={github}>
                  <FaGithub className="text-gray-900" />
                </Link>
              )}
            </p>
            <p>
              {total} <span className="text-gray-400 ml-2">total</span>
            </p>
            <p className="xl:w-48">
              {last24H} <span className="text-gray-400 ml-2">in last 24h</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ContentPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(sortByDefault);
  const [sortDir, setSortDir] = useState(sortDirDefault);

  // useEffect(() => {
  //   setTitle("Skapps Leaderboard");
  // }, [setTitle]);

  return (
    <div className="space-y-4">
      <SearchBar
        sortConfig={sortConfig}
        searchLabel={searchLabel}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
      />
      <RecordList
        endpoint={endpoint}
        transform={transform}
        search={search}
        searchKey={searchKey}
        sortBy={sortBy}
        sortDir={sortDir}
      >
        {render}
      </RecordList>
    </div>
  );
}
