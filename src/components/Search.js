export default function Search() {
  return (
    <div>
      <label htmlFor="search" className="hidden text-sm font-medium text-gray-700">
        Quick search
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Find a dapp"
          className="shadow-sm focus:ring-primary focus:border-primary block w-full pr-12 sm:text-sm border-palette-300 rounded-md hover:bg-palette-100 focus:bg-white"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center border border-palette-300 rounded px-2 text-sm font-sans font-medium text-palette-300">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}
