import * as React from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import ms from "ms";
import { useHistory } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { StorageContext } from "../state/StorageContext";
import skynetClient from "../services/skynetClient";

const getResolvedSkylink = async (skylink) => {
  const url = await skynetClient.getSkylinkUrl(skylink, { endpointDownload: "/skynet/resolve/" });
  const { data } = await skynetClient.executeRequest({ url });

  return data.skylink;
};

export default function SkappOptions({ skapp }) {
  const { isStorageProcessing, updateSkapp, removeSkapp } = React.useContext(StorageContext);
  const history = useHistory();

  const handleRemove = () => {
    if (!isStorageProcessing) {
      const removing = removeSkapp(skapp.id);

      toast.promise(removing, {
        pending: "Removing skapp...",
        success: "Skapp removed!",
        error: (error) => `Failed removing skapp: ${error.message}`,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!isStorageProcessing) {
      const updating = updateSkapp({ ...skapp, favorite: !skapp.favorite });

      toast.promise(updating, {
        pending: skapp.favorite ? "Removing skapp from favorites" : "Adding skapp to favorites",
        success: skapp.favorite ? "Skapp removed from favorites" : "Skapp added to favorites",
        error: (error) => `Toggling favorites failed: ${error.message}`,
      });
    }
  };

  const handleCheckForUpdates = async () => {
    const toastId = toast.loading("Checking for updates...");

    try {
      const resolvedSkylink = await getResolvedSkylink(skapp.resolverSkylink);

      if (resolvedSkylink !== skapp.skylink) {
        history.push(`/skylink/${skapp.resolverSkylink}`);

        toast.dismiss(toastId);
      } else {
        toast.update(toastId, {
          render: "You have the latest version!",
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: ms("3s"),
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: `Failed checking for updates: ${error.message}`,
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: ms("10s"),
      });
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="p-1 hover:bg-palette-100 rounded-full flex items-center text-palette-400 hover:text-palette-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary">
              <span className="sr-only">Open options</span>
              <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item disabled={isStorageProcessing}>
                  {({ active, disabled }) => (
                    <button
                      type="button"
                      onClick={handleToggleFavorite}
                      className={classNames("block px-4 py-2 text-sm w-full text-left", {
                        "bg-palette-100": active,
                        "text-palette-300": disabled,
                        "text-palette-600": !disabled,
                      })}
                    >
                      {skapp.favorite ? "Remove from favorites" : "Add to favorites"}
                    </button>
                  )}
                </Menu.Item>

                {skapp.resolverSkylink && (
                  <Menu.Item>
                    {({ active, disabled }) => (
                      <button
                        type="button"
                        onClick={handleCheckForUpdates}
                        className={classNames("block px-4 py-2 text-sm w-full text-left", {
                          "bg-palette-100": active,
                          "text-palette-300": disabled,
                          "text-palette-600": !disabled,
                        })}
                      >
                        Check for updates
                      </button>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item disabled={isStorageProcessing}>
                  {({ active, disabled }) => (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className={classNames("block px-4 py-2 text-sm w-full text-left", {
                        "bg-palette-100": active,
                        "text-palette-300": disabled,
                        "text-palette-600": !disabled,
                      })}
                    >
                      Remove
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
