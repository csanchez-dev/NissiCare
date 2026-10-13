import { http } from "@/shared/api/httpClient";
import type { Patient, PatientFilter, PatientInput } from "./types";

export const patientsApi = {
  list: (q: string, filter: PatientFilter) => http.get<Patient[]>(`/patients?${new URLSearchParams({ q, filter })}`),
  get: (id: number) => http.get<Patient>(`/patients/${id}`),
  create: (data: PatientInput) => http.post<Patient>("/patients", data),
  update: (id: number, data: Partial<PatientInput>) => http.patch<Patient>(`/patients/${id}`, data),
  remove: (id: number) => http.delete(`/patients/${id}`),
};
