import type { ReactNode } from "react";

export type Tone = "d" | "w" | "o" | "";

export function Tag({ tone = "", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`tag ${tone}`}>{children}</span>;
}
