export type BackendStatusState = 'ONLINE' | 'OFFLINE' | 'CHECKING';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || null;

export async function checkBackendStatus(): Promise<BackendStatusState> {
  if (!API_BASE_URL) {
    return 'OFFLINE';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return 'ONLINE';
    }
    return 'OFFLINE';
  } catch {
    return 'OFFLINE';
  }
}
