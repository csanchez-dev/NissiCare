export type Sex = "F" | "M";
export type PatientFilter = "all" | "allergies" | "chronic";
export type ClinicalListKey = "allergies" | "conditions" | "medications";

export interface PatientInput {
  fullName: string;
  document: string;
  birthDate: string;
  sex: Sex;
  phone: string | null;
  bloodType: string | null;
  allergies: string[];
  conditions: string[];
  medications: string[];
}

export interface Patient extends PatientInput {
  id: number;
  lastDiagnosis: string | null;
}
