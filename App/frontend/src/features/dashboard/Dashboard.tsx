import { useRecentConsultations } from "@/features/consultations/hooks";
import { usePatients } from "@/features/patients/hooks";
import { formatDate } from "@/shared/lib/format";

const RECENT_LIMIT = 5;

export function Dashboard({ onOpen }: { onOpen: (patientId: number) => void }) {
  const { data: patients = [] } = usePatients("", "all");
  const { data: recent = [] } = useRecentConsultations(RECENT_LIMIT);
  const patientById = new Map(patients.map((p) => [p.id, p]));

  const stats = [
    { label: "Pacientes", value: patients.length, color: undefined },
    { label: "Con alergias", value: patients.filter((p) => p.allergies.length).length, color: "var(--dg)" },
    { label: "Con antecedentes", value: patients.filter((p) => p.conditions.length).length, color: "var(--pr)" },
  ];

  return (
    <>
      <div className="hero">
        <h1>Buenos días, doctor</h1>
        <p>Busca un paciente para ver su historia completa o crea una nueva consulta en segundos.</p>
      </div>

      <div className="grid g3" style={{ marginBottom: 16 }}>
        {stats.map(({ label, value, color }) => (
          <div className="card stat" key={label}>
            <span className="mu">{label}</span>
            <b style={{ color }}>{value}</b>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Consultas recientes</h2>
        {recent.length === 0 ? (
          <p className="mu">Todavía no hay consultas registradas.</p>
        ) : (
          <ul className="l">
            {recent.map((c) => (
              <li key={c.id}>
                <span>
                  <strong>{patientById.get(c.patientId)?.fullName ?? "Paciente"}</strong>
                  <br />
                  <span className="mu">{c.diagnosis} · {formatDate(c.consultedOn)}</span>
                </span>
                <button className="btn g sm" onClick={() => onOpen(c.patientId)}>Abrir</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
