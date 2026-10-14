import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useInvalidatingMutation } from "@/shared/api/useInvalidatingMutation";
import { patientsApi } from "./api";
import type { PatientFilter, PatientInput } from "./types";

export const patientKeys = {
  all: ["patients"] as const,
  list: (q: string, filter: PatientFilter) => [...patientKeys.all, "list", q, filter] as const,
  detail: (id: number) => [...patientKeys.all, "detail", id] as const,
};

export const usePatients = (q: string, filter: PatientFilter) =>
  useQuery({
    queryKey: patientKeys.list(q, filter),
    queryFn: () => patientsApi.list(q, filter),
    placeholderData: keepPreviousData,
  });

export const usePatient = (id: number) =>
  useQuery({ queryKey: patientKeys.detail(id), queryFn: () => patientsApi.get(id) });

const affected = [patientKeys.all];

export const useCreatePatient = () => useInvalidatingMutation(patientsApi.create, affected);

export const useUpdatePatient = () =>
  useInvalidatingMutation(({ id, data }: { id: number; data: Partial<PatientInput> }) => patientsApi.update(id, data), affected);

export const useDeletePatient = () => useInvalidatingMutation(patientsApi.remove, affected);
