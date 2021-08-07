export function Header1({ children }) {
  return <h1 className="text-4xl font-extrabold text-palette-600 tracking-tight sm:text-5xl">{children}</h1>;
}

export function Header2({ children }) {
  return <h2 className="text-3xl font-extrabold text-palette-600 tracking-tight sm:text-4xl">{children}</h2>;
}

export function Header3({ children }) {
  return <h3 className="text-2xl text-palette-600 font-semibold tracking-tight sm:text-3xl">{children}</h3>;
}

export function Header4({ children }) {
  return (
    <h4 className="text-xl text-palette-600 font-semibold tracking-tight sm:text-2xl text-center sm:text-left lg:text-center">
      {children}
    </h4>
  );
}

export function Subheader({ children }) {
  return <p className="text-xl text-palette-400">{children}</p>;
}

export function Paragraph({ children }) {
  return <p className="text-lg text-palette-400 font-content">{children}</p>;
}
