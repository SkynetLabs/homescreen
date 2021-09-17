import * as React from "react";
import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import { Route, Switch } from "react-router-dom";
import { AuthContext } from "../state/AuthContext";
import { StorageContext } from "../state/StorageContext";
import DappGrid from "../components/DappGrid";
import DappDetails from "../components/DappDetails";
import MySkyButton from "../components/MySkyButton";
import Spinner from "../components/Spinner";
import Link from "../components/Link";
import FeatureSection from "../components/FeatureSection";
import HeaderSection from "../components/HeaderSection";
import InstallFromSkylink from "../components/InstallFromSkylink";
import InstallFromSkylinkModal from "../components/InstallFromSkylinkModal";
import { ReactComponent as ExternalLink } from "../svg/ExternalLink.svg";
import { ReactComponent as Github } from "../assets/simple-icons/github.svg";

const NotAuthenticated = () => {
  return (
    <div className="bg-white">
      <HeaderSection />
      <FeatureSection />
    </div>
  );
};

export default function Homescreen() {
  const { mySkyInitialising, user } = React.useContext(AuthContext);
  const { isStorageInitialised, dapps } = React.useContext(StorageContext);
  const showMySkyAuthSection = !mySkyInitialising && !user;
  const showInitialisingSpinner = mySkyInitialising || (user && !isStorageInitialised);
  const showEmptyDappsSection = isStorageInitialised && dapps.length === 0;
  const showDappsSection = isStorageInitialised && user && dapps.length > 0;
  const favorites = React.useMemo(() => dapps.filter(({ favorite }) => favorite), [dapps]);
  const others = React.useMemo(() => dapps.filter(({ favorite }) => !favorite), [dapps]);

  return (
    <div className="min-h-screen flex flex-col">
      <Disclosure as="nav" className="bg-white border-b border-palette-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 space-x-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="block lg:hidden h-8 w-auto" src="/logo/skynet.svg" alt="Workflow" />
                <img className="hidden lg:block h-8 w-auto" src="/logo/skynet-with-wordmark.svg" alt="Workflow" />
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {user && (
                <div className="hidden sm:flex sm:flex-1">
                  <InstallFromSkylink />
                </div>
              )}
              <MySkyButton />
            </div>
          </div>
          {user && (
            <div className="block sm:hidden">
              <InstallFromSkylink />
            </div>
          )}
        </div>
      </Disclosure>

      <div className="py-10 flex-1">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end sm:justify-between items-center">
            <h1
              className={classNames(
                "mt-1 text-xl font-extrabold text-palette-600 sm:text-2xl sm:tracking-tight lg:text-3xl hidden sm:block",
                { invisible: !user }
              )}
            >
              Your Homescreen
            </h1>

            <div className="flex flex-col text-right space-y-1">
              <Link
                href="https://support.siasky.net/key-concepts/homescreen"
                className="text-xs text-palette-400 hover:text-primary transition-colors inline-flex items-center justify-end"
              >
                Documentation and FAQ <ExternalLink className="fill-current inline-block" height={18} />
              </Link>
              <Link
                href="https://docs.siasky.net/integrations/homescreen/adding-homescreen-support-to-an-app "
                className="text-xs text-palette-400 hover:text-primary transition-colors inline-flex items-center justify-end"
              >
                Add Homescreen Support to Your App <ExternalLink className="fill-current inline-block" height={18} />
              </Link>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {showDappsSection && (
              <div className="px-4 py-8 sm:px-0 space-y-12">
                {favorites.length > 0 && <DappGrid title="Favorite Dapps" dapps={favorites} />}
                {others.length > 0 && <DappGrid title="All Dapps" dapps={others} />}
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
              <div className="py-8 sm:py-16 md:py-24 lg:py-32">
                <NotAuthenticated />
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

      {user && (
        <Switch>
          <Route path="/skylink/:skylink?">
            <InstallFromSkylinkModal />
          </Route>
        </Switch>
      )}

      <DappDetails />
    </div>
  );
}
