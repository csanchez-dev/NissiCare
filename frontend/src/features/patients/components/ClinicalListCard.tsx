import { type FormEvent, useState } from "react";
import { Tag, type Tone } from "@/shared/ui/Tag";

interface Props {
  title: string;
  tone: Tone;
  items: string[];
  onChange: (items: string[]) => void;
}

/** Lista editable (alergias, antecedentes, medicación): una sola implementación para las tres. */
export function ClinicalListCard({ title, tone, items, onChange }: Props) {
  const [draft, setDraft] = useState("");

  const add = (event: FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p className="mu">Nada registrado.</p>
      ) : (
        <ul className="l">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>
              <Tag tone={tone}>{item}</Tag>
              <button className="mu" aria-label={`Quitar ${item}`} onClick={() => onChange(items.filter((_, i) => i !== index))}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className="inline" onSubmit={add}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Añadir…" aria-label={`Añadir a ${title}`} />
        <button className="btn g sm">Añadir</button>
      </form>
    </div>
  );
}
