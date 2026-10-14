import type { ComponentType } from "react";
import { ConsultationTimeline } from "@/features/consultations/components/ConsultationTimeline";
import { VitalsTags } from "@/features/consultations/components/VitalsTags";
import type { Consultation } from "@/features/consultations/types";
import { calcAge, formatDate } from "@/shared/lib/format";
import { Sparkline } from "@/shared/ui/Sparkline";
import { ClinicalListCard } from "./ClinicalListCard";
import { useUpdatePatient } from "../hooks";
import type { ClinicalListKey, Patient } from "../types";
import type { Tone } from "@/shared/ui/Tag";

export interface TabProps {
  patient: Patient;
  consultations: Consultation[];
}

function SummaryTab({ patient, consultations }: TabProps) {
  const last = consultations[0];
  return (
    <div className="grid g2">
      <div className="card">
        <h2>Datos del paciente</h2>
        <dl>
          <dt>Documento</dt>
          <dd>{patient.document}</dd>
          <dt>Teléfono</dt>
          <dd>{patient.phone ?? "—"}</dd>
          <dt>Edad</dt>
          <dd>{calcAge(patient.birthDate)} años</dd>
          <dt>Grupo sanguíneo</dt>
          <dd>{patient.bloodType ?? "—"}</dd>
        </dl>
      </div>
      <div className="card">
        <h2>Medicación actual</h2>
        {patient.medications.length ? (
          <ul className="l">
            {patient.medications.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : (
          <p className="mu">Sin medicación registrada.</p>
        )}
      </div>
      <div className="card" style={{ gridColumn: "1/-1" }}>
        <h2>Última consulta{last && ` · ${formatDate(last.consultedOn)}`}</h2>
        {last ? (
          <>
            <strong>{last.reason}</strong>
            <div className="mu">{last.diagnosis}</div>
            <VitalsTags consultation={last} />
            <div className="soap">
              <p><b>Evaluación</b>{last.assessment || "—"}</p>
              <p><b>Plan</b>{last.plan || "—"}</p>
            </div>
          </>
        ) : (
          <p className="mu">Aún no hay consultas. Crea la primera.</p>
        )}
      </div>
    </div>
  );
}

function ConsultationsTab({ consultations }: TabProps) {
  return <ConsultationTimeline consultations={consultations} />;
}

const TRENDS: { label: string; unit: string; pick: (c: Consultation) => number | null }[] = [
  { label: "TA sistólica", unit: "mmHg", pick: (c) => (c.bloodPressure ? Number(c.bloodPressure.split("/")[0]) : null) },
  { label: "Frecuencia cardíaca", unit: "lpm", pick: (c) => c.heartRate },
  { label: "Peso", unit: "kg", pick: (c) => c.weight },
  { label: "Saturación O₂", unit: "%", pick: (c) => c.oxygenSaturation },
];

function VitalsTab({ consultations }: TabProps) {
  const chronological = [...consultations].reverse();
  if (consultations.length === 0) return <div className="empty">Sin signos vitales registrados.</div>;

  return (
    <div className="grid g3">
      {TRENDS.map(({ label, unit, pick }) => {
        const values = chronological.map(pick).filter((v): v is number => v !== null);
        return (
          <div className="card" key={label}>
            <span className="mu">{label}</span>
            <b style={{ display: "block", fontSize: 26 }}>
              {values.at(-1) ?? "—"} <small className="mu">{unit}</small>
            </b>
            <Sparkline values={values} />
          </div>
        );
      })}
    </div>
  );
}

const LISTS: { key: ClinicalListKey; title: string; tone: Tone }[] = [
  { key: "allergies", title: "Alergias", tone: "d" },
  { key: "conditions", title: "Antecedentes", tone: "w" },
  { key: "medications", title: "Medicación", tone: "o" },
];

function HistoryTab({ patient }: TabProps) {
  const { mutate } = useUpdatePatient();
  return (
    <div className="grid g2">
      {LISTS.map(({ key, title, tone }) => (
        <ClinicalListCard
          key={key}
          title={title}
          tone={tone}
          items={patient[key]}
          onChange={(items) => mutate({ id: patient.id, data: { [key]: items } })}
        />
      ))}
    </div>
  );
}

/** Registro de pestañas: añadir una nueva es añadir una fila, sin tocar PatientDetail. */
export const TABS = [
  { key: "summary", label: "Resumen", Component: SummaryTab },
  { key: "consultations", label: "Consultas", Component: ConsultationsTab },
  { key: "vitals", label: "Signos vitales", Component: VitalsTab },
  { key: "history", label: "Antecedentes", Component: HistoryTab },
] satisfies { key: string; label: string; Component: ComponentType<TabProps> }[];

export type TabKey = (typeof TABS)[number]["key"];
