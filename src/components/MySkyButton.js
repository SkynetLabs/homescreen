import * as React from "react";
import { SkynetContext } from "../state/SkynetContext";
import { UserCircleIcon } from "@heroicons/react/outline";
import { ReactComponent as Spinner } from "../svg/Spinner.svg";
import classnames from "classnames";

const MySkyButton = () => {
  const { user, authenticate, authenticating, logout } = React.useContext(SkynetContext);

  const className =
    "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-palette-600 bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors";

  return (
    <>
      {/* not logged in */}
      {!authenticating && !user && (
        <button className={className} onClick={() => authenticate()}>
          <UserCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> Authenticate with MySky
        </button>
      )}

      {/* logging in */}
      {authenticating && (
        <button className={classnames(className, "cursor-auto")} disabled={true}>
          <Spinner className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> Waiting for authentication
        </button>
      )}

      {/* logged in */}
      {!authenticating && user && (
        <button
          className="inline-flex items-center px-4 py-2 border border-palette-300 shadow-sm text-sm font-medium rounded-md bg-white hover:bg-palette-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={logout}
        >
          Sign out from MySky
        </button>
      )}
    </>
  );
};

export default MySkyButton;
