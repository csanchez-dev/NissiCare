import { Field } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { useToast } from "@/shared/ui/Toast";
import { optionalText, text } from "@/shared/lib/form";
import { todayISO } from "@/shared/lib/format";
import { useCreatePatient, useUpdatePatient } from "../hooks";
import type { Patient, PatientInput, Sex } from "../types";

const toInput = (d: FormData, previous?: Patient): PatientInput => ({
  fullName: text(d, "fullName"),
  document: text(d, "document"),
  birthDate: text(d, "birthDate"),
  sex: text(d, "sex") as Sex,
  phone: optionalText(d, "phone"),
  bloodType: optionalText(d, "bloodType"),
  allergies: previous?.allergies ?? [],
  conditions: previous?.conditions ?? [],
  medications: previous?.medications ?? [],
});

interface Props {
  patient?: Patient; // si existe, el formulario edita; si no, crea
  onClose: () => void;
  onSaved?: (patient: Patient) => void;
}

export function PatientFormModal({ patient, onClose, onSaved }: Props) {
  const toast = useToast();
  const create = useCreatePatient();
  const update = useUpdatePatient();

  const save = (data: FormData) => {
    const input = toInput(data, patient);
    const options = {
      onSuccess: (saved: Patient) => {
        toast(patient ? "Paciente actualizado" : "Paciente creado");
        onSaved?.(saved);
        onClose();
      },
    };
    if (patient) update.mutate({ id: patient.id, data: input }, options);
    else create.mutate(input, options);
  };

  return (
    <Modal
      title={patient ? "Editar paciente" : "Nuevo paciente"}
      isSaving={create.isPending || update.isPending}
      error={(create.error ?? update.error)?.message}
      onClose={onClose}
      onSubmit={save}
    >
      <div className="f">
        <Field label="Nombre completo" wide>
          <input name="fullName" defaultValue={patient?.fullName} required minLength={2} autoFocus />
        </Field>
        <Field label="Documento">
          <input name="document" defaultValue={patient?.document} required minLength={3} />
        </Field>
        <Field label="Fecha de nacimiento">
          <input name="birthDate" type="date" defaultValue={patient?.birthDate} max={todayISO()} required />
        </Field>
        <Field label="Sexo">
          <select name="sex" defaultValue={patient?.sex ?? "F"}>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
          </select>
        </Field>
        <Field label="Grupo sanguíneo">
          <input name="bloodType" defaultValue={patient?.bloodType ?? ""} placeholder="O+" maxLength={5} />
        </Field>
        <Field label="Teléfono" wide>
          <input name="phone" type="tel" defaultValue={patient?.phone ?? ""} />
        </Field>
      </div>
    </Modal>
  );
}
