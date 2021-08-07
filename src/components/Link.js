import { Link as RouterLink } from "react-router-dom";

export const classNameLink = "text-primary hover:text-primary-light transition-colors duration-200";

export default function Link({ children, to, className = classNameLink, ...props }) {
  if (to) {
    return (
      <RouterLink to={to} className={className}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a target="_blank" rel="noopener noreferrer" className={className} {...props}>
      {children}
    </a>
  );
}
