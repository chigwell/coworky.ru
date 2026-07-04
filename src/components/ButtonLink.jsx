export function ButtonLink({ className = "", children, ...props }) {
  return (
    <a className={`button ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}
