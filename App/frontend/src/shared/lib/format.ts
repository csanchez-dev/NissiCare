export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const formatDate = (iso: string): string =>
  new Date(`${iso}T12:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

export const calcAge = (birthDate: string): number =>
  Math.floor((Date.now() - new Date(birthDate).getTime()) / 31_557_600_000);

export const initials = (fullName: string): string =>
  fullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
