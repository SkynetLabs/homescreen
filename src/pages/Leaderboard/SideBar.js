import { Fragment, useState, useEffect, useContext } from "react";
import { SkynetContext } from "../../state/SkynetContext";
import MySkyButton from "../../components/MySkyButton";
import UserProfileCard from "../../components/UserProfileCard";
import { Dialog, Transition } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import {
  CubeTransparentIcon,
  CollectionIcon,
  UserGroupIcon,
  // UserIcon,
  XIcon,
  ArrowCircleLeftIcon,
  // GiftIcon,
} from "@heroicons/react/outline";
import { ReactComponent as Logo } from "../../svg/LogoWhiteText.svg";
import Link from "../../components/Link";

const navigation = [
  { name: "Explore Apps", to: "/leaderboard", Icon: CubeTransparentIcon, exact: true },
  { name: "Discover Content", to: "/leaderboard/content", Icon: CollectionIcon, exact: false },
  { name: "User Leaderboard", to: "/leaderboard/users", Icon: UserGroupIcon, exact: false },
  // { name: "MySky Profile", to: "/leaderboard/profile", icon: UserIcon },
  // { name: "Prizes", to: "/leaderboard/prizes", icon: GiftIcon },
];

const resources = [
  { name: "Getting started", href: "https://support.siasky.net/getting-started/using-skynet" },
  {
    name: "Hackathon blog",
    href: "https://blog.sia.tech/built-to-explore-the-skynet-spring-2021-hackathon-a0cff382bb0c",
  },
  { name: "Siasky.net", href: "https://siasky.net" },
];

const tools = [
  { name: "Rift - Data Explorer", href: "riftapp.hns/#/data" },
  { name: "SkyProfile Editor", href: "skyprofile.hns" },
];

const SidebarContent = () => {
  const { client } = useContext(SkynetContext);
  const [portalTools, setTools] = useState(tools);

  useEffect(() => {
    const initToolUrls = async () => {
      const portalIndepTools = await Promise.allSettled(
        tools.map(async (r) => {
          let href = await client.getFullDomainUrl(r.href.split("#")[0], { subdomain: true });
          if (r.href.split("#")[1]) {
            href = href + "/#" + r.href.split("#")[1];
          }

          return { ...r, href };
        })
      );

      const portalIndepToolsResolved = portalIndepTools.map((r) => {
        return r.value;
      });

      setTools(portalIndepToolsResolved);
    };

    if (client) {
      initToolUrls();
    }
  }, [client]);

  return (
    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-palette-500 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <Logo className="h-8 w-auto" />
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-8 bg-palette-500" aria-label="Sidebar">
          <div className="space-y-1">
            {navigation.map(({ name, Icon, ...props }) => (
              <NavLink
                key={name}
                activeClassName="active"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md nav-link"
                {...props}
              >
                <Icon className="mr-3 h-6 w-6" aria-hidden="true" />
                {name}
              </NavLink>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="resources-headline">
              Resources
            </h3>
            <div className="space-y-1" role="group" aria-labelledby="projects-headline">
              {resources.map(({ name, ...props }) => (
                <Link
                  key={name}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-palette-200 rounded-md hover:text-palette-100 hover:bg-palette-400"
                  {...props}
                >
                  <span className="truncate">{name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="resources-headline">
              Community Tools
            </h3>
            <div className="space-y-1" role="group" aria-labelledby="projects-headline">
              {portalTools.map(({ name, ...props }) => (
                <Link
                  key={name}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-palette-200 rounded-md hover:text-palette-100 hover:bg-palette-400"
                  {...props}
                >
                  <span className="truncate">{name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-shrink-0 flex p-4">
          <UserProfileCard />
        </div>
        <div className="flex-shrink-0 flex p-4">
          <MySkyButton />
        </div>
        <div className="flex-shrink-0 flex p-4">
          <Link
            to="/"
            className="group flex flex-grow items-center px-3 py-2 text-sm font-medium text-palette-200 rounded-md hover:text-palette-100 hover:bg-palette-400"
          >
            <ArrowCircleLeftIcon className="mr-4 h-6 w-6" aria-hidden="true" /> Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 lg:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-palette-600">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <SidebarContent />
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-palette-600 lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default SideBar;
