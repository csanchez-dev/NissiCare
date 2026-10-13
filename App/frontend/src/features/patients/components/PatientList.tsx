import { calcAge, initials } from "@/shared/lib/format";
import { Tag } from "@/shared/ui/Tag";
import type { Patient, PatientFilter } from "../types";

const FILTERS: { key: PatientFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "allergies", label: "Con alergias" },
  { key: "chronic", label: "Crónicos" },
];

interface Props {
  patients: Patient[];
  selectedId: number | null;
  filter: PatientFilter;
  onFilterChange: (filter: PatientFilter) => void;
  onSelect: (id: number) => void;
}

export function PatientList({ patients, selectedId, filter, onFilterChange, onSelect }: Props) {
  return (
    <section className="list" aria-label="Pacientes">
      <div className="chips">
        {FILTERS.map(({ key, label }) => (
          <button key={key} className={`chip ${filter === key ? "on" : ""}`} onClick={() => onFilterChange(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="items">
        {patients.length === 0 && (
          <div className="empty">
            No hay pacientes con esa búsqueda.
            <br />
            Prueba con otro nombre o diagnóstico.
          </div>
        )}
        {patients.map((p) => (
          <button key={p.id} className={`pt ${selectedId === p.id ? "on" : ""}`} onClick={() => onSelect(p.id)}>
            <span className="av">{initials(p.fullName)}</span>
            <div>
              <strong>{p.fullName}</strong>
              <small>
                {calcAge(p.birthDate)} años · {p.lastDiagnosis ?? "Sin consultas"}
              </small>
            </div>
            {p.allergies.length > 0 && <Tag tone="d">Alergia</Tag>}
          </button>
        ))}
      </div>
    </section>
  );
}
