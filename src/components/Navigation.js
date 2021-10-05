import * as React from "react";
import { Transition } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import searchSkylink from "../services/searchSkylink";
import { PlusCircleIcon, SearchIcon, LightBulbIcon, StarIcon, CogIcon } from "@heroicons/react/outline";
import MySkyButton from "../components/MySkyButton";
import Link from "../components/Link";
import { AuthContext } from "../state/AuthContext";
import Fuse from "fuse.js";
import { useDebounce } from "react-use";
import apps from "../state/apps.json";

const minMatchCharLength = 3;
const fuse = new Fuse(apps, {
  minMatchCharLength,
  includeScore: true,
  ignoreLocation: true,
  keys: ["applicationName", "description", "tags"],
});
const suggestions = [
  { item: apps.find(({ applicationName }) => applicationName === "Uniswap"), suggestion: true },
  { item: apps.find(({ applicationName }) => applicationName === "Compound"), suggestion: true },
];

const examples = [
  { name: "hns", value: "skynetlabs.hns" },
  { name: "ens", value: "uniswap.eth" },
  { name: "ipns", value: "ipns://app.uniswap.org" },
  { name: "sia", value: "sia://rg0ai2ul4qcusdeeama81h11qnu39c6s41dgp7oc718k7l59ksvm338" },
  { name: "ipfs", value: "sia://bafybeibol7v6laise7nuaf2lsf5lt4qdshirll27sxmssj6dizqske2nfq" },
];

const SearchButton = ({ onClick }) => {
  return (
    <button
      className="inline-flex items-center px-4 py-2 border border-palette-300 shadow-sm text-sm font-medium rounded-md bg-white hover:border-palette-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-palette-300 hover:text-palette-600"
      onClick={onClick}
    >
      <SearchIcon className="h-5 w-5 mr-3" aria-hidden="true" /> Find Apps
    </button>
  );
};

export default function Example() {
  const searchInput = React.useRef(null);
  const searchContainer = React.useRef(null);
  const applicationsContainer = React.useRef(null);
  const { user } = React.useContext(AuthContext);
  const [isAutocompleteVisible, setAutocompleteVisible] = React.useState(false);
  const [currentSearch, setCurrentSearch] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [applications, setApplications] = React.useState(suggestions);
  const history = useHistory();

  React.useEffect(() => {
    const close = (event) => event.which === 27 && isAutocompleteVisible && setAutocompleteVisible(false);

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [isAutocompleteVisible, setAutocompleteVisible]);

  const search = async (value) => {
    setProcessing(true);

    const parsed = await searchSkylink(value);

    if (parsed) {
      history.push(`/skylink/${parsed}`);

      setCurrentSearch("");
      setProcessing(false);
      setAutocompleteVisible(false);
    } else {
      toast.error("Invalid skylink or format not yet supported");
      setProcessing(false);
      searchInput.current.focus();
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();

    if (!processing) search(currentSearch);
  };

  useDebounce(
    () => {
      if (currentSearch) {
        setApplications(fuse.search(currentSearch, { limit: 5 }).filter(({ score }) => score < 0.5));
      } else {
        setApplications(suggestions);
      }
    },
    200,
    [currentSearch]
  );

  return (
    <nav className="bg-white border-b border-palette-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 space-x-4">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="block lg:hidden h-8 w-auto" src="/logo/skynet.svg" alt="Workflow" />
              <img className="hidden lg:block h-8 w-auto" src="/logo/skynet-with-wordmark.svg" alt="Workflow" />
            </div>
          </div>
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {user && (
              <div className="flex flex-1 justify-end">
                <SearchButton onClick={() => setAutocompleteVisible(!isAutocompleteVisible)} />
              </div>
            )}
            <MySkyButton />
          </div>
        </div>
      </div>

      <Transition show={isAutocompleteVisible}>
        <Transition.Child
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <div className="fixed w-screen h-screen bg-palette-100" onClick={() => setAutocompleteVisible(false)}></div>
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
          afterEnter={() => {
            document.documentElement.style.overflow = "hidden";
            searchInput.current.focus();
            searchContainer.current.addEventListener("keydown", (event) => {
              if (event.which === 38) {
                if (document.activeElement.previousSibling) {
                  document.activeElement.previousSibling.focus();
                } else {
                  searchInput.current.focus();
                }
              } else if (event.which === 40) {
                if (document.activeElement === searchInput.current) {
                  const firstChild = applicationsContainer.current.children[0];

                  if (firstChild) firstChild.focus();
                } else if (document.activeElement.nextSibling) {
                  document.activeElement.nextSibling.focus();
                }
              }
            });
          }}
          afterLeave={() => {
            setCurrentSearch("");
            document.documentElement.style.overflow = "auto";
          }}
        >
          <div className="absolute z-10 inset-x-0 transform shadow-lg bg-white">
            <div ref={searchContainer} className="space-y-8 sm:space-y-12 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
              <form className="max-w-3xl mx-auto relative" onSubmit={submitSearch}>
                <input
                  type="text"
                  spellCheck="false"
                  className="px-12 border-t-0 border-l-0 border-r-0 border-b border-palette-300 placeholder-palette-300 w-full text-center focus:ring-0 focus:border-4 focus:border-palette-600"
                  placeholder="search by app name, domain name or file hash"
                  disabled={processing}
                  onChange={(event) => setCurrentSearch(event.target.value)}
                  value={currentSearch}
                  ref={searchInput}
                />
                {processing ? (
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <CogIcon className="w-6 h-6 text-palette-300 animate-spin" />
                  </div>
                ) : (
                  <button className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <SearchIcon className="w-6 h-6 text-palette-300" />
                  </button>
                )}
              </form>

              <div className="max-w-3xl mx-auto space-y-2 divide-y divide-palette-200">
                <div className="flex justify-between">
                  <div className="text-palette-300 text-xs uppercase">Skynet Curated Homescreen-Ready Apps</div>
                  <div className="text-palette-300 text-xs uppercase">
                    <Link
                      href="https://github.com/SkynetLabs/Awesome-Homescreen"
                      className="text-palette-300 hover:text-palette-400"
                    >
                      Source
                    </Link>
                  </div>
                </div>

                {applications.length === 0 && (
                  <div className="text-center uppercase text-palette-300 font-semibold p-4">
                    {currentSearch.length < minMatchCharLength
                      ? `Type at least ${minMatchCharLength} characters`
                      : "No direct matches"}
                  </div>
                )}

                {applications.length > 0 && (
                  <div role="list" className="divide-y divide-palette-200" ref={applicationsContainer}>
                    {applications.map(({ item, score, suggestion }) => (
                      <button
                        type="button"
                        role="listitem"
                        key={item.resolverSkylink}
                        className="group flex w-full items-center px-4 py-4 sm:px-6 text-left hover:bg-palette-100 focus:bg-palette-100 cursor-pointer"
                        onClick={() => search(item.resolverSkylink)}
                      >
                        <div className="min-w-0 flex-1 flex items-center py-2 space-x-4">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md">
                            {suggestion ? (
                              <LightBulbIcon className="text-yellow-500" />
                            ) : (
                              <StarIcon className="text-yellow-500" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div>
                              <p className="text-sm font-medium text-palette-600 truncate">{item.applicationName}</p>
                              {item.description && (
                                <p className="text-palette-400 text-xs truncate">{item.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row items-center space-x-4">
                            {score < 0.1 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Great Match
                              </span>
                            )}
                            {suggestion && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-palette-200 text-palette-200">
                                Suggested App
                              </span>
                            )}
                            <PlusCircleIcon
                              className="h-5 w-5 text-palette-300 group-hover:text-primary group-focus:text-primary"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-palette-300 font-content space-y-2">
                {/* <div className="underline text-center">currently supported search pattern examples</div> */}

                <dl className="space-y-2">
                  <div className="flex flex-row md:grid md:grid-cols-3 space-x-4">
                    <dt className="w-10 md:w-auto"></dt>
                    <dd className="col-span-2 underline">currently supported patterns</dd>
                  </div>
                  {examples.map(({ name, value }) => (
                    <div key={name} className="flex flex-row md:grid md:grid-cols-3 space-x-4">
                      <dt className="text-right w-10 md:w-auto flex-shrink-0">{name}</dt>
                      <dd className="col-span-2 truncate">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </nav>
  );
}
