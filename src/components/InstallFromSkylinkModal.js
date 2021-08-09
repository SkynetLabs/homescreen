import React, { Fragment, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "./Link";
import skynetClient from "../services/skynetClient";
import SkappCard from "./SkappCard";
import getSkappMetadata from "../services/getSkappMetadata";
import { SkynetContext } from "../state/SkynetContext";
import { ReactComponent as Cog } from "../svg/Cog.svg";

export default function InstallFromSkylinkModal() {
  const { skylink } = useParams();
  const history = useHistory();
  const [skappData, setSkappData] = useState(null);
  const [open, setOpen] = useState(true);
  const { updateSkapp } = React.useContext(SkynetContext);
  const [processing, setProcessing] = React.useState(false);

  const closeButtonRef = useRef(null);
  const acceptButtonRef = useRef(null);

  const handleConfirm = async () => {
    setProcessing(true);
    await Promise.all([skynetClient.pinSkylink(skylink), updateSkapp(skylink, skappData)]);
    setProcessing(false);

    handleClose();
  };

  const handleClose = () => {
    if (processing) return;

    setOpen(false);
    history.replace("/");
  };

  React.useEffect(() => {
    (async () => {
      if (skylink) {
        setProcessing(true);

        const skylinkUrl = await skynetClient.getSkylinkUrl(skylink);
        const data = { skylink, skylinkUrl };

        try {
          const metadata = await getSkappMetadata(skylinkUrl);

          if (metadata.title) data.name = metadata.title;
          if (metadata.description) data.description = metadata.description;
          if (metadata.logo) data.icon = metadata.logo.url;
        } catch (error) {
          // couldn't fetch metadata
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
                        <Link href={skappData?.skylinkUrl}>{skylink}</Link>
                      </p>

                      <div className="py-4">
                        {skappData ? (
                          <SkappCard skapp={skappData} actions={false} />
                        ) : (
                          <span className="flex items-center justify-center">
                            <Cog className="mr-2 h-6 w-6 text-palette-600 animate-spin" aria-hidden="true" /> Loading
                            skapp metadata, please wait
                          </span>
                        )}
                      </div>

                      <p>This action will pin the skylink on the current portal and place it on your Homescreen.</p>
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
                      "bg-primary hover:bg-primary-light": !processing,
                      "border border-palette-300 bg-palette-100 cursor-auto": processing,
                    }
                  )}
                  onClick={handleConfirm}
                  disabled={processing}
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
