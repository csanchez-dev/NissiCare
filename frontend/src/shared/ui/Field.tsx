import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  wide?: boolean;
  children: ReactNode;
}

/** Etiqueta + control. Cada formulario decide si el control es input, select o textarea. */
export function Field({ label, wide, children }: FieldProps) {
  return (
    <label className={wide ? "w" : undefined}>
      {label}
      {children}
    </label>
  );
}
