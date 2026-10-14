import { useState } from "react";
import { ConsultationFormModal } from "@/features/consultations/components/ConsultationFormModal";
import { usePatientConsultations } from "@/features/consultations/hooks";
import { calcAge, initials } from "@/shared/lib/format";
import { useToast } from "@/shared/ui/Toast";
import { useDeletePatient, usePatient } from "../hooks";
import { PatientFormModal } from "./PatientFormModal";
import { TABS, type TabKey } from "./tabs";

interface Props {
  id: number;
  onBack: () => void;
  onDeleted: () => void;
}

export function PatientDetail({ id, onBack, onDeleted }: Props) {
  const toast = useToast();
  const { data: patient, isLoading, error } = usePatient(id);
  const { data: consultations = [] } = usePatientConsultations(id);
  const { mutate: deletePatient } = useDeletePatient();
  const [tab, setTab] = useState<TabKey>("summary");
  const [modal, setModal] = useState<"consultation" | "edit" | null>(null);

  if (isLoading) return <p className="mu">Cargando paciente…</p>;
  if (error || !patient) return <p className="alert" role="alert">{error?.message ?? "Paciente no encontrado"}</p>;

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar a ${patient.fullName} y todas sus consultas?`)) {
      deletePatient(id, {
        onSuccess: () => {
          toast("Paciente eliminado");
          onDeleted();
        },
      });
    }
  };

  const ActiveTab = TABS.find((t) => t.key === tab)!.Component;

  return (
    <>
      <button className="btn g sm back" onClick={onBack}>← Pacientes</button>

      <div className="top">
        <span className="av">{initials(patient.fullName)}</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1>{patient.fullName}</h1>
          <div className="mu">
            {calcAge(patient.birthDate)} años · {patient.sex === "F" ? "Femenino" : "Masculino"} · {patient.document}
            {patient.bloodType && ` · ${patient.bloodType}`}
          </div>
        </div>
        <div className="row">
          <button className="btn g sm" onClick={() => setModal("edit")}>Editar</button>
          <button className="btn danger sm" onClick={handleDelete}>Eliminar</button>
          <button className="btn" onClick={() => setModal("consultation")}>Nueva consulta</button>
        </div>
      </div>

      {patient.allergies.length > 0 && (
        <div className="alert" role="alert">
          <span>⚠</span>
          <span>Alergias: {patient.allergies.join(", ")}</span>
        </div>
      )}

      <div className="tabs" role="tablist">
        {TABS.map(({ key, label }) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`tab ${tab === key ? "on" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <ActiveTab patient={patient} consultations={consultations} />

      {modal === "consultation" && <ConsultationFormModal patientId={id} onClose={() => setModal(null)} />}
      {modal === "edit" && <PatientFormModal patient={patient} onClose={() => setModal(null)} />}
    </>
  );
}
