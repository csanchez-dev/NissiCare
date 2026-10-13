import { useState } from "react";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { PatientDetail } from "@/features/patients/components/PatientDetail";
import { PatientFormModal } from "@/features/patients/components/PatientFormModal";
import { PatientList } from "@/features/patients/components/PatientList";
import { usePatients } from "@/features/patients/hooks";
import type { PatientFilter } from "@/features/patients/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Header } from "@/layout/Header";

export default function App() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PatientFilter>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: patients = [] } = usePatients(useDebounce(search), filter);

  return (
    <div className={`app ${selectedId !== null ? "det" : ""}`}>
      <Header search={search} onSearch={setSearch} onNewPatient={() => setCreating(true)} />
      <main>
        <PatientList patients={patients} selectedId={selectedId} filter={filter} onFilterChange={setFilter} onSelect={setSelectedId} />
        <section className="pane">
          {selectedId === null ? (
            <Dashboard onOpen={setSelectedId} />
          ) : (
            <PatientDetail key={selectedId} id={selectedId} onBack={() => setSelectedId(null)} onDeleted={() => setSelectedId(null)} />
          )}
        </section>
      </main>
      {creating && <PatientFormModal onClose={() => setCreating(false)} onSaved={(p) => setSelectedId(p.id)} />}
    </div>
  );
}
