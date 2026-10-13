import { Field } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { useToast } from "@/shared/ui/Toast";
import { optionalNumber, optionalText, text } from "@/shared/lib/form";
import { todayISO } from "@/shared/lib/format";
import { useCreateConsultation } from "../hooks";
import type { ConsultationInput } from "../types";

const toInput = (d: FormData): ConsultationInput => ({
  consultedOn: todayISO(),
  reason: text(d, "reason"),
  diagnosis: text(d, "diagnosis"),
  subjective: text(d, "subjective"),
  objective: text(d, "objective"),
  assessment: text(d, "assessment"),
  plan: text(d, "plan"),
  bloodPressure: optionalText(d, "bloodPressure"),
  heartRate: optionalNumber(d, "heartRate"),
  temperature: optionalNumber(d, "temperature"),
  oxygenSaturation: optionalNumber(d, "oxygenSaturation"),
  weight: optionalNumber(d, "weight"),
});

const SOAP = [
  ["subjective", "Subjetivo: lo que refiere el paciente"],
  ["objective", "Objetivo: examen físico y resultados"],
  ["assessment", "Evaluación: impresión clínica"],
  ["plan", "Plan: tratamiento y seguimiento"],
] as const;

interface Props {
  patientId: number;
  onClose: () => void;
}

export function ConsultationFormModal({ patientId, onClose }: Props) {
  const toast = useToast();
  const { mutate, isPending, error } = useCreateConsultation(patientId);

  const save = (data: FormData) =>
    mutate(toInput(data), {
      onSuccess: () => {
        toast("Consulta guardada");
        onClose();
      },
    });

  return (
    <Modal title="Nueva consulta" isSaving={isPending} error={error?.message} onClose={onClose} onSubmit={save}>
      <div className="f">
        <Field label="Motivo de consulta" wide>
          <input name="reason" required minLength={2} autoFocus />
        </Field>
        <Field label="TA (mmHg)">
          <input name="bloodPressure" placeholder="120/80" pattern="\d{2,3}/\d{2,3}" />
        </Field>
        <Field label="FC (lpm)">
          <input name="heartRate" type="number" min={20} max={250} />
        </Field>
        <Field label="Temp. (°C)">
          <input name="temperature" type="number" step={0.1} min={30} max={45} />
        </Field>
        <Field label="SpO₂ (%)">
          <input name="oxygenSaturation" type="number" min={50} max={100} />
        </Field>
        <Field label="Peso (kg)">
          <input name="weight" type="number" step={0.1} min={1} />
        </Field>
        {SOAP.map(([name, label]) => (
          <Field key={name} label={label} wide>
            <textarea name={name} />
          </Field>
        ))}
        <Field label="Diagnóstico" wide>
          <input name="diagnosis" required minLength={2} />
        </Field>
      </div>
    </Modal>
  );
}
