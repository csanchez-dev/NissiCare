import { http } from "@/shared/api/httpClient";
import type { Consultation, ConsultationInput } from "./types";

export const consultationsApi = {
  listByPatient: (patientId: number) => http.get<Consultation[]>(`/patients/${patientId}/consultations`),
  recent: (limit: number) => http.get<Consultation[]>(`/consultations?limit=${limit}`),
  create: (patientId: number, data: ConsultationInput) =>
    http.post<Consultation>(`/patients/${patientId}/consultations`, data),
  remove: (id: number) => http.delete(`/consultations/${id}`),
};
