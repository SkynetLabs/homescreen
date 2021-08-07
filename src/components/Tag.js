export default function Tag({ children }) {
  return (
    <span className="rounded bg-palette-100 px-2.5 py-1 text-xs font-semibold text-primary tracking-wide uppercase">
      {children}
    </span>
  );
}
