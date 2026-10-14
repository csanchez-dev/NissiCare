interface Props {
  search: string;
  onSearch: (value: string) => void;
  onNewPatient: () => void;
}

const toggleTheme = () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = isDark ? "light" : "dark";
};

export function Header({ search, onSearch, onNewPatient }: Props) {
  return (
    <header>
      <div className="logo">
        <i>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </i>
        <span>
          Nisssi<b>Care</b>
        </span>
      </div>
      <div className="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre, documento o diagnóstico"
          aria-label="Buscar paciente"
          autoComplete="off"
        />
      </div>
      <div className="sp" />
      <button className="btn g sm" onClick={toggleTheme} aria-label="Cambiar tema">◐</button>
      <button className="btn" onClick={onNewPatient}>
        <span>Nuevo paciente</span>
      </button>
    </header>
  );
}
