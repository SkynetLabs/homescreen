import Link from "./Link";
import { XIcon } from "@heroicons/react/outline";

export default function TopBanner({ title, titleShort, linkUrl, linkTitle, allowDimiss }) {
  return (
    <div className="relative bg-primary">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="text-palette-600">
            <span className="md:hidden">{titleShort ?? title}</span>
            <span className="hidden md:inline">{title}</span>
            <span className="block sm:ml-2 sm:inline-block">
              <Link href={linkUrl} className="text-palette-600 font-semibold underline">
                {linkTitle} <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </p>
        </div>
        {allowDimiss && (
          <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
            <button
              type="button"
              className="flex p-2 rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

TopBanner.defaultProps = {
  linkTitle: "Learn more",
  allowDimiss: true,
};
