import * as React from "react";
import { Disclosure } from "@headlessui/react";
// import { Route, Switch } from "react-router-dom";
// import { AuthContext } from "../state/AuthContext";
// import { StorageContext } from "../state/StorageContext";
// import DappGrid from "../components/DappGrid";
// import MySkyButton from "../components/MySkyButton";
// import Spinner from "../components/Spinner";
import Link from "../components/Link";
import InstallFromCid from "../components/InstallFromCid";
// import InstallFromSkylink from "../components/InstallFromSkylink";
// import InstallFromSkylinkModal from "../components/InstallFromSkylinkModal";
import { ReactComponent as ExternalLink } from "../svg/ExternalLink.svg";
import { ReactComponent as Github } from "../assets/simple-icons/github.svg";

export default function Ipfs() {
  // const { mySkyInitialising, user } = React.useContext(AuthContext);
  // const { isStorageInitialised, dapps } = React.useContext(StorageContext);
  const [convertedItems, setConvertedItems] = React.useState([]);

  // const showMySkyAuthSection = !mySkyInitialising && !user;
  // const showInitialisingSpinner = mySkyInitialising || (user && !isStorageInitialised);
  // const showEmptyDappsSection = isStorageInitialised && dapps.length === 0;
  // const showDappsSection = isStorageInitialised && dapps.length > 0;
  // const favorites = React.useMemo(() => dapps.filter(({ favorite }) => favorite), [dapps]);
  // const others = React.useMemo(() => dapps.filter(({ favorite }) => !favorite), [dapps]);

  return (
    <div className="min-h-screen flex flex-col">
      <Disclosure as="nav" className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 space-x-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="block lg:hidden h-8 w-auto" src="/logo/skynet.svg" alt="Workflow" />
                <img className="hidden lg:block h-8 w-auto" src="/logo/skynet-with-wordmark.svg" alt="Workflow" />
              </div>
            </div>
            {/* {user && ( */}
            {/* <div className="flex items-center space-x-4 flex-1 justify-end"><MySkyButton /></div> */}
            {/* )} */}
          </div>
        </div>
      </Disclosure>

      <div className="py-10 flex-1">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Your Converted Files</h1>

            <div className="flex flex-col text-right space-y-1">
              <Link
                href="https://docs.siasky.net/developer-guides/moving-from-ipfs-to-skynet"
                className="text-xs text-palette-400 hover:text-primary transition-colors inline-flex items-center justify-end"
              >
                How IPFS Compares to Skynet
                <ExternalLink className="fill-current inline-block" height={18} />
              </Link>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 flex-1 justify-end mt-4">
              <InstallFromCid convertedItems={convertedItems} setConvertedItems={setConvertedItems} />
            </div>
            <div className="flex items-center space-x-4 flex-1 justify-end mt-4">
              <div className="text-right text-xs">
                <p>Examples:</p>
                <p>bafybeicihrp6cx5pvq6j7z3e534bdf2lep32g525f4asbrltd2ssn5mega</p>
                <p>QmaD9oBr38KDhiw5T69ygkA2hxx5yZqXcxSGFoo8yeTYXm</p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
              {convertedItems.length === 0 && (
                <>
                  <h2 className="text-xl font-semibold sm:text-2xl space-y-2 mb-12">
                    <span className="block">Convert some IPFS front-ends!</span>
                  </h2>

                  <p className="mt-4 text-md">Start by pasting a CID in the box above.</p>
                </>
              )}
              {convertedItems.length > 0 && <IpfsGrid title="Converted Links" convertedItems={convertedItems} />}
            </div>
          </div>
        </main>
      </div>
      <footer className="m-6 text-center text-sm leading-5 text-palette-200">
        <div className="inline-flex items-center">
          Open Source
          <a
            className="hover:underline inline-flex items-center ml-2"
            href="https://github.com/skynetlabs/homescreen"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github height="12" className="inline-block fill-current mr-1" /> GitHub
          </a>
          {process.env.REACT_APP_GIT_SHA && (
            <a
              href={`https://github.com/skynetlabs/homescreen/commit/${process.env.REACT_APP_GIT_SHA}`}
              className="ml-2 hover:underline"
            >
              #{process.env.REACT_APP_GIT_SHA.substr(0, 7)}
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}

function IpfsGrid({ title, convertedItems = [] }) {
  console.log(convertedItems);
  return (
    <div>
      <h2 className="text-gray-500 text-xs uppercase tracking-wide">{title}</h2>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-1 lg:grid-cols-1">
        {convertedItems.map((conversion) => (
          <li key={conversion[0]}>
            <IpfsCard conversion={conversion} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function IpfsCard({ conversion }) {
  const [cid, skylink, skylinkUrl] = conversion;

  return (
    <div key={cid} className="col-span-1 flex shadow-sm rounded-md border border-palette-200">
      <div className="flex-1 flex items-center justify-between truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate space-y-1 text-left">
          <Link href={skylinkUrl} className="font-semibold text-palette-600 hover:text-primary transition-colors">
            {skylink}
          </Link>

          <p className="text-palette-400 text-xs truncate">{cid}</p>
        </div>
      </div>
    </div>
  );
}
