import * as React from "react";
import { Disclosure } from "@headlessui/react";
import { Route, Switch } from "react-router-dom";
import { AuthContext } from "../state/AuthContext";
import { StorageContext } from "../state/StorageContext";
import DappGrid from "../components/DappGrid";
import MySkyButton from "../components/MySkyButton";
import Spinner from "../components/Spinner";
import Link from "../components/Link";
import InstallFromSkylink from "../components/InstallFromSkylink";
import InstallFromSkylinkModal from "../components/InstallFromSkylinkModal";

export default function Homescreen() {
  const { mySkyInitialising, user } = React.useContext(AuthContext);
  const { isStorageInitialised, dapps } = React.useContext(StorageContext);

  const showMySkyAuthSection = !mySkyInitialising && !user;
  const showInitialisingSpinner = mySkyInitialising || (user && !isStorageInitialised);
  const showEmptyDappsSection = isStorageInitialised && dapps.length === 0;
  const showDappsSection = isStorageInitialised && dapps.length > 0;

  const favorites = dapps?.filter(({ favorite }) => favorite);
  const others = dapps?.filter(({ favorite }) => !favorite);

  return (
    <div className="min-h-screen bg-white">
      <Disclosure as="nav" className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="block lg:hidden h-8 w-auto" src="/logo/skynet.svg" alt="Workflow" />
                <img className="hidden lg:block h-8 w-auto" src="/logo/skynet-with-wordmark.svg" alt="Workflow" />
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <InstallFromSkylink />
                <MySkyButton />
              </div>
            )}
          </div>
        </div>
      </Disclosure>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Your Homescreen</h1>

            <div className="flex flex-col text-right space-y-1">
              <Link href="#" className="text-xs text-palette-400 hover:text-primary transition-colors">
                What is Homescreen
              </Link>
              <Link
                href="https://docs.siasky.net/integrations/homescreen/adding-homescreen-support-to-an-app "
                className="text-xs text-palette-400 hover:text-primary transition-colors"
              >
                How to add new dapps
              </Link>
              <Link
                href="https://docs.siasky.net/integrations/homescreen"
                className="text-xs text-palette-400 hover:text-primary transition-colors"
              >
                Documentation and FAQ
              </Link>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {showDappsSection && (
              <div className="px-4 py-8 sm:px-0 space-y-12">
                {favorites && Boolean(favorites.length) && <DappGrid title="Favorite Dapps" dapps={favorites} />}
                {others && Boolean(others.length) && <DappGrid title="All Dapps" dapps={others} />}
              </div>
            )}

            {showEmptyDappsSection && (
              <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-xl font-semibold sm:text-2xl space-y-2">
                  <span className="block">Welcome stranger!</span>
                  <span className="block text-primary">
                    This is your personal Skynet <span className="underline">Homescreen</span>.
                  </span>
                </h2>
                <p className="mt-4 text-md">
                  Start using your workspace by pasting one of your favorite skylinks in the box in header.
                </p>
                <p className="mt-4 text-md">
                  <span className="underline">In case you're new to Skynet</span> please make sure to read the
                  introduction materials listed in the top right corner.
                </p>
              </div>
            )}

            {showMySkyAuthSection && (
              <div className="px-4 py-32 sm:px-0 space-y-6 text-center">
                <p className="text-palette-500">Please authenticate with MySky to continue</p>
                <MySkyButton />
              </div>
            )}

            {showInitialisingSpinner && (
              <div className="px-4 py-32 sm:px-0 space-y-6 text-center">
                <Spinner />
                <p className="text-palette-500">Initialising Your Homescreen</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {user && (
        <Switch>
          <Route path="/skylink/:skylink?">
            <InstallFromSkylinkModal />
          </Route>
        </Switch>
      )}
    </div>
  );
}
