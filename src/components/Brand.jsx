export function Brand({ href = "#top", label = "Coworky" }) {
  return (
    <a className="brand" href={href} aria-label={label}>
      <span className="brand-mark" aria-hidden="true">
        <img src="/coworky.png" alt="" />
      </span>
      <span>Coworky</span>
    </a>
  );
}
