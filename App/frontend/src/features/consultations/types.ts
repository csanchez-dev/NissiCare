export interface ConsultationInput {
  consultedOn: string;
  reason: string;
  diagnosis: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  bloodPressure: string | null;
  heartRate: number | null;
  temperature: number | null;
  oxygenSaturation: number | null;
  weight: number | null;
}

export interface Consultation extends ConsultationInput {
  id: number;
  patientId: number;
}
