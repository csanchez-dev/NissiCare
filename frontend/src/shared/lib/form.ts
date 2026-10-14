/** Lectores tipados para FormData: convierten texto vacío en null cuando el campo es opcional. */
export const text = (data: FormData, key: string): string => String(data.get(key) ?? "").trim();

export const optionalText = (data: FormData, key: string): string | null => text(data, key) || null;

export const optionalNumber = (data: FormData, key: string): number | null => {
  const value = text(data, key);
  return value === "" ? null : Number(value);
};
