const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>,
  options?: { revalidate?: number },
): Promise<T | null> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  try {
    const res = await fetch(url.toString(), {
      headers: STRAPI_TOKEN
        ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
        : {},
      next: { revalidate: options?.revalidate ?? 60 },
    });
    if (!res.ok) return null;
    const json: StrapiResponse<T> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export function strapiMediaUrl(
  media: { url: string } | undefined | null,
  fallback: string,
): string {
  if (!media?.url) return fallback;
  if (media.url.startsWith("http")) return media.url;
  return `${STRAPI_URL}${media.url}`;
}
