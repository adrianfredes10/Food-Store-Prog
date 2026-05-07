export const API_URL = 'http://localhost:8000'

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = (await response.json()) as { detail?: string | unknown }
      if (typeof body.detail === 'string') {
        detail = body.detail
      }
    } catch {
      // si el cuerpo no es JSON, seguimos con el mensaje de estado de arriba
    }
    throw new Error(detail)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}
