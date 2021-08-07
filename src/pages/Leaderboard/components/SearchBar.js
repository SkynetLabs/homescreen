import { Fragment } from "react";
import { SearchIcon } from "@heroicons/react/solid";

const Action = ({ children, ...props }) => (
  <button
    type="button"
    className="text-sm text-primary hover:text-primary-light transition-colors duration-200"
    {...props}
  >
    {children}
  </button>
);

export default function SearchBar({
  sortConfig,
  searchLabel,
  search,
  setSearch,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  searchActions,
}) {
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSortChange = (event) => {
    const [newSortBy, newSortDir] = event.target.value.split(":");

    if (newSortBy !== sortBy) setSortBy(newSortBy);
    if (newSortDir !== sortDir) setSortDir(newSortDir);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <label htmlFor="search" className="sr-only">
        {searchLabel}
      </label>
      <div className="flex space-x-4 w-full">
        <div className="relative rounded-md shadow-sm w-full lg:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder={searchLabel}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-shrink-0">
          {searchActions.map(({ name, ...props }, index) => (
            <Action key={index} {...props}>
              {name}
            </Action>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center space-y-4 lg:space-x-4 lg:space-y-0 w-full justify-end">
        <label htmlFor="sort" className="hidden lg:block text-sm font-medium text-gray-700 flex-shrink-0">
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md flex-grow lg:flex-grow-0"
          onChange={handleSortChange}
          value={`${sortBy}:${sortDir}`}
        >
          {sortConfig.map(({ field, name }) => (
            <Fragment key={field}>
              <option value={`${field}:asc`}>{name} ascending</option>
              <option value={`${field}:desc`}>{name} descending</option>
            </Fragment>
          ))}
        </select>
      </div>
    </div>
  );
}

SearchBar.defaultProps = {
  searchActions: [],
};
