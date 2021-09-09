import { Link as RouterLink } from "react-router-dom";

export const initialClasses = "text-primary hover:text-primary-light transition-colors duration-200";

export default function Link({ children, to, href, className = initialClasses, ...props }) {
  if (to) {
    return (
      <RouterLink to={to} className={className}>
        {children}
      </RouterLink>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
}
