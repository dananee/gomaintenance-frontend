export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Unable to connect to API server at ${API_BASE_URL}. Please ensure the backend is running.`
      );
    }
    throw error;
  }
}
