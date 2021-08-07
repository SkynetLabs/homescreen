import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ordinal from "ordinal";
import Link from "../../components/Link";
import { UserCircleIcon, ArrowCircleLeftIcon } from "@heroicons/react/solid";
import Moment from "react-moment";
// import { useSocialList } from "../../hooks/useSocialList";
// import Tag from "../../components/Tag";
import { useProfile } from "../../hooks/useProfile";
// import SearchBar from "./components/SearchBar";
import RecordList from "./components/RecordList";
import { client, SkynetContext } from "../../state/SkynetContext";
// import { FireIcon } from "@heroicons/react/solid";
// import userBlocklist from "../../data/userBlocklist";
import userAdminList from "../../data/userAdminList";
import { skappNames } from "../../data/skappNames";

// TODO: if userID == showID, link to edit page? load latest, not scraper profile?

const endpoint = "usercontent";
// const searchLabel = "remove me";
const searchKey = "userPK";
// const sortConfig = [
//   { name: "Interactions (total)", field: "total" },
//   { name: "Interactions (24 hours)", field: "last24H" },
// ];
const sortByDefault = "createdAt";
const sortDirDefault = "desc";
const transform = async (data) => {
  let modified = await Promise.allSettled(
    data.map(async (record, index) => {
      let hidden = false;
      let url = undefined;
      let fileType = undefined;
      let skappName = undefined;
      let skappUrl = undefined;

      if (record.metadata.content) {
        if (record.metadata.content.link) {
          let link = record.metadata.content.link;
          url = await client.getFullDomainUrl(record.skapp);
          let hash = link.substring(link.indexOf("#") + 1);
          url = hash ? url + "#" + hash : url;
        }
      } else {
        url = await client.getSkylinkUrl(record.identifier, { subdomain: true });
      }

      if (record.metadata) {
        fileType = record.metadata.contentType;
      }

      if (skappNames[record.skapp]) {
        skappName = skappNames[record.skapp].name;
        skappUrl = await client.getFullDomainUrl(record.skapp);
      }

      return { ...record, hidden, url, fileType, skappName, skappUrl };
    })
  );

  modified = modified.map((record, index) => {
    return record.value;
  });

  modified = modified.filter((record, index) => {
    if (record) {
      return true;
    }

    return false;
  });

  return modified;
};

const entryTypeDisplay = { INTERACTION: "Interacted", NEWCONTENT: "Created", POST: "Post", COMMENT: "Comment" };
const dateToFormat = "MM/DD/YYYY HH:mm:ss";

const render = (record, pos, userID) => {
  return (
    <>
      <div className={"px-4 py-4 sm:px-6" + (userID === record.creator ? " bg-green-50" : "")}>
        <div className="flex items-center justify-between space-x-8">
          <div className="flex flex-row space-x-16 truncate">
            <div className="flex items-center text-sm text-palette-600 font-semibold">
              <span className="text-gray-400 w-10">{entryTypeDisplay[record.entryType]}</span>
            </div>
            <div className="text-sm truncate">
              {record.url ? <Link href={record.url}>{record.identifier}</Link> : record.identifier}
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col xl:flex-row text-sm xl:space-x-4 xl:text-right tabular-nums">
            {record.fileType && (
              <span className="text-xs inline-flex items-center font-normal leading-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {record.fileType}
              </span>
            )}
            {record.skappName && (
              <span className="text-xs inline-flex items-center font-normal leading-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
                {record.skappUrl ? (
                  <Link className="text-green-700" href={record.skappUrl}>
                    {record.skappName}
                  </Link>
                ) : (
                  record.skappName
                )}
              </span>
            )}
            <p>
              <Moment format={dateToFormat}>{record.createdAt}</Moment>
              {/* <span className="text-gray-400 ml-2">total</span> */}
            </p>
            {/* <p className="xl:w-48">
              {record.last24H} <span className="text-gray-400 ml-2">in last 24h</span>
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default function SingleUserPage({ setTitle }) {
  const { showID } = useParams();
  const { userID } = useContext(SkynetContext);
  const [singleProfile, singleScores, singleAvatar, setID] = useProfile();
  const [connections] = useState([]);
  const [adminView, setAdminView] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy] = useState(sortByDefault);
  const [sortDir] = useState(sortDirDefault);
  // const [sortBy, setSortBy] = useState(sortByDefault);
  // const [sortDir, setSortDir] = useState(sortDirDefault);

  useEffect(() => {
    setTitle("");
  }, [setTitle]);

  // useEffect(() => {
  //   if (singleProfile.connections) {
  //     let filledConnections = singleProfile.connections.filter((connection) => {
  //       for (const [, value] of Object.entries(connection)) {
  //         if (value) {
  //           return true;
  //         }

  //         return false;
  //       }

  //       return false;
  //     });

  //     setConnections(filledConnections);
  //   } else {
  //     setConnections([]);
  //   }
  // }, [singleProfile]);

  useEffect(() => {
    if (showID) {
      setID(showID);
      setSearch(showID);
    }
  }, [showID, setID]);

  useEffect(() => {
    if (userAdminList.includes(userID)) {
      setAdminView(true);
    } else {
      setAdminView(false);
    }
  }, [userID]);

  return (
    <main className="profile-page">
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link
              to="/leaderboard/users"
              className="group inline-flex items-center px-3 py-2 text-sm font-medium text-palette-400 rounded-md hover:text-palette-100 hover:bg-palette-400"
            >
              <ArrowCircleLeftIcon className="mr-4 h-6 w-6" aria-hidden="true" /> Go back to the list
            </Link>
          </div>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  {singleAvatar && (
                    <div
                      className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 bg-contain bg-no-repeat bg-center h-40 w-40"
                      style={{ backgroundImage: `url("${singleAvatar}")` }}
                    />
                  )}
                  {!singleAvatar && (
                    <UserCircleIcon className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 text-gray-200 h-40 w-40" />
                  )}
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  {/* <div className="py-6 px-3 mt-32 sm:mt-0">
                    {!!followsYou && <Tag>Follows You</Tag>}

                    {actionLoading && userID && (
                      <button
                        className="ml-16 bg-pink-500 active:bg-rose-300 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        type="button"
                        style={{ transition: "all 0.15s ease 0s" }}
                      >
                        [Spinner]
                      </button>
                    )}

                    {!areFollowing && !actionLoading && userID && (
                      <button
                        className="ml-16 bg-pink-500 active:bg-rose-300 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        type="button"
                        style={{ transition: "all 0.15s ease 0s" }}
                        onClick={() => followUser()}
                      >
                        Follow
                      </button>
                    )}
                    {areFollowing && !actionLoading && userID && (
                      <button
                        className="bg-pink-500 active:bg-rose-300 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        type="button"
                        style={{ transition: "all 0.15s ease 0s" }}
                        onClick={() => unfollowUser()}
                      >
                        Unfollow
                      </button>
                    )}
                  </div> */}
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-32">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block tracking-wide text-gray-700">
                        {singleScores.rank ? ordinal(singleScores.rank) : "-"}
                        {/* {singleScores.rank ? ordinal(singleScores.rank) : "-"} */}
                      </span>
                      <span className="text-sm text-gray-500">Rank</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        {singleScores.newContentTotal ? singleScores.newContentTotal : "-"}
                      </span>
                      <span className="text-sm text-gray-500">Content</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        {singleScores.interactionsTotal ? singleScores.interactionsTotal : "-"}
                      </span>
                      <span className="text-sm text-gray-500">Interactions</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h2 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 ">
                  {singleProfile.username ? singleProfile.username : "-"}
                </h2>
                {(singleProfile.firstName || singleProfile.lastname) && (
                  <h3 className="text-md font-semibold leading-normal mb-2 text-gray-600">
                    {singleProfile.firstName} {singleProfile.lastName}
                  </h3>
                )}
                <h4 className="text-md font-normal leading-normal mb-2 text-gray-600 mb-2">{showID ? showID : "-"}</h4>
                {singleProfile.location && (
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-semibold">
                    <span className="font-normal uppercase">Location:</span>{" "}
                    {singleProfile.location ? singleProfile.location : "Unknown"}
                  </div>
                )}
                {singleProfile.aboutMe && (
                  <div className="py-10 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <div className="font-thin uppercase mb-2 text-gray-500">About Me</div>
                        <p className="mb-4 text-lg leading-relaxed text-gray-800">{singleProfile.aboutMe}</p>
                      </div>
                    </div>
                  </div>
                )}
                {!!connections.length && (
                  <div className="py-10 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <div className="font-thin uppercase mb-2 text-gray-500">Connect</div>
                        {connections.map((connection, i) => {
                          return (
                            <p key={i} className="mb-4 text-lg leading-relaxed text-gray-800">
                              Connection Here
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {adminView && (
                  <div className="mb-2 text-gray-700 mt-10">
                    <pre>contact: {JSON.stringify(singleProfile.contact)}</pre>
                    <pre>{JSON.stringify(singleProfile.connections)}</pre>
                  </div>
                )}
                <div className="py-10 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {/* <SearchBar
              sortConfig={sortConfig}
              searchLabel={searchLabel}
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
            /> */}
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
        </div>
      </section>
    </main>
  );
}
