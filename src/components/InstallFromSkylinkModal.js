import React, { Fragment, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { isSkylinkV2, parseSkylink } from "skynet-js";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "./Link";
import skynetClient from "../services/skynetClient";
import SkappCard from "./SkappCard";
import getSkappMetadata from "../services/getSkappMetadata";
import { StorageContext } from "../state/StorageContext";
import { ReactComponent as Cog } from "../svg/Cog.svg";

export default function InstallFromSkylinkModal() {
  const { skylink } = useParams();
  const history = useHistory();
  const [skappData, setSkappData] = useState(null);
  const [open, setOpen] = useState(true);
  const { isStorageProcessing, updateSkapp } = React.useContext(StorageContext);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState("");

  const closeButtonRef = useRef(null);
  const acceptButtonRef = useRef(null);

  const getResolvedSkylink = async (skylink) => {
    const url = await skynetClient.getSkylinkUrl(skylink, { endpointDownload: "/skynet/resolve/" });
    const { data } = await skynetClient.executeRequest({ url });

    return data.skylink;
  };

  const handleConfirm = async () => {
    setProcessing(true);

    try {
      await Promise.all([skynetClient.pinSkylink(skappData.skylink), updateSkapp(skappData)]);
      handleClose();
    } catch (error) {
      console.log(error);
    }

    setProcessing(false);
  };

  const handleClose = () => {
    if (processing) return;

    setOpen(false);
    history.replace("/");
  };

  React.useEffect(() => {
    (async () => {
      if (skylink) {
        const validSkylink = parseSkylink(skylink);

        if (!validSkylink) {
          return setError("Your skylink is invalid!");
        }

        setProcessing(true);

        const data = { skylink, metadata: {} };

        if (isSkylinkV2(validSkylink)) {
          data.resolverSkylink = validSkylink;
          data.skylink = await getResolvedSkylink(validSkylink);
        }

        try {
          const metadata = await getSkappMetadata(data.skylink);

          if (metadata.name) data.metadata.name = metadata.name;
          if (metadata.description) data.metadata.description = metadata.description;
          if (metadata.icon) data.metadata.icon = metadata.icon;

          // if resolved skylink is included in metadata then use it
          if (metadata.skylink && isSkylinkV2(metadata.skylink)) data.resolverSkylink = metadata.skylink;
        } catch (error) {
          // couldn't fetch metadata - ignore it
        }

        setProcessing(false);
        setSkappData(data);
      } else {
        setSkappData(null);
      }
    })();
  }, [skylink]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={acceptButtonRef}
        open={open}
        onClose={handleClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium">
                    Adding new application
                  </Dialog.Title>
                  {skylink && (
                    <div className="mt-4 text-sm space-y-2 text-palette-400">
                      <p>You have requested to add a skylink to your Homescreen.</p>

                      <p>
                        <Link href={skappData?.requestedSkylinkUrl}>{skylink}</Link>
                      </p>

                      {skappData && skylink !== skappData.skylink && (
                        <>
                          <p>resolves to</p>

                          <p>
                            <Link href={skappData?.skylinkUrl}>{skappData.skylink}</Link>
                          </p>
                        </>
                      )}

                      {skappData && (
                        <div className="py-4">
                          <SkappCard skapp={skappData} actions={false} />
                        </div>
                      )}

                      {processing && (
                        <div className="py-4">
                          <span className="flex items-center justify-center">
                            <Cog className="mr-2 h-6 w-6 text-palette-600 animate-spin" aria-hidden="true" /> Loading
                            skapp metadata, please wait
                          </span>
                        </div>
                      )}

                      {skappData && !skappData.metadata.name && !processing && (
                        <p className="text-xs text-red-500">
                          Either we couldn't find skapp metadata in the manifest or the skapp manifest was not found.
                        </p>
                      )}
                      {error ? (
                        <p className="text-error">{error}</p>
                      ) : (
                        <p>This action will pin the skylink on the current portal and place it on your Homescreen.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={classNames(
                    "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2 sm:text-sm",
                    {
                      "bg-primary hover:bg-primary-light": !(processing || error),
                      "border border-palette-300 bg-palette-100 cursor-auto": processing || error,
                    }
                  )}
                  onClick={handleConfirm}
                  disabled={processing || error || isStorageProcessing}
                  ref={acceptButtonRef}
                >
                  {processing ? "Please wait" : "Add to Homescreen"}
                </button>

                <button
                  type="button"
                  className="hover:bg-palette-100 mt-3 w-full inline-flex justify-center rounded-md border border-palette-300 shadow-sm px-4 py-2 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={handleClose}
                  ref={closeButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
