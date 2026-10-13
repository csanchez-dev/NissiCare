import { useQuery } from "@tanstack/react-query";
import { useInvalidatingMutation } from "@/shared/api/useInvalidatingMutation";
import { patientKeys } from "@/features/patients/hooks";
import { consultationsApi } from "./api";
import type { ConsultationInput } from "./types";

export const consultationKeys = {
  all: ["consultations"] as const,
  byPatient: (patientId: number) => [...consultationKeys.all, "patient", patientId] as const,
  recent: (limit: number) => [...consultationKeys.all, "recent", limit] as const,
};

export const usePatientConsultations = (patientId: number) =>
  useQuery({ queryKey: consultationKeys.byPatient(patientId), queryFn: () => consultationsApi.listByPatient(patientId) });

export const useRecentConsultations = (limit: number) =>
  useQuery({ queryKey: consultationKeys.recent(limit), queryFn: () => consultationsApi.recent(limit) });

// Una consulta cambia también el "último diagnóstico" que muestra la lista de pacientes.
const affected = [consultationKeys.all, patientKeys.all];

export const useCreateConsultation = (patientId: number) =>
  useInvalidatingMutation((data: ConsultationInput) => consultationsApi.create(patientId, data), affected);

export const useDeleteConsultation = () => useInvalidatingMutation(consultationsApi.remove, affected);
