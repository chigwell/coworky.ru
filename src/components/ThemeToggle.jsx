export function ThemeToggle({ onToggleTheme }) {
  return (
    <button className="theme-toggle" type="button" aria-label="Переключить тему" onClick={onToggleTheme}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path
          d="M12 3v2.2m0 13.6V21M4.7 4.7l1.55 1.55m11.5 11.5 1.55 1.55M3 12h2.2m13.6 0H21M4.7 19.3l1.55-1.55m11.5-11.5L19.3 4.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </button>
  );
}
