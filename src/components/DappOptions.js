import * as React from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import ms from "ms";
import * as clipboardy from "clipboardy";
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

export default function DappOptions({ dapp }) {
  const { isStorageProcessing, updateDapp, removeDapp } = React.useContext(StorageContext);
  const history = useHistory();
  const actions = React.useMemo(
    () => [
      {
        name: (dapp) => (dapp.favorite ? "Remove from favorites" : "Add to favorites"),
        disabled: () => isStorageProcessing,
        onClick: (dapp) => {
          if (isStorageProcessing) return;

          const updating = updateDapp({ ...dapp, favorite: !dapp.favorite });

          toast.promise(updating, {
            pending: dapp.favorite ? "Removing dapp from favorites" : "Adding dapp to favorites",
            success: dapp.favorite ? "Dapp removed from favorites" : "Dapp added to favorites",
            error: (error) => `Toggling favorites failed: ${error.message}`,
          });
        },
      },
      {
        name: () => "Check for updates",
        hidden: (dapp) => !dapp.resolverSkylink,
        onClick: async (dapp) => {
          const toastId = toast.loading("Checking for updates...");

          try {
            const resolvedSkylink = await getResolvedSkylink(dapp.resolverSkylink);

            if (resolvedSkylink !== dapp.skylink) {
              history.push(`/skylink/${dapp.resolverSkylink}`);

              toast.dismiss(toastId);
            } else {
              toast.success("You have the latest version!", { toastId, updateId: toastId });
            }
          } catch (error) {
            toast.error(error.message, { toastId, updateId: toastId });
          }
        },
      },
      {
        name: () => "Copy direct skylink",
        onClick: async (dapp) => {
          await clipboardy.write(dapp.skylink);
          toast.success("Direct skylink copied to clipboard!");
        },
      },
      {
        name: () => "Copy resolver skylink",
        hidden: (dapp) => !dapp.resolverSkylink,
        onClick: async (dapp) => {
          await clipboardy.write(dapp.resolverSkylink);
          toast.success("Resolver skylink copied to clipboard!");
        },
      },
      {
        name: () => "Remove",
        disabled: () => isStorageProcessing,
        onClick: (dapp) => {
          if (isStorageProcessing) return;

          const removing = removeDapp(dapp.id);

          toast.promise(removing, {
            pending: "Removing dapp...",
            success: "Dapp removed!",
            error: (error) => `Failed removing dapp: ${error.message}`,
          });
        },
      },
    ],
    [isStorageProcessing, history, removeDapp, updateDapp]
  );

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
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-palette-100 focus:outline-none"
            >
              <div className="py-1">
                {actions
                  .filter((action) => !(action.hidden && action.hidden(dapp)))
                  .map((action, index) => (
                    <Menu.Item key={index} disabled={Boolean(action.disabled) && action.disabled(dapp)}>
                      {({ active, disabled }) => (
                        <button
                          type="button"
                          onClick={() => action.onClick(dapp)}
                          className={classNames("block px-4 py-2 text-sm w-full text-left", {
                            "bg-palette-100": active,
                            "text-palette-300": disabled,
                            "text-palette-600": !disabled,
                          })}
                        >
                          {action.name(dapp)}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
