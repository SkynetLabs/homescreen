import * as React from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { toast } from "react-toastify";
import searchSkylink from "../services/searchSkylink";
import { SearchIcon, CogIcon } from "@heroicons/react/outline";

export default function InstallFromSkylink() {
  const [skylink, setSkylink] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (skylink) {
      setProcessing(true);

      const parsed = await searchSkylink(skylink);

      if (parsed) {
        history.push(`/skylink/${parsed}`);

        setSkylink("");
      } else {
        toast.error("Invalid skylink or format not yet supported");
      }

      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 justify-end">
      <label htmlFor="search" className="hidden text-sm font-medium text-gray-700">
        Quick search
      </label>
      <div className="relative flex items-center flex-1 max-w-lg">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Add from skylink, hns domain or ens domain"
          className={classNames(
            "shadow-sm focus:ring-primary focus:border-primary block w-full text-sm border-palette-300 rounded-md",
            {
              "bg-palette-100 text-palette-400 pr-12": processing,
              "hover:border-palette-600 focus:bg-white pr-20": !processing,
            }
          )}
          value={skylink}
          onChange={(event) => setSkylink(event.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          {processing ? (
            <CogIcon className="w-6 h-6 text-palette-300 animate-spin" />
          ) : (
            <button className="inline-flex items-center border border-palette-300 rounded px-2 text-sm font-sans font-medium text-palette-300 hover:border-palette-600 hover:text-palette-600">
              <SearchIcon className="w-4 h-4 mr-2" /> Find
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
