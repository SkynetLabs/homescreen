import * as React from "react";
import { useHistory } from "react-router-dom";
import { parseSkylink } from "skynet-js";
import { toast } from "react-toastify";

export default function InstallFromSkylink() {
  const [skylink, setSkylink] = React.useState("");
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (skylink) {
      try {
        const parsed = parseSkylink(skylink);

        if (parsed) {
          history.push(`/skylink/${parsed}`);

          setSkylink("");
        } else {
          toast.error("Invalid skylink!");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search" className="hidden text-sm font-medium text-gray-700">
        Quick search
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Add from skylink"
          className="shadow-sm focus:ring-primary focus:border-primary block w-full pr-12 sm:text-sm border-palette-300 rounded-md hover:bg-palette-100 focus:bg-white"
          value={skylink}
          onChange={(event) => setSkylink(event.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <button className="inline-flex items-center border border-palette-300 rounded px-2 text-sm font-sans font-medium text-palette-300">
            ⏎
          </button>
        </div>
      </div>
    </form>
  );
}
