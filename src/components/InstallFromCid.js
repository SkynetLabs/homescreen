import * as React from "react";
// import { useHistory } from "react-router-dom";
// import { parseSkylink } from "skynet-js";
import uploadCidToSkynet from "../services/uploadCidToSkynet";
import { toast } from "react-toastify";

export default function InstallFromCid(props) {
  const [cid, setCid] = React.useState("");
  const { convertedItems, setConvertedItems } = props;
  // const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cid) {
      try {
        const [skylink, skylinkUrl] = await uploadCidToSkynet(cid);
        setConvertedItems([...convertedItems, [cid, skylink, skylinkUrl]]);
      } catch (error) {
        toast.error(error.message);
      }
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
          placeholder="Add from IPFS CID"
          className="shadow-sm focus:ring-primary focus:border-primary block w-full pr-12 text-sm border-palette-300 rounded-md hover:bg-palette-100 focus:bg-white"
          value={cid}
          onChange={(event) => setCid(event.target.value)}
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
