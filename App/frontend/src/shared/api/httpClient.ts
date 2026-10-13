const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = typeof body?.detail === "string" ? body.detail : "Revisa los datos e inténtalo de nuevo.";
    throw new ApiError(response.status, message);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

const withBody = (method: string) => <T>(path: string, body: unknown) =>
  request<T>(path, { method, body: JSON.stringify(body) });

/** Único punto de contacto con la red: el resto de la app no usa fetch. */
export const http = {
  get: <T>(path: string) => request<T>(path),
  post: withBody("POST"),
  patch: withBody("PATCH"),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
