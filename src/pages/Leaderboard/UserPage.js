// import { FireIcon } from "@heroicons/react/solid";
import ordinal from "ordinal";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { SkynetContext } from "../../state/SkynetContext";
import SearchBar from "./components/SearchBar";
import RecordList from "./components/RecordList";
import AvatarIcon from "../../components/AvatarIcon";
import Link from "../../components/Link";
import { returnAvatar } from "../../hooks/useAvatar";
import userBlocklist from "../../data/userBlocklist";
import { BsGift } from "react-icons/bs";
import userPrizeList from "../../data/userPrizeList";

const endpoint = "users";
const searchLabel = "Search by user public key";
const searchKey = "userPK";
const sortConfig = [
  { name: "Content creation (total)", field: "newContentTotal" },
  { name: "Content creation (24 hours)", field: "newContentLast24H" },
  { name: "Interactions (total)", field: "interactionsTotal" },
  { name: "Interactions (24 hours)", field: "interactionsLast24H" },
];
const sortByDefault = "newContentTotal";
const sortDirDefault = "desc";

const transform = async (data) => {
  let modified = await Promise.allSettled(
    data.map(async (record, index) => {
      let username = null;
      let avatar = undefined;
      let prize = undefined;

      // blocklist
      let display = !userBlocklist.includes(record.userPK);

      if (userPrizeList.includes(record.userPK)) {
        prize = true;
      }

      if (record.userMetadata && record.userMetadata.mySkyProfile && record.userMetadata.mySkyProfile.profile) {
        const mySkyProfile = record.userMetadata.mySkyProfile.profile;
        username = mySkyProfile.username;
        avatar = await returnAvatar(mySkyProfile);
      }
      return { ...record, username, avatar, display, prize };
    })
  );

  modified = modified.map((r) => r.value);

  //blocklist
  // modified = modified.filter((record) => {
  //   let displayUser = !userBlocklist.includes(record.userPK);

  //   //here we could add username blocking behavior --
  //   // displayUser = !!record.username;

  //   return displayUser;
  // });

  return modified;
};

const render = (record, pos, userID) => {
  if (!record) {
    return null;
  }
  const {
    userPK,
    interactionsTotal,
    interactionsLast24H,
    newContentTotal,
    newContentLast24H,
    // userMetadata,
    username,
    avatar,
  } = record;

  return (
    <>
      <div className={"px-4 py-4 sm:px-6" + (userID === userPK ? " bg-green-50" : "")}>
        <div className="flex items-center justify-between space-x-8 ">
          <div className="flex flex-row space-x-4 truncate">
            <div className="flex items-center align-middle text-sm text-palette-600 font-semibold">
              <span className="text-gray-400 sm:w-10">{ordinal(pos)}</span>
              {/* {avatar && <img className="shadow sm:w-16 sm:h-16 w-16 h-16 rounded-full" src={avatar} alt="Avatar" />}
              {!avatar && <UserCircleIcon className="w-16 h-16 text-gray-200" />} */}
              <AvatarIcon avatar={avatar} />
              {/* <span className="hidden sm:flex">
                {pos <= 3 && <FireIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />}
                {pos <= 2 && <FireIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />}
                {pos <= 1 && <FireIcon className="flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />}
              </span> */}
            </div>
            <div className="flex items-center align-middle text-sm text-palette-600">
              <div className="text-sm truncate">
                <Link to={"/leaderboard/users/" + userPK}>{username ? username : userPK}</Link>
              </div>
              {record.prize && (
                <p className="text-xl mr-6 align-middle items-center">
                  <BsGift className="text-gray-500 ml-4" />
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-row space-x-8 flex-shrink-0">
            <div className="flex-shrink-0 flex flex-col text-sm tabular-nums">
              <p className="text-palette-400">Interactions</p>
              <p>
                {interactionsTotal} <span className="text-palette-300 ml-2">total</span>
              </p>
              <p className="xl:w-48">
                {interactionsLast24H} <span className="text-palette-300 ml-2">in last 24h</span>
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col text-sm tabular-nums">
              <p className="text-palette-400">Content creation</p>
              <p>
                {newContentTotal} <span className="text-palette-300 ml-2">total</span>
              </p>
              <p className="xl:w-48">
                {newContentLast24H} <span className="text-palette-300 ml-2">in last 24h</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ContentPage({ setTitle }) {
  const { userID } = useContext(SkynetContext);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(sortByDefault);
  const [sortDir, setSortDir] = useState(sortDirDefault);

  useEffect(() => {
    setTitle("Users Leaderboard");
  }, [setTitle]);

  const searchActions = useMemo(() => {
    if (userID) {
      return [{ name: "Find my UserID", type: "button", onClick: () => setSearch(userID) }];
    }

    return [];
  }, [userID, setSearch]);

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Don't see yourself? Data is scraped every 15 minutes. Check back soon.</div>

      <SearchBar
        sortConfig={sortConfig}
        searchLabel={searchLabel}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        searchActions={searchActions}
      />
      <RecordList
        endpoint={endpoint}
        search={search}
        searchKey={searchKey}
        sortBy={sortBy}
        sortDir={sortDir}
        transform={transform}
      >
        {render}
      </RecordList>
    </div>
  );
}
