export const createStableId = (): string => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `tm-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};
