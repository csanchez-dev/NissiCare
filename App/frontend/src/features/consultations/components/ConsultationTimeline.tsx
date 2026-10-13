import { formatDate } from "@/shared/lib/format";
import { Tag } from "@/shared/ui/Tag";
import { useToast } from "@/shared/ui/Toast";
import { useDeleteConsultation } from "../hooks";
import type { Consultation } from "../types";
import { VitalsTags } from "./VitalsTags";

const SOAP_LABELS = [
  ["subjective", "Subjetivo"],
  ["objective", "Objetivo"],
  ["assessment", "Evaluación"],
  ["plan", "Plan"],
] as const;

export function ConsultationTimeline({ consultations }: { consultations: Consultation[] }) {
  const toast = useToast();
  const { mutate: remove } = useDeleteConsultation();

  const handleDelete = (id: number) => {
    if (window.confirm("¿Eliminar esta consulta? No se puede deshacer.")) {
      remove(id, { onSuccess: () => toast("Consulta eliminada") });
    }
  };

  if (consultations.length === 0) {
    return <div className="empty">Este paciente aún no tiene consultas.</div>;
  }

  return (
    <div className="tl">
      {consultations.map((c, index) => (
        <details key={c.id} className="ev card" open={index === 0}>
          <summary>
            <span>
              <strong>{c.reason}</strong>
              <br />
              <span className="mu">{c.diagnosis}</span>
            </span>
            <Tag>{formatDate(c.consultedOn)}</Tag>
          </summary>
          <VitalsTags consultation={c} />
          <div className="soap">
            {SOAP_LABELS.map(([key, label]) => (
              <p key={key}>
                <b>{label}</b>
                {c[key] || "—"}
              </p>
            ))}
          </div>
          <div className="acts">
            <button className="btn danger sm" onClick={() => handleDelete(c.id)}>
              Eliminar consulta
            </button>
          </div>
        </details>
      ))}
    </div>
  );
}
