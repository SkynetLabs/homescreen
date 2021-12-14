import * as React from "react";
import { ReactComponent as ArrowRight } from "../svg/ArrowRight.svg";
import Link from "./Link";

const NewsHeader = () => {
  return (
    <div className="py-3 mx-auto text-center max-w-layout">
      <a
        href="https://blog.sia.tech/1inch-integrates-with-homescreen-8146f7971aad"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center overflow-hidden text-base leading-8 transition-colors duration-200 text-palette-500 font-content hover:text-primary"
      >
        <span className="">🎉</span>
        <span className="">1inch integrates with Homescreen</span>
        <span className="">🎉</span>
      </a>
      <span className="mx-3">{" | "}</span>
      <Link
        to="/skylink/AQBbKr6XcwHWB3GGKTcn07Wk2wbezb-OFZIqyMUwMSC-qg"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center overflow-hidden text-base leading-8 transition-colors duration-200 text-palette-500 font-content hover:text-primary"
      >
        <span className="">Add 1inch to Homescreen</span>
        <ArrowRight className="flex-shrink-0 mr-2 fill-current text-primary" />
      </Link>
    </div>
  );
};

NewsHeader.propTypes = {};

NewsHeader.defaultProps = {};

export default NewsHeader;
