import React, { Fragment, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { isSkylinkV2, parseSkylink } from "skynet-js";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import { toast } from "react-toastify";
import classNames from "classnames";
import { ExclamationIcon } from "@heroicons/react/outline";
import { skynetClient } from "../services/skynet";
import DappCard from "./DappCard";
import Link from "./Link";
import MySkyButton from "../components/MySkyButton";
import getDappMetadata from "../services/getDappMetadata";
import { StorageContext } from "../state/StorageContext";
import { AuthContext } from "../state/AuthContext";
import { ReactComponent as Cog } from "../svg/Cog.svg";
import { find, mergeWith } from "lodash-es";

function mergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export default function InstallFromSkylinkModal() {
  const { skylink } = useParams();
  const history = useHistory();
  const [dappData, setDappData] = useState(null);
  const [open, setOpen] = useState(true);
  const { user } = React.useContext(AuthContext);
  const { isStorageProcessing, updateDapp, dapps } = React.useContext(StorageContext);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState("");

  const closeButtonRef = useRef(null);
  const acceptButtonRef = useRef(null);

  // find and match existing dapp by resolver skylink
  const existingDapp = dappData?.resolverSkylink && find(dapps, { resolverSkylink: dappData.resolverSkylink });
  const isDuplicateRequest = existingDapp && existingDapp.skylink === dappData.skylink;
  const isUpdateRequest = Boolean(existingDapp) && !isDuplicateRequest;
  const isAddNewRequest = !existingDapp;

  const isConfirmDisabled = processing || error || isStorageProcessing || isDuplicateRequest;
  const isProcessing = processing || isStorageProcessing;

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
      await updateDapp(mergeWith({}, existingDapp, dappData, mergeCustomizer));
      toast.success("All done!", { toastId, updateId: toastId });
      handleClose(true);
    } catch (error) {
      toast.error(error.message, { toastId, updateId: toastId });
      setProcessing(false);
    }
  };

  const handleClose = (force = false) => {
    if (processing) {
      if (force) setProcessing(false);
      else return;
    }

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
          if (metadata.manifestPath) data.manifestPath = metadata.manifestPath;

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
                    Save to Homescreen
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

                      {dappData && !dappData.metadata.icon && !processing && (
                        <p className="text-orange-500 inline-flex items-center space-x-2">
                          <ExclamationIcon className="w-4 h-4 mr-2" /> manifest is missing or misconfigured:
                          <Link
                            href="https://docs.siasky.net/integrations/homescreen/adding-homescreen-support-to-an-app#3-configure-your-manifest-file"
                            className="text-orange-500 hover:text-orange-600 inline-flex items-center"
                          >
                            read more
                          </Link>
                        </p>
                      )}

                      {error && <p className="text-error">{error}</p>}

                      {isDuplicateRequest && <p>This version of the dapp is already saved to your Homescreen.</p>}

                      {isUpdateRequest && <p>Another version of this dapp is already on your Homescreen.</p>}

                      {isAddNewRequest && <p>This action will pin the skylink and place it on your Homescreen.</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  className="hover:bg-palette-100 flex-1 inline-flex justify-center rounded-md border border-palette-300 shadow-sm px-4 py-2 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={handleClose}
                  ref={closeButtonRef}
                >
                  Cancel
                </button>

                {user ? (
                  <button
                    type="button"
                    className={classNames(
                      "inline-flex flex-1 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2",
                      {
                        "bg-primary hover:bg-primary-light": !isConfirmDisabled,
                        "border border-palette-200 bg-palette-100 cursor-auto text-palette-200": isConfirmDisabled,
                      }
                    )}
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}
                    ref={acceptButtonRef}
                  >
                    {isProcessing ? "Please wait" : isUpdateRequest ? "Update" : "Add to Homescreen"}
                  </button>
                ) : (
                  <MySkyButton />
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
