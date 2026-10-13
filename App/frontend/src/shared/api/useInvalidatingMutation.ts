import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

/** Mutación que refresca las consultas afectadas al terminar (evita repetir el patrón en cada hook). */
export function useInvalidatingMutation<TVars, TData>(
  mutationFn: (vars: TVars) => Promise<TData>,
  invalidates: QueryKey[],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => Promise.all(invalidates.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
}
