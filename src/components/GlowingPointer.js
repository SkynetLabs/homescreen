import {
  ArrowCircleDownIcon,
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  ArrowCircleUpIcon,
} from "@heroicons/react/outline";

const GlowingPointer = ({ direction }) => {
  return (
    <div className="w-full px-4 animate-pulse">
      <div className="w-16 text-gray-500 mx-auto filter blur-xl -mb-16 z-0">
        <DirectionArrow direction={direction} />
      </div>
      <div className="w-16 text-gray-500 mx-auto z-40">
        <DirectionArrow direction={direction} />
      </div>
    </div>
  );
};

const DirectionArrow = ({ direction }) => {
  switch (direction) {
    case "up":
      return <ArrowCircleUpIcon className="text-primary" />;
    case "down":
      return <ArrowCircleDownIcon className="text-primary" />;
    case "left":
      return <ArrowCircleLeftIcon className="text-primary" />;
    case "right":
      return <ArrowCircleRightIcon className="text-primary" />;
    default:
      return null;
  }
};

export default GlowingPointer;
