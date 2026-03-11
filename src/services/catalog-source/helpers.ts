const DEFAULT_TIMEOUT_MS = 6000;

export const normalizeCatalogLookupValue = (value: string): string => {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

export const buildCatalogLookupKey = (artist: string, title: string): string => {
  return `${normalizeCatalogLookupValue(artist)}::${normalizeCatalogLookupValue(title)}`;
};

export const fetchJson = async <TPayload>(
  url: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<TPayload> => {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Catalog source request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TPayload;
};

export const parseYear = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const match = value.match(/^(\d{4})/);
  return match ? Number.parseInt(match[1], 10) : undefined;
};
