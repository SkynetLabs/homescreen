import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import classNames from "classnames";
import { toast } from "react-toastify";
import { mergeWith } from "lodash-es";
import { StateContext } from "../state/StateContext";
import { StorageContext } from "../state/StorageContext";
import Timeline from "./Timeline";

export default function DappDetails() {
  const { editing, setStateContext } = React.useContext(StateContext);
  const { isStorageProcessing, updateDapp } = React.useContext(StorageContext);
  const { dapps } = React.useContext(StorageContext);
  const dapp = dapps.find(({ id }) => id === editing);
  const open = Boolean(dapp);

  const formik = useFormik({
    initialValues: { name: "", description: "", skylink: "" },
    onSubmit: async (values) => {
      const updating = updateDapp(
        mergeWith({}, dapp, {
          skylink: values.skylink,
          metadata: { name: values.name, description: values.description },
        })
      );

      toast.promise(updating, {
        pending: "Updating, please wait",
        success: `All done!`,
        error: (error) => error.message,
      });

      try {
        await updating;
        handleClose();
      } catch (error) {
        console.log(error.message);
      }
    },
  });
  const { setValues } = formik;

  React.useEffect(() => {
    if (dapp) {
      setValues({
        name: dapp.metadata.name,
        description: dapp.metadata.description,
        skylink: dapp.skylink,
      });
    }
  }, [dapp, setValues]);

  const handleClose = () => {
    if (isStorageProcessing) return;

    setStateContext((stateContext) => ({ ...stateContext, editing: null }));
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={handleClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={React.Fragment}
            enter="ease-in-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={React.Fragment}
              enter="transform transition ease-in-out duration-200 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl">
                <form
                  className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="flex-1">
                    {/* Header */}
                    <div className="px-4 py-6 bg-gray-50 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {dapp?.metadata?.name}
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">{dapp?.metadata?.description}</p>
                        </div>
                        <div className="h-7 flex items-center">
                          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={handleClose}>
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider container */}
                    <div className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                      {/* Project name */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-name"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Name
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                          />
                        </div>
                      </div>

                      {/* Project description */}
                      <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="project-description"
                            className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                          >
                            Description
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <textarea
                            id="description"
                            name="description"
                            rows={2}
                            className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                          />
                        </div>
                      </div>

                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <Timeline
                            dapp={dapp}
                            activeSkylink={formik.values.skylink}
                            onChange={(skylink) => formik.setFieldValue("skylink", skylink)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6">
                    <div className="space-x-3 flex justify-end">
                      <button
                        type="button"
                        disabled={isStorageProcessing}
                        className={classNames(
                          "inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2 sm:text-sm",
                          {
                            "bg-white border-palette-300 hover:bg-palette-100": !isStorageProcessing,
                            "bg-palette-100 border-palette-200 text-palette-200 cursor-auto": isStorageProcessing,
                          }
                        )}
                        onClick={handleClose}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={isStorageProcessing}
                        className={classNames(
                          "inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2 sm:text-sm",
                          {
                            "bg-primary hover:bg-primary-light": !isStorageProcessing,
                            "border border-palette-200 bg-palette-100 cursor-auto text-palette-200":
                              isStorageProcessing,
                          }
                        )}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
