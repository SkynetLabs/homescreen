import classNames from "classnames";

export default function LoadMoreButton({ size, setSize, noMoreData = false }) {
  const handleLoadMore = () => {
    if (!noMoreData) {
      setSize(size + 1);
    }
  };

  return (
    <button
      type="button"
      className={classNames(
        "inline-flex items-center px-3.5 py-2 border shadow-sm text-sm leading-4 font-medium rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        {
          "bg-palette-100 text-palette-300 border-palette-200 cursor-auto": noMoreData,
          "hover:bg-palette-100 text-palette-500 border-palette-300 transition-colors duration-200": !noMoreData,
        }
      )}
      onClick={handleLoadMore}
      disabled={noMoreData}
    >
      {noMoreData ? "no more data" : "load more"}
    </button>
  );
}
