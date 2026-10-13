import { Tag } from "@/shared/ui/Tag";
import type { Consultation } from "../types";

export function VitalsTags({ consultation: c }: { consultation: Consultation }) {
  const items = [
    c.bloodPressure && `TA ${c.bloodPressure}`,
    c.heartRate != null && `FC ${c.heartRate}`,
    c.temperature != null && `${c.temperature} °C`,
    c.oxygenSaturation != null && `SpO₂ ${c.oxygenSaturation}%`,
    c.weight != null && `${c.weight} kg`,
  ].filter(Boolean);

  return (
    <div className="vit">
      {items.map((item) => (
        <Tag key={String(item)} tone="o">
          {item}
        </Tag>
      ))}
    </div>
  );
}
