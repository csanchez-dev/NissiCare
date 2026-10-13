import { type FormEvent, type ReactNode, useEffect } from "react";

interface ModalProps {
  title: string;
  submitLabel?: string;
  isSaving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  children: ReactNode;
}

export function Modal({ title, submitLabel = "Guardar", isSaving, error, onClose, onSubmit, children }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  };

  return (
    <div className="bg" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-label={title} onSubmit={handleSubmit}>
        <h1 style={{ fontSize: 20 }}>{title}</h1>
        {children}
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <div className="acts">
          <button type="button" className="btn g" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn" disabled={isSaving}>
            {isSaving ? "Guardando…" : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
