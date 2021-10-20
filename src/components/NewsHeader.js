import * as React from "react";
import { ReactComponent as ArrowRight } from "../svg/ArrowRight.svg";

const NewsHeader = () => {
  return (
    <div className="py-3 max-w-layout mx-auto text-center">
      <a
        href="https://www.eventbrite.com/e/ethlisbon-homescreen-event-tickets-192721594477"
        target="_blank"
        rel="noopener noreferrer"
        className="text-palette-500 font-content leading-8 inline-flex items-center overflow-hidden text-base hover:text-primary transition-colors duration-200"
      >
        <ArrowRight className="mr-2 flex-shrink-0 fill-current text-primary" />
        <span className="hidden sm:inline">Meet us at EthLisbon Homescreen Launch Event on Oct 21st</span>
        <span className="sm:hidden">EthLisbon Homescreen Launch Event on Oct 21st</span>
        <span className="ml-3">🎉🎉🎉</span>
      </a>
    </div>
  );
};

NewsHeader.propTypes = {};

NewsHeader.defaultProps = {};

export default NewsHeader;
