import React, { Fragment, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { isSkylinkV2, parseSkylink } from "skynet-js";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import { toast } from "react-toastify";
import ms from "ms";
import classNames from "classnames";
import skynetClient from "../services/skynetClient";
import DappCard from "./DappCard";
import getDappMetadata from "../services/getDappMetadata";
import { StorageContext } from "../state/StorageContext";
import { ReactComponent as Cog } from "../svg/Cog.svg";

export default function InstallFromSkylinkModal() {
  const { skylink } = useParams();
  const history = useHistory();
  const [dappData, setDappData] = useState(null);
  const [open, setOpen] = useState(true);
  const { isStorageProcessing, updateDapp, dapps } = React.useContext(StorageContext);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState("");

  const closeButtonRef = useRef(null);
  const acceptButtonRef = useRef(null);

  const existingDapp = dapps.find(
    ({ resolverSkylink }) => resolverSkylink && resolverSkylink === dappData?.resolverSkylink
  );
  const existingDappDuplicate = existingDapp && existingDapp.skylink === dappData.skylink;

  const getResolvedSkylink = async (skylink) => {
    const url = await skynetClient.getSkylinkUrl(skylink, { endpointDownload: "/skynet/resolve/" });
    const { data } = await skynetClient.executeRequest({ url });

    return data.skylink;
  };

  const handleConfirm = async () => {
    setProcessing(true);

    const toastId = toast.loading("Pinning your dapp");

    try {
      await skynetClient.pinSkylink(dappData.skylink);
      toast.update(toastId, { render: "Adding dapp to your Homescreen" });
      await updateDapp(dappData);
      toast.success("All done!", { toastId, updateId: toastId });
      handleClose();
    } catch (error) {
      toast.error(error.message, { toastId, updateId: toastId });
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

        const data = { skylink };

        if (isSkylinkV2(validSkylink)) {
          data.resolverSkylink = validSkylink;
          data.skylink = await getResolvedSkylink(validSkylink);
        }

        try {
          const metadata = await getDappMetadata(data.skylink);

          data.metadata = {};
          if (metadata.name) data.metadata.name = metadata.name;
          if (metadata.description) data.metadata.description = metadata.description;
          if (metadata.themeColor) data.metadata.themeColor = metadata.themeColor;
          if (metadata.icon) data.metadata.icon = metadata.icon;

          // if resolved skylink is included in metadata then use it
          if (metadata.skylink && isSkylinkV2(metadata.skylink)) data.resolverSkylink = metadata.skylink;
        } catch (error) {
          // couldn't fetch metadata - ignore it
        }

        setProcessing(false);
        setDappData(data);
      } else {
        setDappData(null);
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
                    Adding new Skylink
                  </Dialog.Title>
                  {skylink && (
                    <div className="mt-4 text-sm space-y-4 text-palette-400">
                      {dappData ? (
                        <>
                          <DappCard dapp={dappData} actions={false} />
                          <Disclosure>
                            {({ open }) => (
                              <>
                                {!open && (
                                  <Disclosure.Button className="text-xs text-underline">
                                    show extended skylink details
                                  </Disclosure.Button>
                                )}
                                <Transition
                                  show={open}
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform scale-95 opacity-0"
                                  enterTo="transform scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform scale-95 opacity-0"
                                >
                                  <Disclosure.Panel static>
                                    {dappData && (
                                      <pre className="text-xs text-left overflow-auto p-2 shadow-sm rounded-md border border-palette-200">
                                        {JSON.stringify(dappData, null, 2)}
                                      </pre>
                                    )}
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Cog className="mr-2 h-6 w-6 text-palette-600 animate-spin" aria-hidden="true" /> Loading dapp
                          metadata, please wait
                        </span>
                      )}

                      {dappData && !dappData.metadata.name && !processing && (
                        <p className="text-xs text-error">
                          Either we couldn't find dapp metadata in the manifest or the dapp manifest was not found.
                        </p>
                      )}

                      {error && <p className="text-error">{error}</p>}

                      {existingDappDuplicate && <p>This version of the dapp is already saved to your Homescreen.</p>}

                      {existingDapp && !existingDappDuplicate && (
                        <p>
                          This dapp is already on your Homescreen but it resolves to a different skylink. Would you like
                          to update it to this specific skylink?
                        </p>
                      )}

                      {!existingDappDuplicate && (
                        <p>This action will pin the skylink on the current portal and place it on your Homescreen.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  className="hover:bg-palette-100 w-full inline-flex justify-center rounded-md border border-palette-300 shadow-sm px-4 py-2 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                  onClick={handleClose}
                  ref={closeButtonRef}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className={classNames(
                    "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2 sm:text-sm",
                    {
                      "bg-primary hover:bg-primary-light": !(processing || error || existingDappDuplicate),
                      "border border-palette-300 bg-palette-100 cursor-auto":
                        processing || error || existingDappDuplicate,
                    }
                  )}
                  onClick={handleConfirm}
                  disabled={processing || error || isStorageProcessing || existingDappDuplicate}
                  ref={acceptButtonRef}
                >
                  {processing ? "Please wait" : "Add to Homescreen"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
