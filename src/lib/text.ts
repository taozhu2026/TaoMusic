export const uniqueStrings = (values: string[]): string[] => {
  return [...new Set(values.filter(Boolean))];
};

export const sentenceCase = (value: string): string => {
  if (!value) {
    return value;
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

export const cleanModelText = (value: string): string => {
  return value.replace(/^["'`]+|["'`]+$/g, '').replace(/\s+/g, ' ').trim();
};
