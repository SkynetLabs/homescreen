import classnames from "classnames";
import Link from "./Link";

export default function Button({ children, buttonColor, ...props }) {
  const className = classnames(
    "block w-full rounded-md border border-transparent px-5 py-3 text-base font-semibold shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:px-10 transition-colors duration-200 text-center",
    {
      "bg-primary text-palette-600 hover:bg-primary-light": buttonColor === "primary",
      "bg-palette-600 text-white hover:bg-palette-500": buttonColor === "dark",
    }
  );

  if (props.href || props.to) {
    return (
      <Link className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  buttonColor: "primary",
};
